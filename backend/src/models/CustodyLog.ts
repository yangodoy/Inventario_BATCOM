export type CustodyStatus = 'ACTIVA' | 'DEVUELTA' | 'EXTRAVIADO' | 'EN_INVESTIGACION';

export interface CustodyLogAttributes {
  id: string;
  equipmentId: string;
  assignedToUserId: string;
  authorizedByUserId: string;
  militaryUnitId?: string;
  missionCode?: string;
  dateAssigned: Date | string;
  dateReturned?: Date | string;
  expectedReturnDate?: Date | string;
  digitalSignatureHash?: string;
  returnConditionStatus?: string;
  status: CustodyStatus;
  remarks?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Definición del Modelo Sequelize para Trazabilidad y Actas de Custodia Táctica
 */
export const CustodyLogModelDefinition = {
  tableName: 'custody_logs',
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
    assignedToUserId: {
      type: 'UUID',
      allowNull: false,
      field: 'assigned_to_user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    authorizedByUserId: {
      type: 'UUID',
      allowNull: false,
      field: 'authorized_by_user_id',
      references: {
        model: 'users',
        key: 'id',
      },
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
    missionCode: {
      type: 'STRING(80)',
      allowNull: true,
      field: 'mission_code',
    },
    dateAssigned: {
      type: 'DATE',
      defaultValue: 'NOW',
      field: 'date_assigned',
    },
    dateReturned: {
      type: 'DATE',
      allowNull: true,
      field: 'date_returned',
    },
    expectedReturnDate: {
      type: 'DATE',
      allowNull: true,
      field: 'expected_return_date',
    },
    digitalSignatureHash: {
      type: 'STRING(255)',
      allowNull: true,
      field: 'digital_signature_hash',
    },
    returnConditionStatus: {
      type: 'STRING(50)',
      allowNull: true,
      field: 'return_condition_status',
    },
    status: {
      type: 'ENUM',
      values: ['ACTIVA', 'DEVUELTA', 'EXTRAVIADO', 'EN_INVESTIGACION'],
      defaultValue: 'ACTIVA',
    },
    remarks: {
      type: 'TEXT',
      allowNull: true,
    },
  },
};
