import { Request, Response } from 'express';
import { initialUsers } from '../seeders/militarySeeds.ts';
import { UserAttributes } from '../models/User.ts';

const usersStore: UserAttributes[] = [...initialUsers];

export const authController = {
  /**
   * Inicio de sesión de operador / oficial militar
   */
  login: (req: Request, res: Response) => {
    try {
      const { email, militaryId, password } = req.body;

      const user = usersStore.find(
        (u) =>
          (email && u.email.toLowerCase() === email.toLowerCase()) ||
          (militaryId && u.militaryId.toLowerCase() === militaryId.toLowerCase())
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Identificación militar o contraseña inválida en terminal segura',
        });
      }

      // Simulación de token JWT seguro para el entorno militar
      const token = `MIL-JWT-${Buffer.from(JSON.stringify({ id: user.id, role: user.role, clearance: user.clearanceLevel, exp: Date.now() + 28800000 })).toString('base64')}`;

      const { passwordHash: _, ...safeUser } = user;

      res.status(200).json({
        success: true,
        message: 'Acceso táctico concedido',
        token,
        user: safeUser,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Falla en el servicio de autenticación de seguridad',
        error: error.message,
      });
    }
  },

  /**
   * Obtener personal militar del sistema
   */
  getPersonnel: (_req: Request, res: Response) => {
    try {
      const safeUsers = usersStore.map(({ passwordHash: _, ...u }) => u);
      res.status(200).json({
        success: true,
        count: safeUsers.length,
        data: safeUsers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar personal militar',
        error: error.message,
      });
    }
  },
};
