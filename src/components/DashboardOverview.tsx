import React from 'react';
import {
  Radio,
  Satellite,
  Lock,
  Server,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  ChevronRight,
  Zap,
  Building,
  ArrowUpRight,
} from 'lucide-react';
import { Equipment, MilitaryUnit, ActiveTab } from '../types/military.ts';

interface DashboardOverviewProps {
  equipment: Equipment[];
  units: MilitaryUnit[];
  comsecAlerts: { equipment: Equipment; daysLeft: number }[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectEquipment: (eq: Equipment) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  equipment,
  units,
  comsecAlerts,
  setActiveTab,
  onSelectEquipment,
}) => {
  const total = equipment.length;
  const operativos = equipment.filter((e) => e.status === 'OPERATIVO').length;
  const enMision = equipment.filter((e) => e.status === 'EN_MISION').length;
  const enMantenimiento = equipment.filter((e) => e.status === 'EN_MANTENIMIENTO').length;
  const reserva = equipment.filter((e) => e.status === 'DEPOSITO_RESERVA').length;

  const cryptoSecuredCount = equipment.filter((e) => e.cryptoModuleInstalled).length;
  const topSecretCount = equipment.filter((e) => e.securityClassification === 'TOP_SECRET').length;

  return (
    <div className="space-y-6">
      {/* Alerta de Vencimiento de Claves Criptográficas COMSEC */}
      {comsecAlerts.length > 0 && (
        <div className="bg-rose-950/70 border-l-4 border-rose-500 p-4 rounded-r-lg shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-rose-900/60 rounded text-rose-300">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-200 tracking-wide uppercase flex items-center gap-2">
                  Alerta Operacional COMSEC: Claves Criptográficas por Vencer
                  <span className="px-2 py-0.5 rounded text-xs bg-rose-900 border border-rose-700 text-rose-100 font-mono">
                    Prioridad Alfa
                  </span>
                </h3>
                <p className="text-xs text-rose-300 mt-1">
                  Existen {comsecAlerts.length} equipo(s) táctico(s) con vencimiento de llave KEK/TEK en los próximos días. La operación fuera de plazo provocará pérdida de cifrado y aislamiento de red.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {comsecAlerts.map(({ equipment: eq, daysLeft }) => (
                    <button
                      key={eq.id}
                      onClick={() => onSelectEquipment(eq)}
                      className="inline-flex items-center space-x-2 text-xs bg-rose-900/90 hover:bg-rose-800 text-rose-100 px-3 py-1.5 rounded border border-rose-600/60 cursor-pointer transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-rose-300" />
                      <span className="font-semibold">{eq.model}</span>
                      <span className="font-mono bg-rose-950 px-1.5 py-0.5 rounded text-rose-300">
                        {daysLeft <= 0 ? '¡VENCIDO!' : `${daysLeft} días restantes`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('maintenance')}
              className="text-xs font-semibold text-rose-200 hover:text-white bg-rose-900/80 hover:bg-rose-800 px-3 py-1.5 rounded flex items-center gap-1 border border-rose-600 transition-colors shrink-0 cursor-pointer"
            >
              <span>Gestionar COMSEC</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tarjetas de Métricas Principales (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Equipos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Material TIC</span>
            <div className="p-2 bg-slate-800 rounded text-slate-300">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{total}</span>
            <span className="text-xs text-emerald-400 font-medium">100% inventariado</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">{operativos} Operativos</span>
            <span>•</span>
            <span className="text-blue-400 font-bold">{enMision} En Misión</span>
          </div>
        </div>

        {/* Despliegue en Operación */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">En Misión / Campo</span>
            <div className="p-2 bg-blue-950 border border-blue-800/60 rounded text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-300 font-mono">{enMision}</span>
            <span className="text-xs text-blue-400 font-mono">
              {total > 0 ? `${Math.round((enMision / total) * 100)}% de la dotación` : '0%'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Con asignación activa y firma de custodia
          </div>
        </div>

        {/* Mantenimiento y Calibración */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Taller y Reparación</span>
            <div className="p-2 bg-amber-950 border border-amber-800/60 rounded text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-300 font-mono">{enMantenimiento}</span>
            <span className="text-xs text-amber-400 font-mono">{reserva} en Depósito</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            En proceso técnico o calibración de RF
          </div>
        </div>

        {/* Protección Criptográfica COMSEC */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Módulos de Cifrado</span>
            <div className="p-2 bg-purple-950 border border-purple-800/60 rounded text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-300 font-mono">{cryptoSecuredCount}</span>
            <span className="text-xs text-purple-300 font-medium">Cifrado Militar NSA Tipo 1</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span className="text-rose-400 font-bold">{topSecretCount} Top Secret</span> en salas de cifra
          </div>
        </div>
      </div>

      {/* Cuadrícula Principal de 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Distribución por Categoría TIC */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-lg p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Categorías de Tecnología e Informática Militar
              </h2>
              <p className="text-xs text-slate-400">
                Segmentación por subsistema táctico y de telecomunicaciones
              </p>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver catálogo completo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Radios Tácticos */}
            <div
              onClick={() => setActiveTab('inventory')}
              className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg cursor-pointer transition-all flex items-start space-x-3"
            >
              <div className="p-2 bg-emerald-950 border border-emerald-700/60 rounded text-emerald-400">
                <Radio className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Radiocomunicaciones Tácticas</h4>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {equipment.filter((e) => e.category === 'RADIO_TACTICO').length}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Transceptores HF/VHF/UHF, Harris Falcon III, Manpacks y Vehiculares.
                </p>
              </div>
            </div>

            {/* SATCOM */}
            <div
              onClick={() => setActiveTab('inventory')}
              className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg cursor-pointer transition-all flex items-start space-x-3"
            >
              <div className="p-2 bg-blue-950 border border-blue-700/60 rounded text-blue-400">
                <Satellite className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Comunicaciones Satelitales (SATCOM)</h4>
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {equipment.filter((e) => e.category === 'SATCOM').length}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Terminales Flyaway Banda X/Ka Militar, enlaces DVB-S2X y DAMA.
                </p>
              </div>
            </div>

            {/* Criptografía COMSEC */}
            <div
              onClick={() => setActiveTab('inventory')}
              className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg cursor-pointer transition-all flex items-start space-x-3"
            >
              <div className="p-2 bg-purple-950 border border-purple-700/60 rounded text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Criptografía & COMSEC</h4>
                  <span className="text-xs font-mono font-bold text-purple-400">
                    {equipment.filter((e) => e.category === 'CRIPTOGRAFIA_COMSEC').length}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Cifradores IP de grado NSA Type 1, TACLANE KG-175, inyectores de llaves.
                </p>
              </div>
            </div>

            {/* Servidores Rugerizados */}
            <div
              onClick={() => setActiveTab('inventory')}
              className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg cursor-pointer transition-all flex items-start space-x-3"
            >
              <div className="p-2 bg-cyan-950 border border-cyan-700/60 rounded text-cyan-400">
                <Server className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Informática & Servidores</h4>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {equipment.filter((e) => e.category === 'SERVIDORES_RUGERIZADOS').length}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Servidores tácticos MIL-STD-810G, blindaje electromagnético EMP.
                </p>
              </div>
            </div>

            {/* Redes de Campaña */}
            <div
              onClick={() => setActiveTab('inventory')}
              className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg cursor-pointer transition-all flex items-start space-x-3"
            >
              <div className="p-2 bg-teal-950 border border-teal-700/60 rounded text-teal-400">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Redes & Nodos de Campaña</h4>
                  <span className="text-xs font-mono font-bold text-teal-400">
                    {equipment.filter((e) => e.category === 'REDES_CAMPANA').length}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Switches y routers industriales Cisco Rugged, fibra óptica militar estanca.
                </p>
              </div>
            </div>

            {/* C4ISR y Guerra Electrónica */}
            <div
              onClick={() => setActiveTab('inventory')}
              className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg cursor-pointer transition-all flex items-start space-x-3"
            >
              <div className="p-2 bg-amber-950 border border-amber-700/60 rounded text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">C4ISR & Guerra Electrónica</h4>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {equipment.filter((e) => e.category === 'C4ISR_DRONES' || e.category === 'GUERRA_ELECTRONICA').length}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Estaciones de control UAV, monitoreo espectral y radiogoniometría.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Guarniciones Militares */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 shadow-md space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <span>Unidades de Destino</span>
            </h2>
            <p className="text-xs text-slate-400">
              Guarniciones y batallones asignados
            </p>
          </div>

          <div className="space-y-3">
            {units.map((unit) => {
              const assignedCount = equipment.filter((e) => e.currentUnitId === unit.id).length;
              return (
                <div
                  key={unit.id}
                  className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{unit.unitCode}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                        {unit.branch}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 font-medium">{unit.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{unit.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">{assignedCount}</span>
                    <p className="text-[10px] text-slate-500">equipos</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
