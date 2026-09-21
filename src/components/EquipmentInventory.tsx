import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Radio,
  Satellite,
  Lock,
  Server,
  Shield,
  Activity,
  AlertCircle,
  Eye,
  CheckCircle2,
  X,
  Layers,
  ArrowRightLeft,
  Wrench,
} from 'lucide-react';
import { Equipment, EquipmentCategory, EquipmentStatus, SecurityClassification, MilitaryUnit, MilitaryUser } from '../types/military.ts';

interface EquipmentInventoryProps {
  equipmentList: Equipment[];
  units: MilitaryUnit[];
  users: MilitaryUser[];
  onAddEquipment: (eq: Omit<Equipment, 'id'>) => void;
  onUpdateStatus: (id: string, status: EquipmentStatus) => void;
  onSelectForCustody?: (eq: Equipment) => void;
  onSelectForMaintenance?: (eq: Equipment) => void;
  selectedEquipmentDetail?: Equipment | null;
  onCloseDetailModal?: () => void;
}

export const EquipmentInventory: React.FC<EquipmentInventoryProps> = ({
  equipmentList,
  units,
  users,
  onAddEquipment,
  onUpdateStatus,
  onSelectForCustody,
  onSelectForMaintenance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');

  // Modal para ver detalle técnico
  const [viewingDetail, setViewingDetail] = useState<Equipment | null>(null);

  // Modal para agregar nuevo equipo
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSerialNumber, setNewSerialNumber] = useState('');
  const [newNsnCode, setNewNsnCode] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState<EquipmentCategory>('RADIO_TACTICO');
  const [newClassification, setNewClassification] = useState<SecurityClassification>('CONFIDENTIAL');
  const [newStatus, setNewStatus] = useState<EquipmentStatus>('OPERATIVO');
  const [newFrequency, setNewFrequency] = useState('');
  const [newPower, setNewPower] = useState('');
  const [newVault, setNewVault] = useState('');
  const [newHasCrypto, setNewHasCrypto] = useState(false);
  const [newNotes, setNewNotes] = useState('');
  const [newUnitId, setNewUnitId] = useState(units[0]?.id || '');

  // Filtrado de equipos
  const filteredList = equipmentList.filter((item) => {
    const matchesSearch =
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.nsnCode && item.nsnCode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    const matchesClassification = selectedClassification === 'ALL' || item.securityClassification === selectedClassification;

    return matchesSearch && matchesCategory && matchesStatus && matchesClassification;
  });

  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSerialNumber || !newModel || !newBrand) return;

    onAddEquipment({
      serialNumber: newSerialNumber,
      nsnCode: newNsnCode || undefined,
      model: newModel,
      brand: newBrand,
      category: newCategory,
      securityClassification: newClassification,
      status: newStatus,
      frequencyRange: newFrequency || undefined,
      powerOutput: newPower || undefined,
      storageVault: newVault || 'Almacén Central TIC',
      cryptoModuleInstalled: newHasCrypto,
      cryptoKeyExpiration: newHasCrypto ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() : null,
      currentUnitId: newUnitId || undefined,
      notes: newNotes || undefined,
      specifications: {
        certification: 'MIL-STD-810H / STANAG 4203',
        chassis: 'Aluminio anodizado de aviación militar',
      },
    });

    // Reset
    setNewSerialNumber('');
    setNewNsnCode('');
    setNewModel('');
    setNewBrand('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (cat: EquipmentCategory) => {
    switch (cat) {
      case 'RADIO_TACTICO':
        return <Radio className="w-4 h-4 text-emerald-400" />;
      case 'SATCOM':
        return <Satellite className="w-4 h-4 text-blue-400" />;
      case 'CRIPTOGRAFIA_COMSEC':
        return <Lock className="w-4 h-4 text-purple-400" />;
      case 'SERVIDORES_RUGERIZADOS':
        return <Server className="w-4 h-4 text-cyan-400" />;
      case 'REDES_CAMPANA':
        return <Activity className="w-4 h-4 text-teal-400" />;
      case 'C4ISR_DRONES':
      case 'GUERRA_ELECTRONICA':
        return <Shield className="w-4 h-4 text-amber-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const getClassificationBadge = (classification: SecurityClassification) => {
    switch (classification) {
      case 'TOP_SECRET':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-950 border border-rose-700 text-rose-300">
            TOP SECRET
          </span>
        );
      case 'SECRET':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-950 border border-amber-700 text-amber-300">
            SECRETO
          </span>
        );
      case 'CONFIDENTIAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-950 border border-blue-700 text-blue-300">
            CONFIDENCIAL
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300">
            RESTRINGIDO
          </span>
        );
    }
  };

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'OPERATIVO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Operativo
          </span>
        );
      case 'EN_MISION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 border border-blue-500/40 text-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            En Misión
          </span>
        );
      case 'EN_MANTENIMIENTO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/40 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            En Taller
          </span>
        );
      case 'DEPOSITO_RESERVA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Reserva
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 border border-rose-500/40 text-rose-300">
            Baja
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Búsqueda, Filtros y Botón de Nuevo Equipo */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Input de Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por N° Serie Militar, Modelo, Marca o Código NSN OTAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-md pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Botón Incorporar Nuevo Material */}
          <button
            id="btn-incorporar-equipo"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-md shadow transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Incorporar Material TIC</span>
          </button>
        </div>

        {/* Filtros Tácticos */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center space-x-1 text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase text-[11px]">Filtros:</span>
          </div>

          {/* Categoría */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">Todas las Categorías</option>
            <option value="RADIO_TACTICO">Radiocomunicaciones Tácticas</option>
            <option value="SATCOM">Terminales Satelitales (SATCOM)</option>
            <option value="CRIPTOGRAFIA_COMSEC">Criptografía & COMSEC</option>
            <option value="SERVIDORES_RUGERIZADOS">Servidores Rugerizados</option>
            <option value="REDES_CAMPANA">Redes de Campaña</option>
            <option value="C4ISR_DRONES">C4ISR & Drones</option>
            <option value="GUERRA_ELECTRONICA">Guerra Electrónica</option>
          </select>

          {/* Estado Operativo */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="OPERATIVO">Operativo</option>
            <option value="EN_MISION">En Misión</option>
            <option value="EN_MANTENIMIENTO">En Taller</option>
            <option value="DEPOSITO_RESERVA">Depósito Reserva</option>
          </select>

          {/* Nivel de Clasificación */}
          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">Todas las Clasificaciones</option>
            <option value="TOP_SECRET">TOP SECRET</option>
            <option value="SECRET">SECRETO</option>
            <option value="CONFIDENTIAL">CONFIDENCIAL</option>
            <option value="RESTRICTED">RESTRINGIDO</option>
          </select>

          {(selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedClassification !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSelectedClassification('ALL');
                setSearchTerm('');
              }}
              className="text-emerald-400 hover:text-emerald-300 text-[11px] underline ml-auto cursor-pointer"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla del Inventario Táctico */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Identificación / NSN</th>
                <th className="py-3 px-4">Material Táctico</th>
                <th className="py-3 px-4">Clasificación</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Unidad & Ubicación</th>
                <th className="py-3 px-4">COMSEC / Cifrado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                    No se encontraron equipos militares con los filtros especificados.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const unit = units.find((u) => u.id === item.currentUnitId);
                  const assignedUser = users.find((u) => u.id === item.assignedUserId);

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* N° Serie y NSN */}
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-white tracking-wide">{item.serialNumber}</div>
                        {item.nsnCode && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span className="text-emerald-500 font-bold">NSN:</span> {item.nsnCode}
                          </div>
                        )}
                      </td>

                      {/* Modelo y Categoría */}
                      <td className="py-3 px-4">
                        <div className="flex items-start space-x-2">
                          <div className="p-1.5 bg-slate-800 rounded mt-0.5">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-100">{item.model}</div>
                            <div className="text-[11px] text-slate-400">{item.brand}</div>
                          </div>
                        </div>
                      </td>

                      {/* Clasificación */}
                      <td className="py-3 px-4">
                        {getClassificationBadge(item.securityClassification)}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Unidad y Ubicación */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{unit ? unit.unitCode : 'Almacén Central'}</div>
                        <div className="text-[11px] text-slate-400">
                          {assignedUser ? `Custodia: ${assignedUser.rank} ${assignedUser.lastName}` : item.storageVault || 'Depósito B-1'}
                        </div>
                      </td>

                      {/* COMSEC */}
                      <td className="py-3 px-4">
                        {item.cryptoModuleInstalled ? (
                          <div className="flex items-center space-x-1.5">
                            <Lock className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-[11px] text-purple-300 font-medium">NSA Type 1</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Sin Cripto</span>
                        )}
                      </td>

                      {/* Acciones Rápidas */}
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => setViewingDetail(item)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
                          title="Ver Ficha Técnica Militar"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {item.status === 'OPERATIVO' && onSelectForCustody && (
                          <button
                            onClick={() => onSelectForCustody(item)}
                            className="p-1.5 bg-blue-950 hover:bg-blue-800 text-blue-300 rounded border border-blue-700/60 transition-colors cursor-pointer"
                            title="Asignar Custodia a Efectivo Militar"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {item.status !== 'EN_MANTENIMIENTO' && onSelectForMaintenance && (
                          <button
                            onClick={() => onSelectForMaintenance(item)}
                            className="p-1.5 bg-amber-950 hover:bg-amber-800 text-amber-300 rounded border border-amber-700/60 transition-colors cursor-pointer"
                            title="Enviar a Taller / Calibración COMSEC"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Ficha Técnica Militar del Equipo */}
      {viewingDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setViewingDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                  FICHA TÉCNICA MILITAR CLASIFICADA
                </span>
                <h3 className="text-lg font-bold text-white">{viewingDetail.model}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  SERIE: {viewingDetail.serialNumber} | NSN: {viewingDetail.nsnCode || 'N/A'}
                </p>
              </div>
              <div>{getClassificationBadge(viewingDetail.securityClassification)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block font-medium">Fabricante Militar</span>
                <span className="text-white font-semibold">{viewingDetail.brand}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block font-medium">Rango de Frecuencias</span>
                <span className="text-white font-semibold">{viewingDetail.frequencyRange || 'Enlace Digital IP'}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block font-medium">Potencia de Salida RF</span>
                <span className="text-white font-semibold">{viewingDetail.powerOutput || 'Estándar Táctico'}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block font-medium">Lugar de Guarda / Polvorín</span>
                <span className="text-white font-semibold">{viewingDetail.storageVault || 'Depósito B-1'}</span>
              </div>
            </div>

            {/* Módulo Criptográfico */}
            <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded text-xs space-y-1">
              <div className="flex items-center space-x-2 font-bold text-purple-300">
                <Lock className="w-4 h-4" />
                <span>Protección COMSEC & Criptográfica</span>
              </div>
              <p className="text-slate-300">
                {viewingDetail.cryptoModuleInstalled
                  ? `Módulo Criptográfico Activo. Fecha de Expiración de Claves: ${
                      viewingDetail.cryptoKeyExpiration
                        ? new Date(viewingDetail.cryptoKeyExpiration).toLocaleDateString()
                        : 'No registrada'
                    }`
                  : 'Este equipo no cuenta con módulo de cifrado táctico instalado.'}
              </p>
            </div>

            {/* Especificaciones de Blindaje y Hardware */}
            {viewingDetail.specifications && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Normas de Rugerización y Blindaje
                </h4>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
                  {Object.entries(viewingDetail.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-850 pb-1">
                      <span className="text-slate-500 uppercase">{key}:</span>
                      <span className="text-emerald-400">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewingDetail.notes && (
              <div className="text-xs text-slate-400 p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="font-bold text-slate-300 block mb-1">Notas de Mando:</span>
                {viewingDetail.notes}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Incorporar Nuevo Material TIC */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-xl w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Incorporar Material TIC al Inventario Militar</span>
              </h3>
              <p className="text-xs text-slate-400">
                Registro oficial de alta bajo directivas logísticas de telecomunicaciones
              </p>
            </div>

            <form onSubmit={handleCreateEquipment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">N° Serie Militar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. SN-AN-PRC-152-9901"
                    value={newSerialNumber}
                    onChange={(e) => setNewSerialNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Código NSN OTAN</label>
                  <input
                    type="text"
                    placeholder="Ej. 5820-01-547-8841"
                    value={newNsnCode}
                    onChange={(e) => setNewNsnCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Modelo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Falcon III AN/PRC-152A"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Fabricante / Marca *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. L3Harris Technologies"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EquipmentCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="RADIO_TACTICO">Radio Táctico</option>
                    <option value="SATCOM">SATCOM</option>
                    <option value="CRIPTOGRAFIA_COMSEC">Criptografía COMSEC</option>
                    <option value="SERVIDORES_RUGERIZADOS">Servidor Rugerizado</option>
                    <option value="REDES_CAMPANA">Red de Campaña</option>
                    <option value="C4ISR_DRONES">C4ISR / Drones</option>
                    <option value="GUERRA_ELECTRONICA">Guerra Electrónica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Clasificación</label>
                  <select
                    value={newClassification}
                    onChange={(e) => setNewClassification(e.target.value as SecurityClassification)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="RESTRICTED">Restringido</option>
                    <option value="CONFIDENTIAL">Confidencial</option>
                    <option value="SECRET">Secreto</option>
                    <option value="TOP_SECRET">Top Secret</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Estado</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as EquipmentStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="OPERATIVO">Operativo</option>
                    <option value="DEPOSITO_RESERVA">Depósito Reserva</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Rango Frecuencia</label>
                  <input
                    type="text"
                    placeholder="Ej. 30 - 512 MHz VHF/UHF"
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Potencia / Alimentación</label>
                  <input
                    type="text"
                    placeholder="Ej. 5W / 20W Vehicular"
                    value={newPower}
                    onChange={(e) => setNewPower(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Unidad de Asignación</label>
                  <select
                    value={newUnitId}
                    onChange={(e) => setNewUnitId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.unitCode} - {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Polvorín / Bóveda</label>
                  <input
                    type="text"
                    placeholder="Ej. Armería TIC Bóveda 2"
                    value={newVault}
                    onChange={(e) => setNewVault(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="hasCryptoCheckbox"
                  checked={newHasCrypto}
                  onChange={(e) => setNewHasCrypto(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="hasCryptoCheckbox" className="text-slate-300 font-medium cursor-pointer">
                  Módulo Criptográfico Militar Instalado (COMSEC NSA Type 1)
                </label>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Notas de Alta</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre recepción, accesorios de antena y baterías de litio incluidas..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer font-bold"
                >
                  Incorporar al Arsenal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
