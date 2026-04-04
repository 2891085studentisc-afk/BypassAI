import { prisma } from "@/lib/prisma";
import { markFeedbackAsRead } from "./feedback-action";
import { Feedback } from "@prisma/client";

export default async function AdminDashboard() {
  const totalEscalations = await prisma.escalation.count();
  const successfulEscalations = await prisma.escalation.count({ where: { status: 'SENT' } });
  const feedbackList = await prisma.feedback.findMany({
    where: { isRead: false },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 bg-[#050816] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-white/40 text-sm uppercase">Total Searches</p>
          <p className="text-4xl font-bold text-[#C5A059]">{totalEscalations}</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-white/40 text-sm uppercase">Successful Matches</p>
          <p className="text-4xl font-bold text-green-400">{successfulEscalations}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="p-4 text-xs uppercase tracking-wider text-white/30">ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Message</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-white/20 text-sm italic">
                  No unread feedback at the moment.
                </td>
              </tr>
            ) : (
              feedbackList.map((f: Feedback) => (
                <tr key={f.id} className="border-t border-white/5">
                  <td className="p-4 font-mono text-[10px] text-white/30 select-all">
                    {f.id}
                  </td>
                  <td className="p-4">{f.name} ({f.email})</td>
                  <td className="p-4 text-[#C5A059]">{"★".repeat(f.rating)}</td>
                  <td className="p-4 text-sm text-white/60">{f.message}</td>
                  <td className="p-4">
                    <form action={async (formData) => {
                      await markFeedbackAsRead(formData);
                    }}>
                      <input type="hidden" name="id" value={f.id} />
                      <button type="submit" className="text-xs bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 cursor-pointer">Mark as Read</button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}