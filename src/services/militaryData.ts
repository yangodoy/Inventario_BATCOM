import {
  Equipment,
  MilitaryUnit,
  MilitaryUser,
  CustodyLog,
  MaintenanceRecord,
} from '../types/military.ts';
import {
  initialEquipment,
  initialMilitaryUnits,
  initialUsers,
  initialCustodyLogs,
  initialMaintenanceRecords,
} from '../../backend/src/seeders/militarySeeds.ts';

// Almacén reactivo local inicializado con la semilla militar
export class MilitaryDataService {
  private static equipment: Equipment[] = [...(initialEquipment as any)];
  private static units: MilitaryUnit[] = [...(initialMilitaryUnits as any)];
  private static users: MilitaryUser[] = [...(initialUsers as any)];
  private static custodies: CustodyLog[] = [...(initialCustodyLogs as any)];
  private static maintenances: MaintenanceRecord[] = [...(initialMaintenanceRecords as any)];

  // Equipos
  static getEquipment(): Equipment[] {
    return [...this.equipment];
  }

  static addEquipment(eq: Omit<Equipment, 'id'>): Equipment {
    const newEq: Equipment = {
      ...eq,
      id: `eq-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    };
    this.equipment.unshift(newEq);
    return newEq;
  }

  static updateEquipment(id: string, updates: Partial<Equipment>): Equipment | null {
    const idx = this.equipment.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.equipment[idx] = { ...this.equipment[idx], ...updates };
    return this.equipment[idx];
  }

  static updateEquipmentStatus(id: string, status: any): Equipment | null {
    return this.updateEquipment(id, { status });
  }

  static deleteEquipment(id: string): boolean {
    const idx = this.equipment.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.equipment.splice(idx, 1);
    return true;
  }

  // Unidades y Personal
  static getUnits(): MilitaryUnit[] {
    return [...this.units];
  }

  static getUsers(): MilitaryUser[] {
    return [...this.users];
  }

  // Custodia
  static getCustodies(): CustodyLog[] {
    return [...this.custodies];
  }

  static addCustody(log: Omit<CustodyLog, 'id' | 'digitalSignatureHash' | 'status'>): CustodyLog {
    const hash = `SHA256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newLog: CustodyLog = {
      ...log,
      id: `cust-${Date.now()}`,
      digitalSignatureHash: hash,
      status: 'ACTIVA',
    };
    this.custodies.unshift(newLog);

    // Actualizar estado del equipo a EN_MISION
    this.updateEquipment(log.equipmentId, {
      status: 'EN_MISION',
      assignedUserId: log.assignedToUserId,
      currentUnitId: log.militaryUnitId,
    });

    return newLog;
  }

  static assignCustody(data: {
    equipmentId: string;
    assignedToUserId: string;
    authorizedByUserId: string;
    militaryUnitId?: string;
    missionCode?: string;
    expectedReturnDate?: string;
    remarks?: string;
  }): CustodyLog {
    return this.addCustody({
      ...data,
      dateAssigned: new Date().toISOString(),
    });
  }

  static returnCustody(custodyId: string, returnCondition: string, remarks?: string): boolean {
    const record = this.custodies.find((c) => c.id === custodyId);
    if (!record) return false;

    record.status = 'DEVUELTA';
    record.dateReturned = new Date().toISOString();
    record.returnConditionStatus = returnCondition;
    if (remarks) {
      record.remarks = `${record.remarks || ''}\n[Devolución]: ${remarks}`;
    }

    // Regresar equipo a OPERATIVO y sin usuario asignado
    this.updateEquipment(record.equipmentId, {
      status: 'OPERATIVO',
      assignedUserId: undefined,
    });

    return true;
  }

  // Mantenimiento
  static getMaintenances(): MaintenanceRecord[] {
    return [...this.maintenances];
  }

  static addMaintenance(maint: Omit<MaintenanceRecord, 'id' | 'status'>): MaintenanceRecord {
    const newMaint: MaintenanceRecord = {
      ...maint,
      id: `maint-${Date.now()}`,
      status: 'PROGRAMADO',
    };
    this.maintenances.unshift(newMaint);

    // Cambiar estado del equipo a EN_MANTENIMIENTO
    this.updateEquipment(maint.equipmentId, {
      status: 'EN_MANTENIMIENTO',
    });

    return newMaint;
  }

  static scheduleMaintenance(data: {
    equipmentId: string;
    technicianUserId: string;
    maintenanceType: 'PREVENTIVO' | 'CORRECTIVO' | 'ROTACION_CLAVES_CRIPTO' | 'CALIBRACION_RF' | 'AUDITORIA_COMSEC';
    severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
    scheduledDate?: string;
    findings?: string;
    nextDueDate?: string;
  }): MaintenanceRecord {
    return this.addMaintenance({
      ...data,
      cryptoKeysRotated: false,
    });
  }

  static completeMaintenance(id: string, actionsTaken: string, cryptoRotated: boolean): boolean {
    const record = this.maintenances.find((m) => m.id === id);
    if (!record) return false;

    record.status = 'APROBADO_OPERATIVO';
    record.completedDate = new Date().toISOString();
    record.actionsTaken = actionsTaken;
    record.cryptoKeysRotated = cryptoRotated;

    // Si se rotaron claves criptográficas, renovar la fecha de expiración del equipo 6 meses adelante
    const nextCryptoExp = new Date();
    nextCryptoExp.setMonth(nextCryptoExp.getMonth() + 6);

    this.updateEquipment(record.equipmentId, {
      status: 'OPERATIVO',
      cryptoKeyExpiration: cryptoRotated ? nextCryptoExp.toISOString() : undefined,
    });

    return true;
  }

  // Alertas COMSEC (< 30 días de vencimiento)
  static getComsecAlerts(): { equipment: Equipment; daysLeft: number }[] {
    const now = new Date().getTime();
    const alerts: { equipment: Equipment; daysLeft: number }[] = [];

    for (const eq of this.equipment) {
      if (eq.cryptoKeyExpiration) {
        const expTime = new Date(eq.cryptoKeyExpiration).getTime();
        const diffDays = Math.ceil((expTime - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 45) {
          alerts.push({ equipment: eq, daysLeft: diffDays });
        }
      }
    }
    return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  }
}

export const militaryDataService = MilitaryDataService;
