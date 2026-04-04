"use server";

import { Resend } from 'resend';
import { validateEmail, sanitizeInput, rateLimit } from './lib/security';
import { logError } from './lib/monitoring';
import { headers } from 'next/headers';
import { prisma } from './lib/prisma';
import { Prisma } from '@prisma/client';

export type ActionState = {
  success: boolean;
  error: string | null;
  id: string | null;
  autoSent?: boolean;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function serveNotice(prevState: ActionState, formData: FormData): Promise<ActionState> {
  // 0. Security: Rate Limiting (Defense in Depth)
  const headerList = await headers();
  const mockReq = { headers: headerList } as unknown as Request;
  if (!rateLimit(mockReq, 5)) {
    return { success: false, error: 'Too many requests. Please try again in 60 seconds.', id: null };
  }

  const rawEmail = formData.get('email') as string;
  const rawCompanyName = formData.get('companyName') as string;
  const rawDetails = formData.get('details') as string;
  const rawAccount = formData.get('accountNumber') as string;

  // Input Validation and Sanitization
  const email = sanitizeInput(rawEmail);
  const companyName = sanitizeInput(rawCompanyName);
  const details = sanitizeInput(rawDetails);
  const accountNumber = sanitizeInput(rawAccount);

  if (!validateEmail(email)) {
    logError(new Error('Invalid email format provided'), { email });
    return { success: false, error: 'Invalid email address.', id: null };
  }

  if (details.length < 20) {
    return { success: false, error: 'Please provide more details (min 20 chars).', id: null };
  }

  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Automatic Lookup: Find the company's executive email
      const company = await tx.company.findUnique({
        where: { name: companyName }
      });

      const targetEmail = company?.escalationEmail;
      if (!targetEmail) {
        throw new Error(`Company "${companyName}" is not in our high-traffic database.`);
      }

      // 2. Record the Escalation
      const escalation = await tx.escalation.create({
        data: {
          userEmail: email,
          companyName: companyName,
          accountNumber: accountNumber,
          complaintDetails: details,
          status: 'PENDING',
          deadlineAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 day deadline
        }
      });

      // 3. Automated Routing via Resend
      const { data, error } = await resend.emails.send({
        from: 'escalations@noticeserved-ultra.com',
        to: targetEmail,
        cc: email, // Send copy to user
        subject: `FORMAL ESCALATION: Account ${accountNumber} (${companyName})`,
        html: `
          <h1>Executive Escalation Request</h1>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Account Ref:</strong> ${accountNumber}</p>
          <hr />
          <p>${details}</p>
        `
      });

      if (error) {
        throw new Error(`Resend email failed: ${error.message}`);
      }

      return await tx.escalation.update({
        where: { id: escalation.id },
        data: { status: 'SENT', sentAt: new Date() }
      });
    });

    return { success: true, id: result.id, error: null, autoSent: true };
  } catch (error: any) {
    logError(error, { email, companyName, action: 'serveNotice' });
    return { success: false, error: error.message || 'Failed to serve notice due to an unexpected error.', id: null };
  }
}