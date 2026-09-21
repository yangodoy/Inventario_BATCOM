export type EquipmentCategory =
  | 'RADIO_TACTICO'
  | 'SATCOM'
  | 'CRIPTOGRAFIA_COMSEC'
  | 'SERVIDORES_RUGERIZADOS'
  | 'REDES_CAMPANA'
  | 'C4ISR_DRONES'
  | 'GUERRA_ELECTRONICA';

export type EquipmentStatus =
  | 'OPERATIVO'
  | 'EN_MISION'
  | 'EN_MANTENIMIENTO'
  | 'DEPOSITO_RESERVA'
  | 'BAJA_DEFINITIVA';

export type SecurityClassification = 'UNCLASSIFIED' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';

export type MilitaryRole = 'SUPER_ADMIN' | 'COMSEC_OFFICER' | 'LOGISTICS_CHIEF' | 'OPERATOR';

export interface MilitaryUnit {
  id: string;
  unitCode: string;
  name: string;
  branch: string;
  location: string;
  securityClassification: SecurityClassification;
  commanderName: string;
  commsOfficerName?: string;
  contactFrequency?: string;
}

export interface MilitaryUser {
  id: string;
  militaryId: string;
  rank: string;
  firstName: string;
  lastName: string;
  email: string;
  role: MilitaryRole;
  clearanceLevel: SecurityClassification;
  militaryUnitId?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TRANSFERRED' | 'DECOMMISSIONED';
}

export interface Equipment {
  id: string;
  serialNumber: string;
  nsnCode?: string; // Código OTAN
  model: string;
  brand: string;
  category: EquipmentCategory;
  securityClassification: SecurityClassification;
  status: EquipmentStatus;
  frequencyRange?: string;
  powerOutput?: string;
  cryptoModuleInstalled: boolean;
  cryptoKeyExpiration?: string | null;
  currentUnitId?: string;
  assignedUserId?: string;
  storageVault?: string;
  specifications?: Record<string, string>;
  notes?: string;
}

export interface CustodyLog {
  id: string;
  equipmentId: string;
  assignedToUserId: string;
  authorizedByUserId: string;
  militaryUnitId?: string;
  missionCode?: string;
  dateAssigned: string;
  dateReturned?: string;
  expectedReturnDate?: string;
  digitalSignatureHash?: string;
  returnConditionStatus?: string;
  status: 'ACTIVA' | 'DEVUELTA' | 'EXTRAVIADO' | 'EN_INVESTIGACION';
  remarks?: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  technicianUserId: string;
  maintenanceType: 'PREVENTIVO' | 'CORRECTIVO' | 'ROTACION_CLAVES_CRIPTO' | 'CALIBRACION_RF' | 'AUDITORIA_COMSEC';
  severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  scheduledDate?: string;
  completedDate?: string;
  findings?: string;
  actionsTaken?: string;
  cryptoKeysRotated: boolean;
  nextDueDate?: string;
  status: 'PROGRAMADO' | 'EN_PROCESO' | 'APROBADO_OPERATIVO' | 'NO_REPARABLE';
}

export type ActiveTab = 'dashboard' | 'inventory' | 'custody' | 'maintenance' | 'architecture' | 'export';
