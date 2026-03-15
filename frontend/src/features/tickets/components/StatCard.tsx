import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accentClass: string;
}

export function StatCard({ label, value, icon: Icon, accentClass }: StatCardProps) {
  return (
    <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-wide text-slate-600 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}
