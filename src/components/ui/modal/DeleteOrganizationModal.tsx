import { useState } from "react";
import { BaseModal } from "./BaseModal";

interface DeleteOrganizationModalProps {
  open: boolean;
  organizationName: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteOrganizationModal({
  open,
  organizationName,
  loading,
  onClose,
  onConfirm,
}: DeleteOrganizationModalProps) {

  const [confirmText, setConfirmText] = useState("");

  const isMatch =
  confirmText.trim().toLowerCase() ===
  organizationName.trim().toLowerCase();

  return (
    <BaseModal open={open} onClose={onClose} maxWidth="max-w-md" >

      <div className="flex flex-col">

        {/* ================= HEADER ================= */}

        <div className="pt-8 px-8 pb-4 flex flex-col items-center text-center">
          <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-red-600 text-4xl">
                warning
            </span>
            </div>

          <h2 className="text-2xl font-bold mb-3">
            Delete Organization
          </h2>

          <p className="text-slate-500 text-sm leading-relaxed">
            This action is permanent and cannot be undone.
            All rooms, bookings, and team data associated with this
            organization will be permanently deleted.
          </p>
        </div>

        {/* ================= BODY ================= */}

        <div className="px-8 pb-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Type <strong>{organizationName}</strong> to confirm
            </span>

            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={organizationName}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </label>
        </div>

        {/* ================= FOOTER ================= */}

        <div className="bg-slate-50 px-8 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-5 py-2.5 rounded-lg border text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={!isMatch || loading}
            onClick={onConfirm}
            className={`flex-1 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
                ${
                isMatch
                    ? "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
            >
            {loading ? "Deleting..." : "Delete Organization"}
            </button>
        </div>

      </div>
    </BaseModal>
  );
}