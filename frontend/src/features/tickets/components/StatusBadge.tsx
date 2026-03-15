import type { TicketStatus } from '../../../core/models/ticket';

interface StatusBadgeProps {
  status?: TicketStatus;
  value?: TicketStatus;
}

const statusStyles: Record<TicketStatus, string> = {
  NUEVO: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  EN_PROCESO: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  PENDIENTE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
  RESUELTO: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  CANCELADO: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
};

export function StatusBadge({ status, value }: StatusBadgeProps) {
  const currentStatus = status ?? value ?? 'NUEVO';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ${statusStyles[currentStatus]}`}>
      {currentStatus.replace('_', ' ')}
    </span>
  );
}
