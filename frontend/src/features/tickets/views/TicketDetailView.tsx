import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Ticket } from '../../../core/models/ticket';
import type { TicketAudit } from '../../../core/models/audit';
import type { CatalogoIncidente } from '../../../core/models/catalogo';
import type { User } from '../../../core/models/user';
import { authService } from '../../auth/authService';
import { ticketService } from '../services/ticketService';
import { userService } from '../../users/services/userService';
import { useTheme } from '../../../core/hooks/useTheme';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Button } from '../../../shared/Button';

interface TicketDetailViewProps {
  onLogout: () => void;
}

const transitions: Record<Ticket['estado'], Ticket['estado'][]> = {
  NUEVO: ['EN_PROCESO'],
  EN_PROCESO: ['PENDIENTE', 'RESUELTO'],
  PENDIENTE: ['EN_PROCESO'],
  RESUELTO: [],
  CANCELADO: [],
};

export function TicketDetailView({ onLogout }: TicketDetailViewProps) {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const session = authService.getSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [audits, setAudits] = useState<TicketAudit[]>([]);
  const [catalogos, setCatalogos] = useState<CatalogoIncidente[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedCatalog, setSelectedCatalog] = useState('');
  const [saving, setSaving] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  const canEdit = session?.role === 'TECNICO' || session?.role === 'ADMIN';

  const loadData = useCallback(async () => {
    if (!ticketId) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [detail, auditData, catalogData, techData] = await Promise.all([
        ticketService.getById(ticketId),
        ticketService.listAudit(ticketId),
        ticketService.listCatalogos(),
        canEdit ? userService.list({ rol: 'TECNICO' }) : Promise.resolve([]),
      ]);
      setTicket(detail);
      setAudits(auditData);
      setCatalogos(catalogData);
      setTechnicians(techData);
      setSelectedAssignee(detail.tecnicoAsignadoId ?? '');
      setSelectedCatalog(detail.catalogoIncidenteId);
    } catch {
      setError('No fue posible cargar el detalle del incidente.');
    } finally {
      setLoading(false);
    }
  }, [canEdit, ticketId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const eligibleTechnicians = useMemo(() => {
    if (!ticket) {
      return technicians;
    }
    return technicians.filter((tech) => (tech.catalogoIds ?? []).includes(ticket.catalogoIncidenteId));
  }, [technicians, ticket]);

  const handleAssign = async () => {
    if (!ticket || !selectedAssignee) {
      return;
    }
    try {
      setSaving(true);
      const updated = await ticketService.assignTechnician(ticket.id, selectedAssignee);
      setTicket(updated);
      setSelectedAssignee(updated.tecnicoAsignadoId ?? '');
      setAudits(await ticketService.listAudit(ticket.id));
    } finally {
      setSaving(false);
    }
  };

  const handleTransition = async (nextStatus: Ticket['estado']) => {
    if (!ticket) {
      return;
    }
    try {
      setSaving(true);
      const fallbackTechId = technicians.find((t) => t.username === session?.username)?.id;
      const updated = await ticketService.updateStatus(ticket.id, {
        nextStatus,
        tecnicoAsignadoId: ticket.tecnicoAsignadoId ?? selectedAssignee ?? fallbackTechId,
      });
      setTicket(updated);
      setAudits(await ticketService.listAudit(ticket.id));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCatalog = async () => {
    if (!ticket || !selectedCatalog || selectedCatalog === ticket.catalogoIncidenteId) {
      return;
    }
    try {
      setSaving(true);
      const updated = await ticketService.updateCatalog(ticket.id, selectedCatalog);
      setTicket(updated);
      setAudits(await ticketService.listAudit(ticket.id));
    } finally {
      setSaving(false);
    }
  };

  const handleAddWorkNote = async () => {
    if (!ticket || !noteText.trim()) {
      return;
    }
    try {
      setNoteLoading(true);
      setNoteError(null);
      await ticketService.addWorkNote(ticket.id, noteText.trim());
      setAudits(await ticketService.listAudit(ticket.id));
      setNoteText('');
    } catch {
      setNoteError('No fue posible agregar la nota de trabajo.');
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <DashboardLayout
      username={session?.username}
      role={session?.role}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={onLogout}
      title={ticket ? `Incidente ${ticket.codigo}` : 'Detalle de Incidente'}
      subtitle="Vista completa del incidente, auditoría y acciones operativas."
      showNewTicketButton={false}
    >
      <section className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Volver
        </button>
      </section>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading || !ticket ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 text-[14px] text-slate-600 shadow-md dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-400">
          Cargando incidente...
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
              <h3 className="text-[18px] font-semibold">Información del Incidente</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="text-[12px] uppercase text-slate-500">Código</div>
                  <div className="text-[14px] font-semibold">{ticket.codigo}</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase text-slate-500">Estado</div>
                  <StatusBadge status={ticket.estado} />
                </div>
                <div>
                  <div className="text-[12px] uppercase text-slate-500">Prioridad</div>
                  <PriorityBadge priority={ticket.prioridad} />
                </div>
                <div>
                  <div className="text-[12px] uppercase text-slate-500">Resolución Límite</div>
                  <div className="text-[13px]">{new Date(ticket.resolucionLimite).toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[12px] uppercase text-slate-500">Título</div>
                <div className="text-[15px] font-semibold">{ticket.titulo}</div>
              </div>
              <div className="mt-3">
                <div className="text-[12px] uppercase text-slate-500">Descripción</div>
                <div className="text-[14px] text-slate-700 dark:text-slate-300">{ticket.descripcion}</div>
              </div>
            </article>

            <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
              <h3 className="text-[18px] font-semibold">Acciones</h3>
              {canEdit ? (
                <div className="mt-3 space-y-3">
                  <label className="field text-[13px]">
                    Técnico Asignado
                    <select value={selectedAssignee} onChange={(event) => setSelectedAssignee(event.target.value)}>
                      <option value="">Sin asignar</option>
                      {eligibleTechnicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>{tech.nombre} ({tech.area})</option>
                      ))}
                    </select>
                  </label>
                  <Button label={saving ? 'Guardando...' : 'Actualizar Asignación'} disabled={saving || !selectedAssignee} onClick={handleAssign} />

                  <label className="field text-[13px]">
                    Catálogo
                    <select value={selectedCatalog} onChange={(event) => setSelectedCatalog(event.target.value)}>
                      {catalogos.map((catalogo) => (
                        <option key={catalogo.id} value={catalogo.id}>{catalogo.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <Button label={saving ? 'Guardando...' : 'Cambiar Catálogo'} disabled={saving || selectedCatalog === ticket.catalogoIncidenteId} onClick={handleUpdateCatalog} />

                  <div className="space-y-2">
                    <div className="text-[12px] uppercase text-slate-500">Cambiar Estado</div>
                    <div className="flex flex-wrap gap-2">
                      {transitions[ticket.estado].map((nextStatus) => (
                        <Button
                          key={nextStatus}
                          variant="secondary"
                          label={nextStatus.replace('_', ' ')}
                          disabled={saving}
                          onClick={() => void handleTransition(nextStatus)}
                        />
                      ))}
                      {transitions[ticket.estado].length === 0 ? <span className="text-[13px] text-slate-500">Sin transiciones disponibles</span> : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-[14px] text-slate-600 dark:text-slate-400">Tu perfil es de consulta para este incidente.</div>
              )}
            </article>
          </section>

          <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
            {canEdit ? (
              <div className="mb-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <h4 className="mb-2 text-[14px] font-semibold">Agregar Nota de Trabajo</h4>
                <textarea
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Describe avance, diagnóstico o próximos pasos..."
                  rows={3}
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                />
                {noteError ? <div className="mt-2 text-[12px] text-red-600 dark:text-red-300">{noteError}</div> : null}
                <div className="mt-2 flex justify-end">
                  <Button
                    label={noteLoading ? 'Guardando nota...' : 'Agregar Nota'}
                    disabled={noteLoading || !noteText.trim()}
                    onClick={() => void handleAddWorkNote()}
                  />
                </div>
              </div>
            ) : null}
            <h3 className="text-[18px] font-semibold">Auditoría del Incidente</h3>
            {audits.length === 0 ? (
              <div className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">Sin eventos registrados.</div>
            ) : (
              <ul className="mt-3 space-y-2 text-[13px]">
                {audits.map((entry) => (
                  <li key={entry.id} className="rounded-md bg-slate-50 p-2 dark:bg-slate-800">
                    <div className="font-semibold">{entry.accion.replace('_', ' ')}</div>
                    <div className="text-slate-600 dark:text-slate-400">{entry.detalle}</div>
                    <div className="text-[12px] text-slate-500 dark:text-slate-500">{entry.actorUsername} ({entry.actorRol}) - {new Date(entry.fecha).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </DashboardLayout>
  );
}
