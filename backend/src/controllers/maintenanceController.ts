import { Request, Response } from 'express';
import { initialMaintenanceRecords } from '../seeders/militarySeeds.ts';
import { MaintenanceRecordAttributes } from '../models/MaintenanceRecord.ts';

let maintenanceStore: MaintenanceRecordAttributes[] = [...initialMaintenanceRecords];

export const maintenanceController = {
  /**
   * Listar órdenes de mantenimiento y auditoría COMSEC
   */
  getAllMaintenance: (req: Request, res: Response) => {
    try {
      const { status, type, equipmentId } = req.query;
      let results = [...maintenanceStore];

      if (status) {
        results = results.filter((m) => m.status === status);
      }
      if (type) {
        results = results.filter((m) => m.maintenanceType === type);
      }
      if (equipmentId) {
        results = results.filter((m) => m.equipmentId === equipmentId);
      }

      res.status(200).json({
        success: true,
        count: results.length,
        data: results,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar órdenes de mantenimiento técnico',
        error: error.message,
      });
    }
  },

  /**
   * Programar orden de mantenimiento o rotación criptográfica
   */
  scheduleMaintenance: (req: Request, res: Response) => {
    try {
      const { equipmentId, technicianUserId, maintenanceType, severity, scheduledDate, findings, nextDueDate } = req.body;

      if (!equipmentId || !technicianUserId || !maintenanceType) {
        return res.status(400).json({
          success: false,
          message: 'equipmentId, technicianUserId y maintenanceType son requeridos',
        });
      }

      const newRecord: MaintenanceRecordAttributes = {
        id: `maint-${Date.now()}`,
        equipmentId,
        technicianUserId,
        maintenanceType,
        severity: severity || 'MEDIA',
        scheduledDate: scheduledDate || new Date(),
        findings: findings || 'Inspección técnica de rutina programada',
        cryptoKeysRotated: maintenanceType === 'ROTACION_CLAVES_CRIPTO',
        nextDueDate,
        status: 'PROGRAMADO',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      maintenanceStore.unshift(newRecord);

      res.status(201).json({
        success: true,
        message: 'Orden técnica / COMSEC programada en el calendario de mantenimiento',
        data: newRecord,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al programar orden de mantenimiento',
        error: error.message,
      });
    }
  },

  /**
   * Finalizar orden técnica y registrar acciones tomadas
   */
  completeMaintenance: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { actionsTaken, status, cryptoKeysRotated, nextDueDate } = req.body;

      const record = maintenanceStore.find((m) => m.id === id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `Registro de mantenimiento '${id}' no encontrado`,
        });
      }

      record.completedDate = new Date();
      record.status = status || 'APROBADO_OPERATIVO';
      record.actionsTaken = actionsTaken || 'Procedimiento técnico completado bajo normas MIL-STD';
      if (typeof cryptoKeysRotated === 'boolean') {
        record.cryptoKeysRotated = cryptoKeysRotated;
      }
      if (nextDueDate) {
        record.nextDueDate = nextDueDate;
      }
      record.updatedAt = new Date();

      res.status(200).json({
        success: true,
        message: 'Mantenimiento completado y equipo validado para servicio táctico',
        data: record,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al asentar finalización de mantenimiento',
        error: error.message,
      });
    }
  },
};
