import type { TicketPriority } from '../../../core/models/ticket';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const priorityStyles: Record<TicketPriority, string> = {
  ALTA: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  MEDIA: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  BAJA: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
}
