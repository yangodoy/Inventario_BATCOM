import { Request, Response } from 'express';
import { initialCustodyLogs, initialEquipment, initialUsers } from '../seeders/militarySeeds.ts';
import { CustodyLogAttributes } from '../models/CustodyLog.ts';

let custodyStore: CustodyLogAttributes[] = [...initialCustodyLogs];

export const custodyController = {
  /**
   * Obtener todas las actas de custodia
   */
  getAllCustodies: (req: Request, res: Response) => {
    try {
      const { status, userId, equipmentId } = req.query;
      let results = [...custodyStore];

      if (status) {
        results = results.filter((c) => c.status === status);
      }
      if (userId) {
        results = results.filter((c) => c.assignedToUserId === userId);
      }
      if (equipmentId) {
        results = results.filter((c) => c.equipmentId === equipmentId);
      }

      res.status(200).json({
        success: true,
        count: results.length,
        data: results,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar las actas de custodia',
        error: error.message,
      });
    }
  },

  /**
   * Asignar custodia de equipo militar con acta y firma digital
   */
  assignCustody: (req: Request, res: Response) => {
    try {
      const { equipmentId, assignedToUserId, authorizedByUserId, militaryUnitId, missionCode, expectedReturnDate, remarks } = req.body;

      if (!equipmentId || !assignedToUserId || !authorizedByUserId) {
        return res.status(400).json({
          success: false,
          message: 'equipmentId, assignedToUserId y authorizedByUserId son obligatorios para el acta de custodia',
        });
      }

      // Generar token de firma hash criptográfica simulada de la orden
      const digitalSignatureHash = `SHA256:${Math.random().toString(16).substring(2)}${Date.now()}`;

      const newCustody: CustodyLogAttributes = {
        id: `cust-${Date.now()}`,
        equipmentId,
        assignedToUserId,
        authorizedByUserId,
        militaryUnitId,
        missionCode: missionCode || 'ORDEN_GENERAL_SERVICIO',
        dateAssigned: new Date(),
        expectedReturnDate: expectedReturnDate || null,
        digitalSignatureHash,
        status: 'ACTIVA',
        remarks,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      custodyStore.unshift(newCustody);

      res.status(201).json({
        success: true,
        message: 'Acta de entrega y recepción de material TIC militar rubricada exitosamente',
        data: newCustody,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al formalizar la asignación de custodia',
        error: error.message,
      });
    }
  },

  /**
   * Devolución y descargo de custodia militar
   */
  returnCustody: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { returnConditionStatus, remarks } = req.body;

      const record = custodyStore.find((c) => c.id === id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `Acta de custodia '${id}' no encontrada`,
        });
      }

      record.dateReturned = new Date();
      record.status = 'DEVUELTA';
      record.returnConditionStatus = returnConditionStatus || 'OPTIMO';
      if (remarks) {
        record.remarks = `${record.remarks || ''}\n[Devolución]: ${remarks}`;
      }
      record.updatedAt = new Date();

      res.status(200).json({
        success: true,
        message: 'Descargo de material militar procesado e inventariado de vuelta al depósito',
        data: record,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al asentar devolución de custodia',
        error: error.message,
      });
    }
  },
};
