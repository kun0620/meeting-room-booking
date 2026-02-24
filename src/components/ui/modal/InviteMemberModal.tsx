import { useState } from "react";
import { BaseModal } from "./BaseModal";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: InviteFormData) => void;
  loading?: boolean;
}

export type InviteFormData = {
  email: string;
  role: "member" | "admin" | "viewer";
  message: string;
};

export function InviteMemberModal({
  open,
  onClose,
  onSubmit,
  loading,
}: InviteMemberModalProps) {

  const [form, setForm] = useState<InviteFormData>({
    email: "",
    role: "member",
    message: "",
  });

  const [error, setError] = useState("");

  const handleChange = (key: keyof InviteFormData, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {

    // 🔥 basic email validation
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    if (onSubmit) onSubmit(form);
    onClose();
  };

  return (
    <BaseModal open={open} onClose={onClose} maxWidth="max-w-lg">

      <div className="flex flex-col">

        {/* ================= HEADER ================= */}

        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Invite Team Member
            </h2>

            <button onClick={onClose}>
              <span className="material-symbols-outlined">
                close
              </span>
            </button>
          </div>

          <p className="text-slate-500 text-sm">
            Expand your workspace by adding new contributors.
          </p>
        </div>

        {/* ================= BODY ================= */}

        <div className="px-8 py-4 space-y-6">

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">
              Email Address
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@company.com"
              className={`w-full h-12 px-4 rounded-lg border text-sm transition-all
                ${
                  error
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200 bg-white"
                }`}
            />

            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
            )}

            <p className="text-xs text-slate-500">
              A validation link will be sent to this email.
            </p>
          </div>

          {/* ROLE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">
              Role
            </label>

            <select
              value={form.role}
              onChange={(e) =>
                handleChange("role", e.target.value)
              }
              className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>

            <p className="text-xs text-slate-500">
              Admins can manage billing and team settings.
            </p>
          </div>

          {/* MESSAGE */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold">
                Optional Message
              </label>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Optional
              </span>
            </div>

            <textarea
              rows={4}
              value={form.message}
              onChange={(e) =>
                handleChange("message", e.target.value)
              }
              placeholder="Add a personal note..."
              className="w-full p-4 rounded-lg border border-slate-200 bg-white text-sm resize-none"
            />
          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="px-8 py-6 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>

      </div>
    </BaseModal>
  );
}