// src/components/ui/modal/DangerModal.tsx

import { BaseModal } from "./BaseModal";

interface DangerModalProps {
  open: boolean; // 👉 เปิด modal ไหม
  title: string; // 👉 หัวข้อ
  description: string; // 👉 คำอธิบาย
  reference?: string; // 👉 ข้อมูลอ้างอิง เช่น Booking ID
  loading?: boolean; // 👉 กำลังลบอยู่ไหม
  onConfirm: () => Promise<void> | void; // 👉 กดยืนยัน
  onClose: () => void; // 👉 กดยกเลิก
}

export function DangerModal({
  open,
  title,
  description,
  reference,
  loading = false,
  onConfirm,
  onClose,
}: DangerModalProps) {
  return (
    <BaseModal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col">

        {/* 🔴 Header */}
        <div className="p-6 text-center">

          {/* ไอคอนวงกลมแดง */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-50">
            <span className="material-symbols-outlined text-red-600 text-2xl">
              warning
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {description}
          </p>

          {/* 👉 ถ้ามี reference แสดงกล่องข้อมูล */}
          {reference && (
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm">
              <p className="text-xs uppercase text-slate-400">
                Reference
              </p>
              <p className="font-semibold">
                {reference}
              </p>
            </div>
          )}
        </div>

        {/* 🔴 Footer */}
        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </BaseModal>
  );
}