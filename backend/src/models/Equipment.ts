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

export interface EquipmentAttributes {
  id: string;
  serialNumber: string;
  nsnCode?: string; // Código OTAN / NATO Stock Number
  model: string;
  brand: string;
  category: EquipmentCategory;
  securityClassification: SecurityClassification;
  status: EquipmentStatus;
  frequencyRange?: string;
  powerOutput?: string;
  cryptoModuleInstalled: boolean;
  cryptoKeyExpiration?: Date | string | null;
  currentUnitId?: string;
  assignedUserId?: string;
  storageVault?: string;
  specifications?: Record<string, unknown>;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Definición del Modelo Sequelize para Equipamiento TIC Militar
 */
export const EquipmentModelDefinition = {
  tableName: 'equipment',
  fields: {
    id: {
      type: 'UUID',
      defaultValue: 'UUIDV4',
      primaryKey: true,
    },
    serialNumber: {
      type: 'STRING(80)',
      allowNull: false,
      unique: true,
      field: 'serial_number',
    },
    nsnCode: {
      type: 'STRING(50)',
      allowNull: true,
      field: 'nsn_code',
    },
    model: {
      type: 'STRING(100)',
      allowNull: false,
    },
    brand: {
      type: 'STRING(80)',
      allowNull: false,
    },
    category: {
      type: 'ENUM',
      values: [
        'RADIO_TACTICO',
        'SATCOM',
        'CRIPTOGRAFIA_COMSEC',
        'SERVIDORES_RUGERIZADOS',
        'REDES_CAMPANA',
        'C4ISR_DRONES',
        'GUERRA_ELECTRONICA',
      ],
      allowNull: false,
    },
    securityClassification: {
      type: 'ENUM',
      values: ['UNCLASSIFIED', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'],
      defaultValue: 'CONFIDENTIAL',
      field: 'security_classification',
    },
    status: {
      type: 'ENUM',
      values: ['OPERATIVO', 'EN_MISION', 'EN_MANTENIMIENTO', 'DEPOSITO_RESERVA', 'BAJA_DEFINITIVA'],
      defaultValue: 'OPERATIVO',
    },
    frequencyRange: {
      type: 'STRING(80)',
      allowNull: true,
      field: 'frequency_range',
    },
    powerOutput: {
      type: 'STRING(50)',
      allowNull: true,
      field: 'power_output',
    },
    cryptoModuleInstalled: {
      type: 'BOOLEAN',
      defaultValue: false,
      field: 'crypto_module_installed',
    },
    cryptoKeyExpiration: {
      type: 'DATE',
      allowNull: true,
      field: 'crypto_key_expiration',
    },
    currentUnitId: {
      type: 'UUID',
      allowNull: true,
      field: 'current_unit_id',
      references: {
        model: 'military_units',
        key: 'id',
      },
    },
    assignedUserId: {
      type: 'UUID',
      allowNull: true,
      field: 'assigned_user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    storageVault: {
      type: 'STRING(80)',
      allowNull: true,
      field: 'storage_vault',
    },
    specifications: {
      type: 'JSONB',
      allowNull: true,
    },
    notes: {
      type: 'TEXT',
      allowNull: true,
    },
  },
};
