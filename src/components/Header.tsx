import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Radio,
  Server,
  FileCheck,
  Wrench,
  Download,
  Terminal,
  Database,
  Lock,
  Layers,
} from 'lucide-react';
import { ActiveTab } from '../types/military.ts';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  comsecAlertsCount: number;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  comsecAlertsCount,
  onOpenExportModal,
}) => {
  const [zuluTime, setZuluTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const zulu = now.toISOString().substring(11, 19) + ' Z';
      setZuluTime(zulu);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-slate-100 sticky top-0 z-40 shadow-xl">
      {/* Barra de Clasificación Militar Superior */}
      <div className="bg-amber-600/90 text-slate-950 px-4 py-0.5 text-center text-xs font-black tracking-widest uppercase flex items-center justify-center space-x-3 shadow-inner">
        <Lock className="w-3.5 h-3.5" />
        <span>RESTRINGIDO // CLASIFICACIÓN TÁCTICA: SECRETO // RED MILITAR COMSEC C4ISR</span>
        <Lock className="w-3.5 h-3.5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo y Título Táctico */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-400 shadow-md">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  SIGIN-MIL
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-mono">
                    v1.0.0 TACTICAL
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Inventario Tecnológico de Informática y Comunicaciones Militares
              </p>
            </div>
          </div>

          {/* Indicadores de Sistema & Botón Exportar ZIP */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Reloj ZULU */}
            <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800 font-mono text-emerald-400">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">HORA ZULU:</span>
              <span className="font-semibold">{zuluTime || '00:00:00 Z'}</span>
            </div>

            {/* Base de Datos Sequelize */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800 text-slate-300">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">ORM:</span>
              <span className="font-semibold text-blue-300">Sequelize / PostgreSQL</span>
            </div>

            {/* Cero CDNs Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1.5 rounded-md border border-slate-800 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Sin CDNs (Air-Gapped)</span>
            </div>

            {/* Botón Descargar ZIP con 1 Click */}
            <button
              id="header-btn-export-zip"
              onClick={onOpenExportModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-3.5 py-1.5 rounded-md shadow-md transition-all border border-emerald-400/30 cursor-pointer"
              title="Descargar código fuente completo empaquetado en .zip"
            >
              <Download className="w-4 h-4" />
              <span className="font-semibold">Descargar .ZIP</span>
            </button>
          </div>
        </div>

        {/* Barra de Pestañas de Navegación */}
        <nav className="flex space-x-1 overflow-x-auto pb-1 text-sm border-t border-slate-800/80 pt-2 no-scrollbar">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tablero de Mando</span>
          </button>

          <button
            id="tab-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Inventario TIC Militar</span>
          </button>

          <button
            id="tab-custody"
            onClick={() => setActiveTab('custody')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'custody'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Actas de Custodia</span>
          </button>

          <button
            id="tab-maintenance"
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'maintenance'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Taller Técnico & COMSEC</span>
            {comsecAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-bold bg-rose-600 text-white">
                {comsecAlertsCount}
              </span>
            )}
          </button>

          <button
            id="tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-slate-800 text-blue-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Arquitectura Backend & DB</span>
          </button>

          <button
            id="tab-export"
            onClick={() => setActiveTab('export')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'export'
                ? 'bg-slate-800 text-teal-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Generador .ZIP & Docker</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
