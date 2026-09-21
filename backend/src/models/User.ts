export type MilitaryRole = 'SUPER_ADMIN' | 'COMSEC_OFFICER' | 'LOGISTICS_CHIEF' | 'OPERATOR';
export type ClearanceLevel = 'UNCLASSIFIED' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';

export interface UserAttributes {
  id: string;
  militaryId: string;
  rank: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: MilitaryRole;
  clearanceLevel: ClearanceLevel;
  militaryUnitId?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TRANSFERRED' | 'DECOMMISSIONED';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Definición del Modelo Sequelize para Personal Militar / Usuarios
 */
export const UserModelDefinition = {
  tableName: 'users',
  fields: {
    id: {
      type: 'UUID',
      defaultValue: 'UUIDV4',
      primaryKey: true,
    },
    militaryId: {
      type: 'STRING(50)',
      allowNull: false,
      unique: true,
      field: 'military_id',
    },
    rank: {
      type: 'STRING(60)',
      allowNull: false,
    },
    firstName: {
      type: 'STRING(80)',
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: 'STRING(80)',
      allowNull: false,
      field: 'last_name',
    },
    email: {
      type: 'STRING(120)',
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: 'STRING(255)',
      allowNull: false,
      field: 'password_hash',
    },
    role: {
      type: 'ENUM',
      values: ['SUPER_ADMIN', 'COMSEC_OFFICER', 'LOGISTICS_CHIEF', 'OPERATOR'],
      defaultValue: 'OPERATOR',
    },
    clearanceLevel: {
      type: 'ENUM',
      values: ['UNCLASSIFIED', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'],
      defaultValue: 'RESTRICTED',
      field: 'clearance_level',
    },
    militaryUnitId: {
      type: 'UUID',
      allowNull: true,
      field: 'military_unit_id',
      references: {
        model: 'military_units',
        key: 'id',
      },
    },
    status: {
      type: 'STRING(20)',
      defaultValue: 'ACTIVE',
    },
  },
};
