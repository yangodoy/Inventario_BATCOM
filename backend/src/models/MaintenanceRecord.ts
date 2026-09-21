export type MaintenanceType =
  | 'PREVENTIVO'
  | 'CORRECTIVO'
  | 'ROTACION_CLAVES_CRIPTO'
  | 'CALIBRACION_RF'
  | 'AUDITORIA_COMSEC';

export type MaintenanceStatus =
  | 'PROGRAMADO'
  | 'EN_PROCESO'
  | 'APROBADO_OPERATIVO'
  | 'NO_REPARABLE';

export interface MaintenanceRecordAttributes {
  id: string;
  equipmentId: string;
  technicianUserId: string;
  maintenanceType: MaintenanceType;
  severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  scheduledDate?: Date | string;
  completedDate?: Date | string;
  findings?: string;
  actionsTaken?: string;
  cryptoKeysRotated: boolean;
  nextDueDate?: Date | string;
  status: MaintenanceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Definición del Modelo Sequelize para Mantenimiento Técnico y COMSEC
 */
export const MaintenanceRecordModelDefinition = {
  tableName: 'maintenance_records',
  fields: {
    id: {
      type: 'UUID',
      defaultValue: 'UUIDV4',
      primaryKey: true,
    },
    equipmentId: {
      type: 'UUID',
      allowNull: false,
      field: 'equipment_id',
      references: {
        model: 'equipment',
        key: 'id',
      },
    },
    technicianUserId: {
      type: 'UUID',
      allowNull: false,
      field: 'technician_user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    maintenanceType: {
      type: 'ENUM',
      values: [
        'PREVENTIVO',
        'CORRECTIVO',
        'ROTACION_CLAVES_CRIPTO',
        'CALIBRACION_RF',
        'AUDITORIA_COMSEC',
      ],
      allowNull: false,
      field: 'maintenance_type',
    },
    severity: {
      type: 'ENUM',
      values: ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'],
      defaultValue: 'MEDIA',
    },
    scheduledDate: {
      type: 'DATE',
      allowNull: true,
      field: 'scheduled_date',
    },
    completedDate: {
      type: 'DATE',
      allowNull: true,
      field: 'completed_date',
    },
    findings: {
      type: 'TEXT',
      allowNull: true,
    },
    actionsTaken: {
      type: 'TEXT',
      allowNull: true,
      field: 'actions_taken',
    },
    cryptoKeysRotated: {
      type: 'BOOLEAN',
      defaultValue: false,
      field: 'crypto_keys_rotated',
    },
    nextDueDate: {
      type: 'DATE',
      allowNull: true,
      field: 'next_due_date',
    },
    status: {
      type: 'ENUM',
      values: ['PROGRAMADO', 'EN_PROCESO', 'APROBADO_OPERATIVO', 'NO_REPARABLE'],
      defaultValue: 'PROGRAMADO',
    },
  },
};
