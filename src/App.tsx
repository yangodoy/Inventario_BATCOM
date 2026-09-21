import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { DashboardOverview } from './components/DashboardOverview.tsx';
import { EquipmentInventory } from './components/EquipmentInventory.tsx';
import { CustodyManager } from './components/CustodyManager.tsx';
import { MaintenanceCOMSEC } from './components/MaintenanceCOMSEC.tsx';
import { BackendArchitecture } from './components/BackendArchitecture.tsx';
import { ZipExporter } from './components/ZipExporter.tsx';
import { militaryDataService } from './services/militaryData.ts';
import {
  Equipment,
  CustodyLog,
  MaintenanceRecord,
  MilitaryUnit,
  MilitaryUser,
  EquipmentStatus,
  ActiveTab,
} from './types/military.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [custodies, setCustodies] = useState<CustodyLog[]>([]);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [units, setUnits] = useState<MilitaryUnit[]>([]);
  const [users, setUsers] = useState<MilitaryUser[]>([]);

  // Pre-seleccionados al saltar entre vistas
  const [preSelectedEqId, setPreSelectedEqId] = useState<string | undefined>(undefined);

  // Cargar datos iniciales
  useEffect(() => {
    setEquipmentList(militaryDataService.getEquipment());
    setCustodies(militaryDataService.getCustodies());
    setMaintenances(militaryDataService.getMaintenances());
    setUnits(militaryDataService.getUnits());
    setUsers(militaryDataService.getUsers());
  }, []);

  // Handlers para Equipos
  const handleAddEquipment = (eqData: Omit<Equipment, 'id'>) => {
    militaryDataService.addEquipment(eqData);
    setEquipmentList([...militaryDataService.getEquipment()]);
  };

  const handleUpdateStatus = (id: string, status: EquipmentStatus) => {
    militaryDataService.updateEquipmentStatus(id, status);
    setEquipmentList([...militaryDataService.getEquipment()]);
  };

  // Handlers para Custodias
  const handleAssignCustody = (data: {
    equipmentId: string;
    assignedToUserId: string;
    authorizedByUserId: string;
    militaryUnitId?: string;
    missionCode?: string;
    expectedReturnDate?: string;
    remarks?: string;
  }) => {
    militaryDataService.assignCustody(data);
    setCustodies([...militaryDataService.getCustodies()]);
    setEquipmentList([...militaryDataService.getEquipment()]);
  };

  const handleReturnCustody = (custodyId: string, returnCondition: string, remarks?: string) => {
    militaryDataService.returnCustody(custodyId, returnCondition, remarks);
    setCustodies([...militaryDataService.getCustodies()]);
    setEquipmentList([...militaryDataService.getEquipment()]);
  };

  // Handlers para Mantenimiento y COMSEC
  const handleScheduleMaintenance = (data: {
    equipmentId: string;
    technicianUserId: string;
    maintenanceType: 'PREVENTIVO' | 'CORRECTIVO' | 'ROTACION_CLAVES_CRIPTO' | 'CALIBRACION_RF' | 'AUDITORIA_COMSEC';
    severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
    scheduledDate?: string;
    findings?: string;
    nextDueDate?: string;
  }) => {
    militaryDataService.scheduleMaintenance(data);
    setMaintenances([...militaryDataService.getMaintenances()]);
    setEquipmentList([...militaryDataService.getEquipment()]);
  };

  const handleCompleteMaintenance = (id: string, actionsTaken: string, cryptoRotated: boolean) => {
    militaryDataService.completeMaintenance(id, actionsTaken, cryptoRotated);
    setMaintenances([...militaryDataService.getMaintenances()]);
    setEquipmentList([...militaryDataService.getEquipment()]);
  };

  // Navegación contextual entre módulos
  const handleSelectForCustody = (eq: Equipment) => {
    setPreSelectedEqId(eq.id);
    setActiveTab('custody');
  };

  const handleSelectForMaintenance = (eq: Equipment) => {
    setPreSelectedEqId(eq.id);
    setActiveTab('maintenance');
  };

  const comsecAlertsCount = equipmentList.filter((e) => {
    if (!e.cryptoModuleInstalled || !e.cryptoKeyExpiration) return false;
    const daysUntilExp = (new Date(e.cryptoKeyExpiration).getTime() - Date.now()) / (1000 * 3600 * 24);
    return daysUntilExp < 30;
  }).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Encabezado Táctico Militar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab: ActiveTab) => {
          setActiveTab(tab);
          setPreSelectedEqId(undefined);
        }}
        comsecAlertsCount={comsecAlertsCount}
        onOpenExportModal={() => setActiveTab('export')}
      />

      {/* Área Principal de Contenido */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            equipment={equipmentList}
            units={units}
            comsecAlerts={militaryDataService.getComsecAlerts()}
            setActiveTab={setActiveTab}
            onSelectEquipment={(eq) => {
              setPreSelectedEqId(eq.id);
              setActiveTab('inventory');
            }}
          />
        )}

        {activeTab === 'inventory' && (
          <EquipmentInventory
            equipmentList={equipmentList}
            units={units}
            users={users}
            onAddEquipment={handleAddEquipment}
            onUpdateStatus={handleUpdateStatus}
            onSelectForCustody={handleSelectForCustody}
            onSelectForMaintenance={handleSelectForMaintenance}
          />
        )}

        {activeTab === 'custody' && (
          <CustodyManager
            custodies={custodies}
            equipment={equipmentList}
            units={units}
            users={users}
            onAssignCustody={handleAssignCustody}
            onReturnCustody={handleReturnCustody}
            preSelectedEquipmentId={preSelectedEqId}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceCOMSEC
            maintenances={maintenances}
            equipment={equipmentList}
            users={users}
            onScheduleMaintenance={handleScheduleMaintenance}
            onCompleteMaintenance={handleCompleteMaintenance}
            preSelectedEquipmentId={preSelectedEqId}
          />
        )}

        {activeTab === 'architecture' && <BackendArchitecture />}

        {activeTab === 'export' && <ZipExporter />}
      </main>

      {/* Pie de Página Militar Táctico */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-3 px-4 text-center text-slate-500 text-[11px] font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>SIGIN-MIL v2.4.0 (AIR-GAPPED BUILD) — CLASIFICADO NIVEL 4</span>
          </div>
          <div>
            STACK: EXPRESS + SEQUELIZE (POSTGRES/MYSQL DUAL) + REACT 19 + TAILWIND (NO CDNS)
          </div>
        </div>
      </footer>
    </div>
  );
}
