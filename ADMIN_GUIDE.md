# Admin Guide - Bypass.ai

## 🔐 1. Accessing the Dashboard
- Navigate to `/login`.
- Use your admin email and the password defined in your `.env` file (`ADMIN_PASSWORD`).
- Default credentials (dev): `admin@bypass.ai` / `admin123`.
- Once authenticated, visit the dashboard at `/admin-dashboard`.

## 📈 2. Monitoring Traffic & Escalations
- **Live Metrics**: 
    - **Total Searches**: Tracks every case created in the `Escalation` table.
    - **Successful Matches**: Tracks cases where the status is `SENT` (meaning the Resend API successfully accepted the email).
- **Audit Trail**: Every escalation is assigned a unique UUID. Use this ID to cross-reference logs in the Resend Dashboard if a user claims they didn't receive their CC copy.

## 🏢 3. Company Database Management (Critical)
The "CEO Escalation" feature depends on a direct match between the frontend selection and the database.
- **Matching Names**: The `name` in the `Company` table must exactly match the `name` strings in `lib/companies.ts`.
- **Escalation Emails**: The `serveNotice` action will fail if a company exists in the list but lacks an `escalationEmail` in the database.
- **Adding Companies**: Use `npx prisma studio` to add new companies to the `Company` table. Ensure `isActive` is set to `true`.

## 💬 4. Handling User Feedback
- Visit the bottom of the `/admin-dashboard` to see the Feedback list.
- **Mark as Read**: Clicking this triggers a Server Action that updates the database and removes the entry from the "Pending" view.
- **Rating Monitoring**: Pay close attention to 1-2 star ratings; these often indicate that an executive email address has bounced or changed.

## 💾 5. Data Export & Maintenance
- To export feedback, use the following Prisma command via your terminal:
  ```bash
  npx prisma studio
  ```
- Open the **Feedback** model, click **Export**, and choose **CSV**. This is the safest way to generate reports for stakeholders.
- For automated backups, consider connecting Supabase to a Google Sheet via Zapier.

## 🚀 6. Final Go-Live Checklist
1. **Verify Local Secrets**: Run `npm run deploy-check`.
2. **Push to Main**: `git add . && git commit -m "ready for deploy" && git push origin main`.
3. **Vercel Setup**:
    - Import repo to Vercel.
    - Set Node.js version to **20.x** or **22.x**.
    - Add `DATABASE_URL`, `RESEND_API_KEY`, and `ADMIN_PASSWORD` to Environment Variables.
4. **Database Sync**: Run `npx prisma db push` targeting your production DB to create the tables.