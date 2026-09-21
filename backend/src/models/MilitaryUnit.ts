export interface MilitaryUnitAttributes {
  id: string;
  unitCode: string;
  name: string;
  branch: string;
  location: string;
  securityClassification: 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
  commanderName: string;
  commsOfficerName?: string;
  contactFrequency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Definición del Modelo Sequelize para Unidades Militares
 * Representa destacamentos, brigadas, bases aéreas y batallones de comunicaciones.
 */
export const MilitaryUnitModelDefinition = {
  tableName: 'military_units',
  fields: {
    id: {
      type: 'UUID',
      defaultValue: 'UUIDV4',
      primaryKey: true,
    },
    unitCode: {
      type: 'STRING(50)',
      allowNull: false,
      unique: true,
      field: 'unit_code',
    },
    name: {
      type: 'STRING(150)',
      allowNull: false,
    },
    branch: {
      type: 'STRING(80)',
      allowNull: false,
    },
    location: {
      type: 'STRING(120)',
      allowNull: false,
    },
    securityClassification: {
      type: 'ENUM',
      values: ['RESTRICTED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'],
      defaultValue: 'CONFIDENTIAL',
      field: 'security_classification',
    },
    commanderName: {
      type: 'STRING(120)',
      allowNull: false,
      field: 'commander_name',
    },
    commsOfficerName: {
      type: 'STRING(120)',
      allowNull: true,
      field: 'comms_officer_name',
    },
    contactFrequency: {
      type: 'STRING(50)',
      allowNull: true,
      field: 'contact_frequency',
    },
  },
};
