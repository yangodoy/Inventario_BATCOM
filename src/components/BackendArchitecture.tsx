import React, { useState } from 'react';
import {
  Database,
  FolderTree,
  FileCode2,
  Terminal,
  Server,
  Layers,
  Check,
  Copy,
  ExternalLink,
  Code2,
  Cpu,
} from 'lucide-react';

export const BackendArchitecture: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'erd' | 'tree' | 'code' | 'docker'>('erd');
  const [selectedFile, setSelectedFile] = useState<string>('controllers/equipmentController.ts');
  const [copied, setCopied] = useState(false);

  const fileContents: Record<string, { desc: string; lang: string; code: string }> = {
    'config/database.ts': {
      desc: 'Configuración de conexión Sequelize para PostgreSQL y MySQL',
      lang: 'typescript',
      code: `import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  dialect: (process.env.DB_DIALECT as 'postgres' | 'mysql') || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'mil_inventory_db',
  username: process.env.DB_USER || 'mil_admin',
  password: process.env.DB_PASSWORD || 'SecureMilPass2026!',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: { max: 15, min: 2, acquire: 30000, idle: 10000 }
};`,
    },
    'models/Equipment.ts': {
      desc: 'Modelo Sequelize de Equipamiento Tecnológico Táctico Militar',
      lang: 'typescript',
      code: `export const EquipmentModelDefinition = {
  tableName: 'equipment',
  fields: {
    id: { type: 'UUID', defaultValue: 'UUIDV4', primaryKey: true },
    serialNumber: { type: 'STRING(80)', allowNull: false, unique: true, field: 'serial_number' },
    nsnCode: { type: 'STRING(50)', allowNull: true, field: 'nsn_code' }, // OTAN
    model: { type: 'STRING(100)', allowNull: false },
    brand: { type: 'STRING(80)', allowNull: false },
    category: {
      type: 'ENUM',
      values: ['RADIO_TACTICO', 'SATCOM', 'CRIPTOGRAFIA_COMSEC', 'SERVIDORES_RUGERIZADOS', 'REDES_CAMPANA', 'C4ISR_DRONES', 'GUERRA_ELECTRONICA']
    },
    securityClassification: {
      type: 'ENUM',
      values: ['UNCLASSIFIED', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'],
      defaultValue: 'CONFIDENTIAL',
      field: 'security_classification'
    },
    status: {
      type: 'ENUM',
      values: ['OPERATIVO', 'EN_MISION', 'EN_MANTENIMIENTO', 'DEPOSITO_RESERVA', 'BAJA_DEFINITIVA'],
      defaultValue: 'OPERATIVO'
    },
    cryptoModuleInstalled: { type: 'BOOLEAN', defaultValue: false, field: 'crypto_module_installed' },
    cryptoKeyExpiration: { type: 'DATE', allowNull: true, field: 'crypto_key_expiration' },
    currentUnitId: { type: 'UUID', references: { model: 'military_units', key: 'id' } },
    assignedUserId: { type: 'UUID', references: { model: 'users', key: 'id' } },
    specifications: { type: 'JSONB', allowNull: true }
  }
};`,
    },
    'controllers/equipmentController.ts': {
      desc: 'Controlador de gestión de inventario, filtros tácticos y alertas COMSEC',
      lang: 'typescript',
      code: `export const equipmentController = {
  getAllEquipment: (req: Request, res: Response) => {
    // Filtros por categoría, estado operativo, clasificación y búsqueda por NSN
    const { category, status, classification, search } = req.query;
    // ... Lógica de filtrado y paginación
    res.status(200).json({ success: true, count: results.length, data: results });
  },

  getComsecAlerts: (_req: Request, res: Response) => {
    // Detecta equipos cuyas llaves de cifrado expiran en menos de 30 días
    const alerts = equipmentStore.filter(e => isExpiringSoon(e.cryptoKeyExpiration));
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  },

  createEquipment: (req: Request, res: Response) => {
    // Alta de material TIC con validación de duplicidad de serie militar
    // ...
  }
};`,
    },
    'routes/equipmentRoutes.ts': {
      desc: 'Rutas RESTful modulares para el módulo de inventario',
      lang: 'typescript',
      code: `import { Router } from 'express';
import { equipmentController } from '../controllers/equipmentController.ts';

const router = Router();

router.get('/', equipmentController.getAllEquipment);
router.get('/stats', equipmentController.getInventoryStats);
router.get('/alerts/comsec', equipmentController.getComsecAlerts);
router.get('/:id', equipmentController.getEquipmentById);
router.post('/', equipmentController.createEquipment);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

export default router;`,
    },
    'docker-compose.yml': {
      desc: 'Orquestación de PostgreSQL, Backend Express y Frontend React',
      lang: 'yaml',
      code: `version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: mil_inventory_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: \${DB_NAME:-mil_inventory_db}
      POSTGRES_USER: \${DB_USER:-mil_admin}
      POSTGRES_PASSWORD: \${DB_PASSWORD:-SecureMilPass2026!}
    ports:
      - "\${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mil_admin -d mil_inventory_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: .
    container_name: mil_inventory_backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: postgres
      DB_DIALECT: postgres
    depends_on:
      postgres:
        condition: service_healthy
    command: npm run server:dev

  frontend:
    build: .
    container_name: mil_inventory_frontend
    ports:
      - "3000:3000"
    command: npm run dev`,
    },
    '.env': {
      desc: 'Variables de entorno preconfiguradas para localhost',
      lang: 'bash',
      code: `PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:3000

# Base de Datos con Sequelize (PostgreSQL por defecto)
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mil_inventory_db
DB_USER=mil_admin
DB_PASSWORD=SecureMilPass2026!

# Para alternar a MySQL en cualquier momento:
# DB_DIALECT=mysql
# DB_PORT=3306
# DB_NAME=mil_inventory_db
# DB_USER=root
# DB_PASSWORD=SecureMilPass2026!

JWT_SECRET=TACTICAL_MIL_COMSEC_JWT_SECRET_KEY_984729184`,
    },
  };

  const handleCopyCode = () => {
    const active = fileContents[selectedFile];
    if (active) {
      navigator.clipboard.writeText(active.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Sub-Navegación de Arquitectura */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 shadow-md flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">
            Arquitectura del Backend, Esquema de Base y Entorno Docker
          </h2>
        </div>

        <div className="flex space-x-1 text-xs">
          <button
            onClick={() => setActiveSubTab('erd')}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              activeSubTab === 'erd' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Diagrama Relacional (ERD)
          </button>
          <button
            onClick={() => setActiveSubTab('tree')}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              activeSubTab === 'tree' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Estructura Modular
          </button>
          <button
            onClick={() => setActiveSubTab('code')}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              activeSubTab === 'code' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Visor de Código
          </button>
          <button
            onClick={() => setActiveSubTab('docker')}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              activeSubTab === 'docker' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Docker & Scripts
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DIAGRAMA RELACIONAL ERD */}
      {activeSubTab === 'erd' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-lg p-5 shadow-md space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>Esquema Relacional Sequelize (PostgreSQL / MySQL)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Modelo de datos normalizado con llaves foráneas, índices de alta velocidad y tipos ENUM
              </p>
            </div>

            {/* Representación Visual de Entidades */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Tabla: equipment */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="font-bold text-emerald-400 font-mono">TABLE: equipment</span>
                  <span className="text-[10px] text-slate-400">Entidad Central</span>
                </div>
                <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                  <li className="flex justify-between"><span className="text-amber-400">id (PK)</span> <span>UUID</span></li>
                  <li className="flex justify-between"><span className="text-cyan-400">serial_number (UK)</span> <span>VARCHAR(80)</span></li>
                  <li className="flex justify-between"><span>nsn_code</span> <span>VARCHAR(50)</span></li>
                  <li className="flex justify-between"><span>model, brand</span> <span>VARCHAR</span></li>
                  <li className="flex justify-between"><span>category</span> <span>ENUM</span></li>
                  <li className="flex justify-between"><span>security_classification</span> <span>ENUM</span></li>
                  <li className="flex justify-between"><span>crypto_module_installed</span> <span>BOOLEAN</span></li>
                  <li className="flex justify-between"><span>crypto_key_expiration</span> <span>TIMESTAMP</span></li>
                  <li className="flex justify-between"><span className="text-purple-400">current_unit_id (FK)</span> <span>UUID</span></li>
                  <li className="flex justify-between"><span className="text-purple-400">assigned_user_id (FK)</span> <span>UUID</span></li>
                </ul>
              </div>

              {/* Tabla: custody_logs */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="font-bold text-blue-400 font-mono">TABLE: custody_logs</span>
                  <span className="text-[10px] text-slate-400">Trazabilidad</span>
                </div>
                <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                  <li className="flex justify-between"><span className="text-amber-400">id (PK)</span> <span>UUID</span></li>
                  <li className="flex justify-between"><span className="text-purple-400">equipment_id (FK)</span> <span>UUID</span></li>
                  <li className="flex justify-between"><span className="text-purple-400">assigned_to_user_id (FK)</span> <span>UUID</span></li>
                  <li className="flex justify-between"><span className="text-purple-400">authorized_by_user_id (FK)</span> <span>UUID</span></li>
                  <li className="flex justify-between"><span>mission_code</span> <span>VARCHAR(80)</span></li>
                  <li className="flex justify-between"><span>date_assigned</span> <span>TIMESTAMP</span></li>
                  <li className="flex justify-between"><span>digital_signature_hash</span> <span>VARCHAR(255)</span></li>
                  <li className="flex justify-between"><span>status</span> <span>ENUM</span></li>
                </ul>
              </div>

              {/* Tabla: maintenance_records */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="font-bold text-amber-400 font-mono">TABLE: maintenance_records</span>
                  <span className="text-[10px] text-slate-400">COMSEC / Taller</span>
                </div>
                <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                  <li className="flex justify-between"><span className="text-amber-400">id (PK)</span> <span>UUID</span></li>
                  <li className="flex justify-between"><span className="text-purple-400">equipment_id (FK)</span> <span>UUID</span></li>
                  <li className="flex justify-between"><span className="text-purple-400">technician_user_id (FK)</span> <span>UUID</span></li>
                  <li className="flex justify-between"><span>maintenance_type</span> <span>ENUM</span></li>
                  <li className="flex justify-between"><span>severity</span> <span>ENUM</span></li>
                  <li className="flex justify-between"><span>crypto_keys_rotated</span> <span>BOOLEAN</span></li>
                  <li className="flex justify-between"><span>status</span> <span>ENUM</span></li>
                </ul>
              </div>

              {/* Tabla: users y military_units */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="font-bold text-purple-400 font-mono">TABLE: users & units</span>
                  <span className="text-[10px] text-slate-400">Personal & Destinos</span>
                </div>
                <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                  <li className="flex justify-between"><span>military_id (DNI)</span> <span>VARCHAR</span></li>
                  <li className="flex justify-between"><span>rank (Grado militar)</span> <span>VARCHAR</span></li>
                  <li className="flex justify-between"><span>clearance_level</span> <span>ENUM</span></li>
                  <li className="flex justify-between"><span>role (Permisos RBAC)</span> <span>ENUM</span></li>
                  <li className="flex justify-between"><span>unit_code (Batallón)</span> <span>VARCHAR</span></li>
                  <li className="flex justify-between"><span>branch (Fuerza)</span> <span>VARCHAR</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Reglas de Integridad Militar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 shadow-md space-y-4 text-xs">
            <h3 className="font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Políticas de Integridad y Seguridad</span>
            </h3>

            <div className="space-y-3">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">1. Bloqueo de Custodia Cripto</span>
                <p className="text-slate-300">
                  No se permite asignar equipos con clasificación TOP SECRET si la fecha de vigencia de claves KEK expiró.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="font-bold text-blue-400 block mb-1">2. Firma Criptográfica Inmutable</span>
                <p className="text-slate-300">
                  Cada salida de material genera un hash SHA-256 inalterable que vincula el número de serie, el oficial receptor y el código de misión.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">3. Conmutación Dual PostgreSQL / MySQL</span>
                <p className="text-slate-300">
                  Sequelize abstrae el dialecto SQL de modo que el usuario puede cambiar entre PostgreSQL y MySQL con una sola variable en <code className="text-emerald-400">.env</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ÁRBOL DE CARPETAS MODULAR */}
      {activeSubTab === 'tree' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 shadow-md space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-emerald-400" />
              <span>Estructura de Carpetas Modular (Backend & Frontend)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Separación de controladores, modelos, rutas, configuración y clientes tácticos
            </p>
          </div>

          <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
{`sigin-mil-inventory/
├── .env                              # Preconfigurado para localhost (PostgreSQL / MySQL)
├── .env.example                      # Ejemplo de configuración
├── docker-compose.yml                # Orquestación lista para correr con Docker Compose
├── Dockerfile                        # Imagen limpia Node 22 alpine
├── package.json                      # Scripts: docker:up, docker:down, db:migrate, dev
├── README.md                         # Documentación completa de arquitectura y DDL SQL
│
├── backend/                          # ARQUITECTURA MODULAR BACKEND
│   └── src/
│       ├── app.ts                    # Instancia Express y middlewares
│       ├── server.ts                 # Listener de puerto 5000 y banner militar
│       ├── config/
│       │   ├── database.ts           # Conexión Sequelize con soporte dual
│       │   └── init-db.sql           # Esquema DDL SQL listo para importar
│       ├── models/
│       │   ├── Equipment.ts          # Modelo de hardware militar TIC
│       │   ├── User.ts               # Personal militar y niveles de clearance
│       │   ├── MilitaryUnit.ts       # Batallones y bases aéreas/navales
│       │   ├── CustodyLog.ts         # Actas y firmas de entrega
│       │   ├── MaintenanceRecord.ts  # Taller técnico y COMSEC
│       │   └── index.ts              # Registro de asociaciones 1:N y N:M
│       ├── controllers/
│       │   ├── equipmentController.ts# Control de inventario y alertas COMSEC
│       │   ├── custodyController.ts  # Asignación y descargo de custodia
│       │   ├── maintenanceController.ts# Órdenes de calibración y reparación
│       │   ├── militaryUnitController.ts# Destacamentos militares
│       │   └── authController.ts     # Pases de guardia y autenticación
│       ├── routes/
│       │   ├── equipmentRoutes.ts    # /api/v1/equipment
│       │   ├── custodyRoutes.ts      # /api/v1/custody
│       │   ├── maintenanceRoutes.ts  # /api/v1/maintenance
│       │   ├── militaryUnitRoutes.ts # /api/v1/units
│       │   ├── authRoutes.ts         # /api/v1/auth
│       │   └── index.ts              # Enrutador consolidado /api/v1
│       └── middlewares/
│           ├── authMiddleware.ts     # Control de acceso por nivel de clasificación
│           └── errorHandler.ts       # Gestión de fallas internas
│
└── src/                              # CLIENTE FRONTEND REACT + TAILWIND (CERO CDNs)
    ├── App.tsx                       # Tablero principal de comando y control
    ├── main.tsx                      # Punto de entrada React
    ├── index.css                     # Estilos Tailwind CSS locales
    ├── types/military.ts             # Tipos TypeScript militares
    └── components/                   # Componentes de UI táctica`}
          </pre>
        </div>
      )}

      {/* SUBTAB 3: VISOR DE CÓDIGO */}
      {activeSubTab === 'code' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>Explorador de Archivos del Backend</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualiza el código fuente real implementado en el sistema
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white cursor-pointer"
              >
                {Object.keys(fileContents).map((fileName) => (
                  <option key={fileName} value={fileName}>
                    {fileName}
                  </option>
                ))}
              </select>

              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {fileContents[selectedFile] && (
            <div>
              <div className="text-xs text-slate-400 mb-2 font-medium">
                {fileContents[selectedFile].desc}
              </div>
              <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-96">
                <code>{fileContents[selectedFile].code}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: DOCKER Y SCRIPTS */}
      {activeSubTab === 'docker' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 shadow-md space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Instrucciones de Despliegue con Docker Compose</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Comandos predefinidos en <code className="text-emerald-400">package.json</code> para levantar la base de datos y la aplicación en un click
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                Paso 1: Iniciar todo el entorno con Docker Compose
              </span>
              <p className="text-slate-300">
                Levanta el contenedor de PostgreSQL 16 (con volumen persistente), el backend Express en el puerto 5000 y el frontend en el puerto 3000:
              </p>
              <div className="p-2.5 bg-slate-900 rounded font-mono text-white flex items-center justify-between">
                <span>npm run docker:up</span>
                <span className="text-[11px] text-slate-500">docker compose up -d</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="font-bold text-blue-400 uppercase tracking-wider block">
                Paso 2: Visualizar logs en tiempo real
              </span>
              <p className="text-slate-300">
                Muestra la salida y conexiones a la base de datos de los contenedores activos:
              </p>
              <div className="p-2.5 bg-slate-900 rounded font-mono text-white flex items-center justify-between">
                <span>npm run docker:logs</span>
                <span className="text-[11px] text-slate-500">docker compose logs -f</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <span className="font-bold text-amber-400 uppercase tracking-wider block">
                Paso 3: Detener el entorno
              </span>
              <p className="text-slate-300">
                Detiene los servicios manteniendo intacta la data en el volumen:
              </p>
              <div className="p-2.5 bg-slate-900 rounded font-mono text-white flex items-center justify-between">
                <span>npm run docker:down</span>
                <span className="text-[11px] text-slate-500">docker compose down</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
