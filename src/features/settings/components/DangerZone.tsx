import { DeleteOrganizationModal } from "@/components/ui/modal/DeleteOrganizationModal";
import { useState } from "react";

export function DangerZone() {
  const [openDeleteOrg, setOpenDeleteOrg] = useState(false);
  const [loadingDeleteOrg, setLoadingDeleteOrg] = useState(false);
  return (
    <section className="mt-20 pt-10 border-t-2 border-dashed border-red-200">

      <h3 className="text-xl font-bold text-red-600 mb-2">
        Danger Zone
      </h3>

      <p className="text-sm text-slate-500 mb-6">
        Irreversible actions that affect your entire account.
      </p>

      <div className="flex flex-wrap gap-4">

        <button className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 font-bold text-sm">
          Deactivate Account
        </button>

        <button onClick={() => setOpenDeleteOrg(true)} className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-bold text-sm">
          Delete Organization
        </button>
    <DeleteOrganizationModal
      open={openDeleteOrg}
      organizationName="Neturai"
      loading={loadingDeleteOrg}
      onClose={() => setOpenDeleteOrg(false)}
      onConfirm={async () => {
        setLoadingDeleteOrg(true);

        await new Promise((res) => setTimeout(res, 1500));

        setLoadingDeleteOrg(false);
        setOpenDeleteOrg(false);
      }}
    />
      </div>

    </section>

    
  );

  
}