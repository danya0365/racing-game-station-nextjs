'use client';

import { MachineStatus } from '@/src/application/repositories/IMachineRepository';
import { MACHINE_TYPES } from '@/src/config/machineConfig';
import { AnimatedButton } from '@/src/presentation/components/ui/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/ui/AnimatedCard';
import { ImageUploadInput } from '@/src/presentation/components/ui/ImageUploadInput';
import { Portal } from '@/src/presentation/components/ui/Portal';
import { useState } from 'react';

interface MachinesTabProps {
  machines: Array<{
    id: string;
    name: string;
    description: string;
    status: string;
    position: number;
    isActive: boolean;
    imageUrl?: string;
  }>;
  isUpdating: boolean;
  onUpdateStatus: (id: string, status: MachineStatus) => Promise<void>;
  onUpdateMachine: (id: string, data: {
    name?: string;
    description?: string;
    position?: number;
    imageUrl?: string;
    isActive?: boolean;
    status?: MachineStatus;
  }) => Promise<void>;
  onCreateMachine?: (data: {
    name: string;
    description: string;
    position: number;
    imageUrl?: string;
    type?: string;
    hourlyRate?: number;
  }) => Promise<void>;
  onUploadImage?: (file: File, pathPrefix?: string) => Promise<string>;
}

export function MachinesTab({ machines, isUpdating, onUpdateStatus, onUpdateMachine, onCreateMachine, onUploadImage }: MachinesTabProps) {
  const [editingMachine, setEditingMachine] = useState<typeof machines[0] | null>(null);
  const [viewingMachine, setViewingMachine] = useState<typeof machines[0] | null>(null);
  const [isAddingMachine, setIsAddingMachine] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return { label: 'ว่าง', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
      case 'occupied':
        return { label: 'กำลังเล่น', color: 'bg-orange-500', textColor: 'text-orange-400' };
      case 'maintenance':
        return { label: 'ซ่อมบำรุง', color: 'bg-gray-500', textColor: 'text-gray-400' };
      default:
        return { label: status, color: 'bg-gray-500', textColor: 'text-gray-400' };
    }
  };

  const handleToggleActive = async (machine: typeof machines[0]) => {
    await onUpdateMachine(machine.id, { isActive: !machine.isActive });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {onCreateMachine && (
          <AnimatedButton
            variant="primary"
            onClick={() => setIsAddingMachine(true)}
            disabled={isUpdating}
          >
            ➕ เพิ่มเครื่องใหม่
          </AnimatedButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {machines.map((machine) => {
          const statusConfig = getStatusConfig(machine.status);
          return (
            <AnimatedCard 
              key={machine.id} 
              className={`p-6 ${!machine.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 w-full cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setViewingMachine(machine)}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
                    🎮
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground flex items-center gap-2 truncate">
                      {machine.name}
                      {!machine.isActive && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full flex-shrink-0">
                          ซ่อน
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-muted">เครื่องที่ {machine.position}</p>
                  </div>
                  <button className="text-muted hover:text-cyan-400 transition-colors p-2" title="รายละเอียด" onClick={(e) => { e.stopPropagation(); setViewingMachine(machine); }}>
                    ℹ️
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full ${statusConfig.color} text-white text-xs font-medium whitespace-nowrap`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted mb-4 line-clamp-2">{machine.description}</p>

              <div className="flex flex-wrap gap-2">
                {/* Toggle Active Button */}
                <AnimatedButton
                  variant={machine.isActive ? 'ghost' : 'success'}
                  size="sm"
                  onClick={() => handleToggleActive(machine)}
                  disabled={isUpdating}
                >
                  {machine.isActive ? '👁️ ซ่อน' : '👁️ แสดง'}
                </AnimatedButton>

                {/* Status Buttons */}
                {machine.status !== 'available' && (
                  <AnimatedButton
                    variant="success"
                    size="sm"
                    onClick={() => onUpdateStatus(machine.id, 'available')}
                    disabled={isUpdating}
                  >
                    ✅ เปิดใช้งาน
                  </AnimatedButton>
                )}
                {machine.status !== 'maintenance' && (
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdateStatus(machine.id, 'maintenance')}
                    disabled={isUpdating}
                  >
                    🔧 ซ่อมบำรุง
                  </AnimatedButton>
                )}

                {/* Edit Button */}
                <AnimatedButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingMachine(machine)}
                  disabled={isUpdating}
                >
                  ✏️ แก้ไข
                </AnimatedButton>
              </div>
            </AnimatedCard>
          );
        })}
      </div>

      {/* Detail Machine Modal */}
      {viewingMachine && (
        <Portal>
          <MachineDetailModal
            machine={viewingMachine}
            onClose={() => setViewingMachine(null)}
          />
        </Portal>
      )}

      {/* Edit Machine Modal */}
      {editingMachine && (
        <Portal>
          <EditMachineModal
            machine={editingMachine}
            onClose={() => setEditingMachine(null)}
            onSave={async (data) => {
              await onUpdateMachine(editingMachine.id, data);
              setEditingMachine(null);
            }}
            isUpdating={isUpdating}
            onUploadImage={onUploadImage}
          />
        </Portal>
      )}
      {/* Add Machine Modal */}
      {isAddingMachine && onCreateMachine && (
        <Portal>
          <AddMachineModal
            onClose={() => setIsAddingMachine(false)}
            onSave={async (data) => {
              await onCreateMachine(data);
              setIsAddingMachine(false);
            }}
            isUpdating={isUpdating}
            onUploadImage={onUploadImage}
          />
        </Portal>
      )}
    </>
  );
}

// Add Machine Modal
interface AddMachineModalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    position: number;
    imageUrl?: string;
    type?: string;
    hourlyRate?: number;
  }) => Promise<void>;
  isUpdating: boolean;
  onUploadImage?: (file: File, pathPrefix?: string) => Promise<string>;
}

function AddMachineModal({ onClose, onSave, isUpdating, onUploadImage }: AddMachineModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    position: 1,
    imageUrl: '',
    type: 'simulator',
    hourlyRate: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      name: formData.name,
      description: formData.description,
      position: formData.position,
      imageUrl: formData.imageUrl || undefined,
      type: formData.type,
      hourlyRate: formData.hourlyRate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-border flex justify-between items-center">
          <h3 className="font-bold text-lg text-foreground">➕ เพิ่มเครื่องใหม่</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors" type="button">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-thin">
          <div>
            <label className="block text-sm text-muted mb-1">ชื่อเครื่อง <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground"
              placeholder="เช่น Game Station 1"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">รายละเอียด <span className="text-red-500">*</span></label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground resize-none"
              rows={3}
              placeholder="เช่น เครื่อง Formula Racing Game Station พร้อมพวงมาลัย..."
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">ลำดับเครื่อง <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="1"
              required
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">ประเภทเครื่อง</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground"
            >
              {MACHINE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">รูปภาพ (ไม่บังคับ)</label>
            <ImageUploadInput
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              disabled={isUpdating}
              onUpload={onUploadImage ? (file) => onUploadImage(file, 'machines') : undefined}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <AnimatedButton variant="ghost" onClick={onClose} className="flex-1" disabled={isUpdating}>
              ยกเลิก
            </AnimatedButton>
            <AnimatedButton variant="primary" type="submit" className="flex-1" disabled={isUpdating}>
              {isUpdating ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Machine Modal
interface EditMachineModalProps {
  machine: {
    id: string;
    name: string;
    description: string;
    status: string;
    position: number;
    isActive: boolean;
    imageUrl?: string;
    type?: string;
  };
  onClose: () => void;
  onSave: (data: {
    name?: string;
    description?: string;
    position?: number;
    imageUrl?: string;
    isActive?: boolean;
    status?: MachineStatus;
    type?: string;
  }) => Promise<void>;
  isUpdating: boolean;
  onUploadImage?: (file: File, pathPrefix?: string) => Promise<string>;
}

function EditMachineModal({ machine, onClose, onSave, isUpdating, onUploadImage }: EditMachineModalProps) {
  const [formData, setFormData] = useState({
    name: machine.name,
    description: machine.description,
    position: machine.position,
    imageUrl: machine.imageUrl || '',
    isActive: machine.isActive,
    status: machine.status as MachineStatus,
    type: machine.type || 'simulator',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      name: formData.name,
      description: formData.description,
      position: formData.position,
      imageUrl: formData.imageUrl || undefined,
      isActive: formData.isActive,
      status: formData.status,
      type: formData.type,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-border flex justify-between items-center">
          <h3 className="font-bold text-lg text-foreground">✏️ แก้ไขเครื่อง</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors" type="button">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-muted mb-1">ชื่อเครื่อง</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground"
              placeholder="เช่น Game Station 1"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-muted mb-1">รายละเอียด</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground resize-none"
              rows={3}
              placeholder="เช่น เครื่อง Formula Racing Game Station พร้อมพวงมาลัย..."
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm text-muted mb-1">ลำดับเครื่อง</label>
            <input
              type="number"
              min="1"
              required
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-muted mb-1">รูปภาพ (ไม่บังคับ)</label>
            <ImageUploadInput
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              disabled={isUpdating}
              onUpload={onUploadImage ? (file) => onUploadImage(file, 'machines') : undefined}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm text-muted mb-1">ประเภทเครื่อง</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground"
            >
              {MACHINE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-muted mb-1">สถานะ</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as MachineStatus })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground"
            >
              <option value="available">✅ ว่าง</option>
              <option value="occupied">🏁 กำลังเล่น</option>
              <option value="maintenance">🔧 ซ่อมบำรุง</option>
            </select>
          </div>

          {/* isActive Toggle */}
          <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
            <div>
              <p className="font-medium text-foreground">แสดงในหน้าลูกค้า</p>
              <p className="text-xs text-muted">เมื่อปิด เครื่องนี้จะไม่แสดงให้ลูกค้าเห็น</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                formData.isActive ? 'bg-emerald-500' : 'bg-gray-500'
              }`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                formData.isActive ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <AnimatedButton variant="ghost" onClick={onClose} className="flex-1" disabled={isUpdating}>
              ยกเลิก
            </AnimatedButton>
            <AnimatedButton variant="primary" type="submit" className="flex-1" disabled={isUpdating}>
              {isUpdating ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// Machine Detail Modal
interface MachineDetailModalProps {
  machine: {
    id: string;
    name: string;
    description: string;
    status: string;
    position: number;
    isActive: boolean;
    imageUrl?: string;
    type?: string;
  };
  onClose: () => void;
}

function MachineDetailModal({ machine, onClose }: MachineDetailModalProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return { label: 'ว่าง (ใช้งานได้)', color: 'bg-emerald-500/20 text-emerald-400', icon: '✅' };
      case 'occupied':
        return { label: 'กำลังเล่น', color: 'bg-orange-500/20 text-orange-400', icon: '🏁' };
      case 'maintenance':
        return { label: 'ซ่อมบำรุง', color: 'bg-gray-500/20 text-gray-400', icon: '🔧' };
      default:
        return { label: status, color: 'bg-gray-500/20 text-gray-400', icon: '❓' };
    }
  };

  const statusConfig = getStatusConfig(machine.status);
  const typeLabel = MACHINE_TYPES.find(t => t.value === machine.type)?.label || machine.type || 'ไม่ระบุ';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        {/* Header (Image if available) */}
        {machine.imageUrl ? (
          <div className="h-48 w-full relative bg-muted/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={machine.imageUrl} 
              alt={machine.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400/2a2a2a/ffffff?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm shadow-md" type="button">✕</button>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              ℹ️ รายละเอียดเครื่อง
            </h3>
            <button onClick={onClose} className="text-muted hover:text-foreground transition-colors" type="button">✕</button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Header Status & Name */}
          <div className="flex flex-col gap-1 -mt-2">
             <div className="flex items-center justify-between mb-1">
               <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} border border-white/5`}>
                 {statusConfig.icon} {statusConfig.label}
               </span>
               <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${machine.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                 {machine.isActive ? '👁️ แสดงในระบบ' : '🚫 ซ่อนจากผู้ใช้'}
               </span>
             </div>
             <h2 className="text-2xl font-bold text-foreground">{machine.name}</h2>
          </div>

          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-y-4">
               <div>
                  <p className="text-xs text-muted mb-1">รหัสเครื่อง (ID)</p>
                  <p className="font-mono text-sm break-all text-cyan-400">{machine.id.slice(0, 8)}...</p>
               </div>
               <div>
                  <p className="text-xs text-muted mb-1">ลำดับเครื่อง</p>
                  <p className="font-semibold text-foreground">เครื่องที่ {machine.position}</p>
               </div>
               <div>
                  <p className="text-xs text-muted mb-1">ประเภท</p>
                  <p className="text-sm font-medium bg-secondary/30 inline-block px-2 py-1 rounded text-cyan-300">🎮 {typeLabel}</p>
               </div>
            </div>
            
            <div className="pt-2 border-t border-border mt-2">
               <p className="text-xs text-muted mb-2 pt-2">รายละเอียดเพิ่มเติม</p>
               <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap decoration-clone">
                 {machine.description || (
                   <span className="text-muted italic">ไม่มีรายละเอียด</span>
                 )}
               </p>
            </div>
          </div>

          <div className="pt-2">
            <AnimatedButton variant="primary" onClick={onClose} className="w-full justify-center">
              ปิดหน้าต่าง
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
}
