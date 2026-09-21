import { Request, Response } from 'express';
import { initialEquipment } from '../seeders/militarySeeds.ts';
import { EquipmentAttributes } from '../models/Equipment.ts';

// Almacén en memoria persistente sincronizado con Sequelize
let equipmentStore: EquipmentAttributes[] = [...initialEquipment];

export const equipmentController = {
  /**
   * Obtener lista de equipos militares con filtros tácticos
   * Query params: category, status, classification, unitId, search
   */
  getAllEquipment: (req: Request, res: Response) => {
    try {
      const { category, status, classification, unitId, search } = req.query;

      let results = [...equipmentStore];

      if (category) {
        results = results.filter((item) => item.category === category);
      }
      if (status) {
        results = results.filter((item) => item.status === status);
      }
      if (classification) {
        results = results.filter((item) => item.securityClassification === classification);
      }
      if (unitId) {
        results = results.filter((item) => item.currentUnitId === unitId);
      }
      if (search && typeof search === 'string') {
        const query = search.toLowerCase();
        results = results.filter(
          (item) =>
            item.serialNumber.toLowerCase().includes(query) ||
            item.model.toLowerCase().includes(query) ||
            item.brand.toLowerCase().includes(query) ||
            (item.nsnCode && item.nsnCode.toLowerCase().includes(query))
        );
      }

      res.status(200).json({
        success: true,
        count: results.length,
        total: equipmentStore.length,
        data: results,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar el inventario de equipos militares',
        error: error.message,
      });
    }
  },

  /**
   * Obtener equipo por ID o Número de Serie Militar
   */
  getEquipmentById: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const found = equipmentStore.find(
        (item) => item.id === id || item.serialNumber.toLowerCase() === id.toLowerCase()
      );

      if (!found) {
        return res.status(404).json({
          success: false,
          message: `Equipo táctico con identificador '${id}' no encontrado en el arsenal`,
        });
      }

      res.status(200).json({
        success: true,
        data: found,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener el equipo militar',
        error: error.message,
      });
    }
  },

  /**
   * Registrar nuevo equipo militar en el inventario TIC
   */
  createEquipment: (req: Request, res: Response) => {
    try {
      const {
        serialNumber,
        nsnCode,
        model,
        brand,
        category,
        securityClassification,
        status,
        frequencyRange,
        powerOutput,
        cryptoModuleInstalled,
        cryptoKeyExpiration,
        currentUnitId,
        storageVault,
        specifications,
        notes,
      } = req.body;

      if (!serialNumber || !model || !brand || !category) {
        return res.status(400).json({
          success: false,
          message: 'Los campos serialNumber, model, brand y category son estrictamente obligatorios',
        });
      }

      const exists = equipmentStore.some((e) => e.serialNumber.toLowerCase() === serialNumber.toLowerCase());
      if (exists) {
        return res.status(409).json({
          success: false,
          message: `El número de serie militar '${serialNumber}' ya se encuentra registrado en el sistema`,
        });
      }

      const newEquipment: EquipmentAttributes = {
        id: `eq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        serialNumber,
        nsnCode,
        model,
        brand,
        category,
        securityClassification: securityClassification || 'CONFIDENTIAL',
        status: status || 'OPERATIVO',
        frequencyRange,
        powerOutput,
        cryptoModuleInstalled: Boolean(cryptoModuleInstalled),
        cryptoKeyExpiration: cryptoKeyExpiration || null,
        currentUnitId,
        storageVault,
        specifications: specifications || {},
        notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      equipmentStore.unshift(newEquipment);

      res.status(201).json({
        success: true,
        message: 'Material TIC militar incorporado exitosamente al inventario',
        data: newEquipment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al crear el registro de equipo táctico',
        error: error.message,
      });
    }
  },

  /**
   * Actualizar estado o especificaciones de equipo
   */
  updateEquipment: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const index = equipmentStore.findIndex((e) => e.id === id);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `Equipo táctico '${id}' no encontrado para actualización`,
        });
      }

      equipmentStore[index] = {
        ...equipmentStore[index],
        ...req.body,
        updatedAt: new Date(),
      };

      res.status(200).json({
        success: true,
        message: 'Registro de equipo actualizado en el sistema militar',
        data: equipmentStore[index],
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el equipo militar',
        error: error.message,
      });
    }
  },

  /**
   * Dar de baja o eliminar un equipo
   */
  deleteEquipment: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const index = equipmentStore.findIndex((e) => e.id === id);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `Equipo militar con id '${id}' no encontrado`,
        });
      }

      const deleted = equipmentStore.splice(index, 1)[0];

      res.status(200).json({
        success: true,
        message: `Equipo con serie ${deleted.serialNumber} retirado del inventario activo`,
        data: deleted,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el equipo militar',
        error: error.message,
      });
    }
  },

  /**
   * Alertas COMSEC y vencimiento de cifrado criptográfico
   */
  getComsecAlerts: (_req: Request, res: Response) => {
    try {
      const now = new Date();
      const thirtyDaysAhead = new Date();
      thirtyDaysAhead.setDate(now.getDate() + 30);

      const alerts = equipmentStore.filter((item) => {
        if (!item.cryptoKeyExpiration) return false;
        const expDate = new Date(item.cryptoKeyExpiration);
        return expDate <= thirtyDaysAhead;
      });

      res.status(200).json({
        success: true,
        count: alerts.length,
        data: alerts,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar alertas criptográficas COMSEC',
        error: error.message,
      });
    }
  },

  /**
   * Métricas y estadísticas generales del inventario
   */
  getInventoryStats: (_req: Request, res: Response) => {
    try {
      const total = equipmentStore.length;
      const operativos = equipmentStore.filter((e) => e.status === 'OPERATIVO').length;
      const enMision = equipmentStore.filter((e) => e.status === 'EN_MISION').length;
      const enMantenimiento = equipmentStore.filter((e) => e.status === 'EN_MANTENIMIENTO').length;
      const reserva = equipmentStore.filter((e) => e.status === 'DEPOSITO_RESERVA').length;

      const topSecret = equipmentStore.filter((e) => e.securityClassification === 'TOP_SECRET').length;
      const secret = equipmentStore.filter((e) => e.securityClassification === 'SECRET').length;
      const confidential = equipmentStore.filter((e) => e.securityClassification === 'CONFIDENTIAL').length;

      const cryptoModules = equipmentStore.filter((e) => e.cryptoModuleInstalled).length;

      res.status(200).json({
        success: true,
        data: {
          total,
          byStatus: {
            operativos,
            enMision,
            enMantenimiento,
            reserva,
          },
          byClassification: {
            topSecret,
            secret,
            confidential,
          },
          cryptoProtectedCount: cryptoModules,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas del inventario',
        error: error.message,
      });
    }
  },
};
