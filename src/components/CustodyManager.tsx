import React, { useState } from 'react';
import {
  FileCheck,
  Shield,
  UserCheck,
  Calendar,
  Key,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowDownLeft,
  X,
} from 'lucide-react';
import { CustodyLog, Equipment, MilitaryUnit, MilitaryUser } from '../types/military.ts';

interface CustodyManagerProps {
  custodies: CustodyLog[];
  equipment: Equipment[];
  units: MilitaryUnit[];
  users: MilitaryUser[];
  onAssignCustody: (data: {
    equipmentId: string;
    assignedToUserId: string;
    authorizedByUserId: string;
    militaryUnitId?: string;
    missionCode?: string;
    expectedReturnDate?: string;
    remarks?: string;
  }) => void;
  onReturnCustody: (custodyId: string, returnCondition: string, remarks?: string) => void;
  preSelectedEquipmentId?: string;
}

export const CustodyManager: React.FC<CustodyManagerProps> = ({
  custodies,
  equipment,
  units,
  users,
  onAssignCustody,
  onReturnCustody,
  preSelectedEquipmentId,
}) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState(preSelectedEquipmentId || equipment[0]?.id || '');
  const [assignedUserId, setAssignedUserId] = useState(users[0]?.id || '');
  const [authorizedUserId, setAuthorizedUserId] = useState(users[0]?.id || '');
  const [unitId, setUnitId] = useState(units[0]?.id || '');
  const [missionCode, setMissionCode] = useState('OPERACION_PATRULLA_TACTICA_2026');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [remarks, setRemarks] = useState('');

  // Modal de Devolución
  const [returningCustody, setReturningCustody] = useState<CustodyLog | null>(null);
  const [returnCondition, setReturnCondition] = useState('OPTIMO');
  const [returnNotes, setReturnNotes] = useState('');

  // Equipos disponibles para custodia
  const availableEquipment = equipment.filter(
    (e) => e.status === 'OPERATIVO' || e.status === 'DEPOSITO_RESERVA' || e.id === selectedEqId
  );

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqId || !assignedUserId || !authorizedUserId) return;

    onAssignCustody({
      equipmentId: selectedEqId,
      assignedToUserId: assignedUserId,
      authorizedByUserId: authorizedUserId,
      militaryUnitId: unitId,
      missionCode,
      expectedReturnDate: expectedReturnDate || undefined,
      remarks,
    });

    setShowAssignModal(false);
    setRemarks('');
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returningCustody) return;

    onReturnCustody(returningCustody.id, returnCondition, returnNotes);
    setReturningCustody(null);
    setReturnNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Encabezado y Acción */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>Actas de Entrega, Recepción y Custodia Militar</span>
          </h2>
          <p className="text-xs text-slate-400">
            Trazabilidad jurídica y cadena de custodia con rubrica de firma criptográfica
          </p>
        </div>

        <button
          onClick={() => setShowAssignModal(true)}
          className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-md shadow transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Rubricar Nueva Custodia</span>
        </button>
      </div>

      {/* Lista de Actas de Custodia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {custodies.map((custody) => {
          const eq = equipment.find((e) => e.id === custody.equipmentId);
          const recipient = users.find((u) => u.id === custody.assignedToUserId);
          const authorizer = users.find((u) => u.id === custody.authorizedByUserId);
          const unit = units.find((u) => u.id === custody.militaryUnitId);

          const isActive = custody.status === 'ACTIVA';

          return (
            <div
              key={custody.id}
              className={`bg-slate-900/90 border rounded-lg p-4 shadow-md flex flex-col justify-between space-y-3 ${
                isActive ? 'border-emerald-500/50 bg-gradient-to-b from-slate-900 to-slate-950' : 'border-slate-800'
              }`}
            >
              {/* Encabezado de la Tarjeta de Acta */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    ACTA N° {custody.id.toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      isActive
                        ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                        : 'bg-slate-800 border border-slate-700 text-slate-400'
                    }`}
                  >
                    {custody.status}
                  </span>
                </div>

                {/* Equipo Involucrado */}
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-white">
                    {eq ? eq.model : 'Material Táctico'}
                  </h4>
                  <p className="text-[11px] font-mono text-emerald-400">
                    SERIE: {eq ? eq.serialNumber : custody.equipmentId}
                  </p>
                </div>

                {/* Personal Militar Asignado */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      <strong className="text-slate-400 font-normal">Receptor: </strong>
                      {recipient ? `${recipient.rank} ${recipient.firstName} ${recipient.lastName}` : custody.assignedToUserId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      <strong className="text-slate-400 font-normal">Autorizó: </strong>
                      {authorizer ? `${authorizer.rank} ${authorizer.lastName}` : custody.authorizedByUserId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] text-slate-400">
                      Asignado: {new Date(custody.dateAssigned).toLocaleDateString()}
                    </span>
                  </div>

                  {custody.missionCode && (
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
                      MISIÓN: {custody.missionCode}
                    </div>
                  )}
                </div>

                {/* Hash Criptográfico de Integridad */}
                {custody.digitalSignatureHash && (
                  <div className="mt-3 p-2 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-slate-400 break-all">
                    <div className="flex items-center space-x-1 text-emerald-500 font-bold mb-0.5">
                      <Key className="w-3 h-3" />
                      <span>FIRMA DIGITAL SHA-256:</span>
                    </div>
                    {custody.digitalSignatureHash}
                  </div>
                )}
              </div>

              {/* Botón de Devolución si está Activa */}
              {isActive && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setReturningCustody(custody)}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-semibold cursor-pointer transition-colors border border-slate-700"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Descargar Material / Devolución</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: Nueva Asignación de Custodia */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAssignModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <span>Rubricar Acta de Custodia Militar</span>
              </h3>
              <p className="text-xs text-slate-400">
                Formalización de entrega bajo responsabilidad penal militar
              </p>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Seleccionar Equipo Táctico *</label>
                <select
                  required
                  value={selectedEqId}
                  onChange={(e) => setSelectedEqId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                >
                  {availableEquipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      [{eq.serialNumber}] {eq.model} - {eq.securityClassification}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Efectivo Militar Receptor *</label>
                  <select
                    required
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.rank} {u.firstName} {u.lastName} ({u.militaryId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Oficial que Autoriza *</label>
                  <select
                    required
                    value={authorizedUserId}
                    onChange={(e) => setAuthorizedUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.rank} {u.lastName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Código de Misión / Operación</label>
                  <input
                    type="text"
                    value={missionCode}
                    onChange={(e) => setMissionCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Fecha Prevista de Devolución</label>
                  <input
                    type="date"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Observaciones y Accesorios Entregados</label>
                <textarea
                  rows={2}
                  placeholder="Detallar antenas, cargadores de campaña, estuches de transporte impermeable..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer font-bold"
                >
                  Firmar y Emitir Acta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Descargo / Devolución de Material */}
      {returningCustody && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setReturningCustody(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white">Descargo de Custodia</h3>
              <p className="text-xs text-slate-400">
                Inspección física del equipo y reingreso al polvorín
              </p>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Estado de Recepción del Material</label>
                <select
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="OPTIMO">Óptimo (Completamente Operativo)</option>
                  <option value="DESGASTE_NORMAL">Desgaste Normal de Campaña</option>
                  <option value="CON_FALLA">Con Falla Técnica (Derivar a Taller)</option>
                  <option value="DAÑADO">Dañado en Misión</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Informe del Oficial Receptor</label>
                <textarea
                  rows={3}
                  placeholder="Verificación de estanqueidad, estado de conectores y accesorios..."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReturningCustody(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer font-bold"
                >
                  Confirmar Reingreso al Depósito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
