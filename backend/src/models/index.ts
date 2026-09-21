import { dbConfig, getSequelizeConnectionDetails } from '../config/database.ts';
import { MilitaryUnitModelDefinition, MilitaryUnitAttributes } from './MilitaryUnit.ts';
import { UserModelDefinition, UserAttributes } from './User.ts';
import { EquipmentModelDefinition, EquipmentAttributes } from './Equipment.ts';
import { CustodyLogModelDefinition, CustodyLogAttributes } from './CustodyLog.ts';
import { MaintenanceRecordModelDefinition, MaintenanceRecordAttributes } from './MaintenanceRecord.ts';

export * from './MilitaryUnit.ts';
export * from './User.ts';
export * from './Equipment.ts';
export * from './CustodyLog.ts';
export * from './MaintenanceRecord.ts';

/**
 * Registro y Definición de Asociaciones Relacionales Sequelize
 */
export const modelAssociations = [
  // Una Unidad Militar tiene múltiples Equipos TIC
  { source: 'MilitaryUnit', type: 'hasMany', target: 'Equipment', foreignKey: 'currentUnitId', as: 'equipments' },
  { source: 'Equipment', type: 'belongsTo', target: 'MilitaryUnit', foreignKey: 'currentUnitId', as: 'militaryUnit' },

  // Una Unidad Militar tiene múltiples Efectivos / Usuarios
  { source: 'MilitaryUnit', type: 'hasMany', target: 'User', foreignKey: 'militaryUnitId', as: 'personnel' },
  { source: 'User', type: 'belongsTo', target: 'MilitaryUnit', foreignKey: 'militaryUnitId', as: 'assignedUnit' },

  // Un Equipo TIC puede estar asignado a un Usuario en custodia directa
  { source: 'User', type: 'hasMany', target: 'Equipment', foreignKey: 'assignedUserId', as: 'custodiedEquipments' },
  { source: 'Equipment', type: 'belongsTo', target: 'User', foreignKey: 'assignedUserId', as: 'assignedUser' },

  // Un Equipo TIC registra múltiples Actas de Custodia (Trazabilidad histórica)
  { source: 'Equipment', type: 'hasMany', target: 'CustodyLog', foreignKey: 'equipmentId', as: 'custodyHistory' },
  { source: 'CustodyLog', type: 'belongsTo', target: 'Equipment', foreignKey: 'equipmentId', as: 'equipment' },

  // Custodia vinculada a los usuarios que reciben y que autorizan
  { source: 'User', type: 'hasMany', target: 'CustodyLog', foreignKey: 'assignedToUserId', as: 'receivedCustodies' },
  { source: 'CustodyLog', type: 'belongsTo', target: 'User', foreignKey: 'assignedToUserId', as: 'assignedTo' },
  { source: 'User', type: 'hasMany', target: 'CustodyLog', foreignKey: 'authorizedByUserId', as: 'authorizedCustodies' },
  { source: 'CustodyLog', type: 'belongsTo', target: 'User', foreignKey: 'authorizedByUserId', as: 'authorizedBy' },

  // Un Equipo TIC tiene múltiples Registros de Mantenimiento e Inspección COMSEC
  { source: 'Equipment', type: 'hasMany', target: 'MaintenanceRecord', foreignKey: 'equipmentId', as: 'maintenanceHistory' },
  { source: 'MaintenanceRecord', type: 'belongsTo', target: 'Equipment', foreignKey: 'equipmentId', as: 'equipment' },

  // Mantenimiento ejecutado por un técnico COMSEC
  { source: 'User', type: 'hasMany', target: 'MaintenanceRecord', foreignKey: 'technicianUserId', as: 'performedMaintenances' },
  { source: 'MaintenanceRecord', type: 'belongsTo', target: 'User', foreignKey: 'technicianUserId', as: 'technician' },
];

export const databaseModels = {
  MilitaryUnit: MilitaryUnitModelDefinition,
  User: UserModelDefinition,
  Equipment: EquipmentModelDefinition,
  CustodyLog: CustodyLogModelDefinition,
  MaintenanceRecord: MaintenanceRecordModelDefinition,
};

export const initDbConnection = () => {
  return {
    status: 'configured',
    engine: dbConfig.dialect,
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    modelsCount: Object.keys(databaseModels).length,
    associationsCount: modelAssociations.length,
    connectionDetails: getSequelizeConnectionDetails(),
  };
};
