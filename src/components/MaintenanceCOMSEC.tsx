import React, { useState } from 'react';
import {
  Wrench,
  Lock,
  Radio,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ShieldAlert,
  Calendar,
  X,
  RefreshCw,
} from 'lucide-react';
import { MaintenanceRecord, Equipment, MilitaryUser } from '../types/military.ts';

interface MaintenanceCOMSECProps {
  maintenances: MaintenanceRecord[];
  equipment: Equipment[];
  users: MilitaryUser[];
  onScheduleMaintenance: (data: {
    equipmentId: string;
    technicianUserId: string;
    maintenanceType: 'PREVENTIVO' | 'CORRECTIVO' | 'ROTACION_CLAVES_CRIPTO' | 'CALIBRACION_RF' | 'AUDITORIA_COMSEC';
    severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
    scheduledDate?: string;
    findings?: string;
    nextDueDate?: string;
  }) => void;
  onCompleteMaintenance: (id: string, actionsTaken: string, cryptoRotated: boolean) => void;
  preSelectedEquipmentId?: string;
}

export const MaintenanceCOMSEC: React.FC<MaintenanceCOMSECProps> = ({
  maintenances,
  equipment,
  users,
  onScheduleMaintenance,
  onCompleteMaintenance,
  preSelectedEquipmentId,
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState(preSelectedEquipmentId || equipment[0]?.id || '');
  const [technicianUserId, setTechnicianUserId] = useState(users[0]?.id || '');
  const [maintenanceType, setMaintenanceType] = useState<
    'PREVENTIVO' | 'CORRECTIVO' | 'ROTACION_CLAVES_CRIPTO' | 'CALIBRACION_RF' | 'AUDITORIA_COMSEC'
  >('ROTACION_CLAVES_CRIPTO');
  const [severity, setSeverity] = useState<'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('ALTA');
  const [scheduledDate, setScheduledDate] = useState('');
  const [findings, setFindings] = useState('');

  // Modal para Completar Orden
  const [completingRecord, setCompletingRecord] = useState<MaintenanceRecord | null>(null);
  const [actionsTaken, setActionsTaken] = useState('');
  const [cryptoRotatedCheck, setCryptoRotatedCheck] = useState(true);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqId || !technicianUserId) return;

    onScheduleMaintenance({
      equipmentId: selectedEqId,
      technicianUserId,
      maintenanceType,
      severity,
      scheduledDate: scheduledDate || new Date().toISOString(),
      findings: findings || 'Mantenimiento técnico militar preventivo',
    });

    setShowScheduleModal(false);
    setFindings('');
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingRecord) return;

    onCompleteMaintenance(completingRecord.id, actionsTaken, cryptoRotatedCheck);
    setCompletingRecord(null);
    setActionsTaken('');
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 border border-rose-700 text-rose-300">CRÍTICA</span>;
      case 'ALTA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 border border-amber-700 text-amber-300">ALTA</span>;
      case 'MEDIA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 border border-blue-700 text-blue-300">MEDIA</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">BAJA</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Encabezado */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <span>Taller Técnico & Auditoría Criptográfica COMSEC</span>
          </h2>
          <p className="text-xs text-slate-400">
            Protocolos de inyección de llaves, calibración de radiofrecuencia y mantenimiento bajo normas MIL-STD
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-md shadow transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Programar Orden Técnica</span>
        </button>
      </div>

      {/* Lista de Registros de Mantenimiento */}
      <div className="space-y-3">
        {maintenances.map((record) => {
          const eq = equipment.find((e) => e.id === record.equipmentId);
          const technician = users.find((u) => u.id === record.technicianUserId);
          const isPending = record.status === 'PROGRAMADO' || record.status === 'EN_PROCESO';

          return (
            <div
              key={record.id}
              className={`bg-slate-900/90 border rounded-lg p-4 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                isPending ? 'border-amber-500/40 bg-slate-900' : 'border-slate-800'
              }`}
            >
              {/* Información Técnica */}
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-slate-400">{record.id.toUpperCase()}</span>
                  {getSeverityBadge(record.severity)}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                    {record.maintenanceType.replace(/_/g, ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      record.status === 'APROBADO_OPERATIVO'
                        ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                        : 'bg-amber-950 border border-amber-700 text-amber-300'
                    }`}
                  >
                    {record.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="mt-1">
                  <h4 className="text-sm font-bold text-white">
                    {eq ? eq.model : record.equipmentId}
                  </h4>
                  <p className="text-xs font-mono text-emerald-400">
                    SERIE MILITAR: {eq ? eq.serialNumber : 'N/A'}
                  </p>
                </div>

                {record.findings && (
                  <p className="text-xs text-slate-300 mt-1">
                    <strong className="text-slate-400 font-normal">Diagnóstico inicial: </strong>
                    {record.findings}
                  </p>
                )}

                {record.actionsTaken && (
                  <p className="text-xs text-emerald-400 mt-1">
                    <strong className="text-slate-400 font-normal">Acciones completadas: </strong>
                    {record.actionsTaken}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                  <span>
                    Técnico Responsable: {technician ? `${technician.rank} ${technician.lastName}` : record.technicianUserId}
                  </span>
                  <span>•</span>
                  <span>
                    Programado:{' '}
                    {record.scheduledDate ? new Date(record.scheduledDate).toLocaleDateString() : 'Inmediato'}
                  </span>
                  {record.cryptoKeysRotated && (
                    <>
                      <span>•</span>
                      <span className="text-purple-400 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Claves COMSEC Inyectadas
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Botón de Completar Orden si está pendiente */}
              {isPending && (
                <div className="shrink-0">
                  <button
                    onClick={() => {
                      setCompletingRecord(record);
                      setCryptoRotatedCheck(record.maintenanceType === 'ROTACION_CLAVES_CRIPTO');
                    }}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-bold transition-colors cursor-pointer shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprobar & Certificar Operatividad</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: Programar Orden de Mantenimiento */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <span>Programar Orden de Servicio Técnico & COMSEC</span>
              </h3>
              <p className="text-xs text-slate-400">
                Apertura de ficha de taller o rotación de material de cifra
              </p>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Equipo a Intervenir *</label>
                <select
                  required
                  value={selectedEqId}
                  onChange={(e) => setSelectedEqId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                >
                  {equipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      [{eq.serialNumber}] {eq.model} ({eq.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Tipo de Procedimiento *</label>
                  <select
                    value={maintenanceType}
                    onChange={(e) => setMaintenanceType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="ROTACION_CLAVES_CRIPTO">Rotación Claves Cripto COMSEC</option>
                    <option value="PREVENTIVO">Mantenimiento Preventivo</option>
                    <option value="CORRECTIVO">Mantenimiento Correctivo / Falla</option>
                    <option value="CALIBRACION_RF">Calibración Radiofrecuencia RF</option>
                    <option value="AUDITORIA_COMSEC">Auditoría de Seguridad COMSEC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Severidad / Prioridad</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica (Operación Inminente)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Técnico COMSEC / Oficial</label>
                  <select
                    value={technicianUserId}
                    onChange={(e) => setTechnicianUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.rank} {u.lastName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Fecha Programada</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Motivo y Diagnóstico</label>
                <textarea
                  rows={2}
                  placeholder="Detallar causa del ingreso, síntomas de fallo o directiva de recambio de llaves..."
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded cursor-pointer font-bold"
                >
                  Registrar Orden Técnica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Certificar y Finalizar Mantenimiento */}
      {completingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setCompletingRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Certificar Operatividad y Cierre</span>
              </h3>
              <p className="text-xs text-slate-400">
                Rubricar el informe de finalización y autorizar reincorporación táctica
              </p>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Acciones Realizadas en Taller *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ej. Inyección de nuevas llaves KEK mediante dispositivo SKL, calibración de potencia a 20W y verificación de sellado estanco..."
                  value={actionsTaken}
                  onChange={(e) => setActionsTaken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="cryptoRotatedCb"
                  checked={cryptoRotatedCheck}
                  onChange={(e) => setCryptoRotatedCheck(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="cryptoRotatedCb" className="text-purple-200 font-medium cursor-pointer">
                  Certifico que las matrices de cifrado fueron rotadas y validadas (Extiende vigencia 6 meses)
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCompletingRecord(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer font-bold"
                >
                  Certificar y Dar Alta Operativa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
