import { Request, Response } from 'express';
import { initialMilitaryUnits } from '../seeders/militarySeeds.ts';
import { MilitaryUnitAttributes } from '../models/MilitaryUnit.ts';

let unitsStore: MilitaryUnitAttributes[] = [...initialMilitaryUnits];

export const militaryUnitController = {
  getAllUnits: (_req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        count: unitsStore.length,
        data: unitsStore,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar unidades militares',
        error: error.message,
      });
    }
  },

  getUnitById: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const unit = unitsStore.find((u) => u.id === id || u.unitCode.toLowerCase() === id.toLowerCase());

      if (!unit) {
        return res.status(404).json({
          success: false,
          message: `Unidad militar '${id}' no encontrada en el registro de la fuerza`,
        });
      }

      res.status(200).json({
        success: true,
        data: unit,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar unidad militar',
        error: error.message,
      });
    }
  },
};
