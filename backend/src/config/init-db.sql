-- ====================================================================
-- SISTEMA DE INVENTARIO MILITAR TIC (SIGIN-MIL)
-- Esquema DDL para Inicialización de Base de Datos (PostgreSQL / MySQL)
-- ====================================================================

-- 1. Tabla de Unidades Militares
CREATE TABLE IF NOT EXISTS military_units (
    id VARCHAR(36) PRIMARY KEY,
    unit_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    branch VARCHAR(80) NOT NULL, -- Ej. Ejercito, Armada, Fuerza Aerea, Comando Conjunto
    location VARCHAR(120) NOT NULL,
    security_classification VARCHAR(30) DEFAULT 'CONFIDENTIAL',
    commander_name VARCHAR(120) NOT NULL,
    comms_officer_name VARCHAR(120),
    contact_frequency VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Personal Militar y Usuarios de Sistema
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    military_id VARCHAR(50) UNIQUE NOT NULL, -- DNI / Matricula Militar
    rank VARCHAR(60) NOT NULL, -- Ej. Coronel, Mayor, Capitan, Teniente, Sargento
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'OPERATOR', -- SUPER_ADMIN, COMSEC_OFFICER, LOGISTICS_CHIEF, OPERATOR
    clearance_level VARCHAR(30) DEFAULT 'RESTRICTED', -- UNCLASSIFIED, RESTRICTED, CONFIDENTIAL, SECRET, TOP_SECRET
    military_unit_id VARCHAR(36) REFERENCES military_units(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Equipamiento Tecnológico Táctico y Comunicaciones (TIC)
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR(36) PRIMARY KEY,
    serial_number VARCHAR(80) UNIQUE NOT NULL,
    nsn_code VARCHAR(50), -- NATO Stock Number (Codigo OTAN)
    model VARCHAR(100) NOT NULL,
    brand VARCHAR(80) NOT NULL, -- Harris, Thales, Rohde & Schwarz, Motorola, Cisco Rugged, etc.
    category VARCHAR(60) NOT NULL, -- RADIO_TACTICO, SATCOM, CRIPTOGRAFIA_COMSEC, SERVIDORES_RUGERIZADOS, REDES_CAMPANA, C4ISR_DRONES, GUERRA_ELECTRONICA
    security_classification VARCHAR(30) NOT NULL DEFAULT 'CONFIDENTIAL', -- RESTRICTED, CONFIDENTIAL, SECRET, TOP_SECRET
    status VARCHAR(40) NOT NULL DEFAULT 'OPERATIVO', -- OPERATIVO, EN_MISION, EN_MANTENIMIENTO, DEPOSITO_RESERVA, BAJA_DEFINITIVA
    frequency_range VARCHAR(80), -- Ej. 30 - 512 MHz (VHF/UHF/SATCOM)
    power_output VARCHAR(50), -- Ej. 5W - 20W Táctico
    crypto_module_installed BOOLEAN DEFAULT FALSE,
    crypto_key_expiration TIMESTAMP WITH TIME ZONE,
    current_unit_id VARCHAR(36) REFERENCES military_units(id) ON DELETE SET NULL,
    assigned_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    storage_vault VARCHAR(80), -- Ej. Polvorin de Comunicaciones B-4
    specifications JSONB, -- Especificaciones de blindaje EMP, estanqueidad IP67, etc.
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Actas y Trazabilidad de Custodia (Custody Logs)
CREATE TABLE IF NOT EXISTS custody_logs (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    assigned_to_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    authorized_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    military_unit_id VARCHAR(36) REFERENCES military_units(id) ON DELETE SET NULL,
    mission_code VARCHAR(80), -- Ej. OPERACION_CENTINELA_2026
    date_assigned TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_returned TIMESTAMP WITH TIME ZONE,
    expected_return_date TIMESTAMP WITH TIME ZONE,
    digital_signature_hash VARCHAR(255), -- Hash de integridad de firma de entrega
    return_condition_status VARCHAR(50), -- OPTIMO, DESGASTE_NORMAL, CON_FALLA, DAÑADO
    status VARCHAR(30) DEFAULT 'ACTIVA', -- ACTIVA, DEVUELTA, EXTRAVIADO, EN_INVESTIGACION
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Registros de Mantenimiento y Rotación Criptográfica (COMSEC)
CREATE TABLE IF NOT EXISTS maintenance_records (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    technician_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    maintenance_type VARCHAR(60) NOT NULL, -- PREVENTIVO, CORRECTIVO, ROTACION_CLAVES_CRIPTO, CALIBRACION_RF, AUDITORIA_COMSEC
    severity VARCHAR(30) DEFAULT 'MEDIA', -- BAJA, MEDIA, ALTA, CRITICA
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    findings TEXT,
    actions_taken TEXT,
    crypto_keys_rotated BOOLEAN DEFAULT FALSE,
    next_due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(40) DEFAULT 'PROGRAMADO', -- PROGRAMADO, EN_PROCESO, APROBADO_OPERATIVO, NO_REPARABLE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Rendimiento y Búsqueda Rápida Táctica
CREATE INDEX IF NOT EXISTS idx_equipment_serial ON equipment(serial_number);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category);
CREATE INDEX IF NOT EXISTS idx_equipment_classification ON equipment(security_classification);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_custody_active ON custody_logs(status, assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_comsec_crypto_exp ON equipment(crypto_key_expiration);
