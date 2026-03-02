import { useEffect } from "react";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function BaseModal({
  open,
  onClose,
  children,
  maxWidth = "max-w-md",
}: BaseModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
}