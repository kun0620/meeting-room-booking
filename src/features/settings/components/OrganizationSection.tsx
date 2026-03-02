import { useState } from "react";
import { InviteMemberModal } from "@/components/ui/modal/InviteMemberModal";

export function OrganizationSection() {
  const [openInvite, setOpenInvite] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  return (
    <section>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">
          Organization
        </h3>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenInvite(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all"
          >
            <span className="material-symbols-outlined !text-sm">add_circle</span>
            Invite Member
          </button>
          <div className="h-4 w-[1px] bg-slate-200 mx-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              Current Plan:
            </span>
            <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase">
              Pro
            </span>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-[24px] p-8 space-y-4 bg-white shadow-sm shadow-slate-100">

        <p className="font-bold text-lg">
          RoomSync Corp
        </p>

        <p className="text-sm text-slate-500">
          Organization ID: RS-9921-X
        </p>

      </div>

      <InviteMemberModal
        open={openInvite}
        loading={loadingInvite}
        onClose={() => setOpenInvite(false)}
        onSubmit={async (data) => {
          setLoadingInvite(true);
          console.log("Inviting:", data);
          await new Promise(r => setTimeout(r, 1500));
          setLoadingInvite(false);
          setOpenInvite(false);
          alert(`Invite sent to ${data.email}`);
        }}
      />

    </section>
  );
}