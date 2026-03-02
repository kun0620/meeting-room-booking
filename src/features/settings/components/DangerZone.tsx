import { DeleteOrganizationModal } from "@/components/ui/modal/DeleteOrganizationModal";
import { DangerModal } from "@/components/ui/modal/DangerModal";
import { useState } from "react";

export function DangerZone() {
  const [openDeleteOrg, setOpenDeleteOrg] = useState(false);
  const [loadingDeleteOrg, setLoadingDeleteOrg] = useState(false);

  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [loadingDeactivate, setLoadingDeactivate] = useState(false);
  return (
    <section className="mt-20 pt-10 border-t-2 border-dashed border-red-200">

      <h3 className="text-xl font-bold text-red-600 mb-2">
        Danger Zone
      </h3>

      <p className="text-sm text-slate-500 mb-6">
        Irreversible actions that affect your entire account.
      </p>

      <div className="flex flex-wrap gap-4">

        <button
          onClick={() => setOpenDeactivate(true)}
          className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
        >
          Deactivate Account
        </button>

        <button onClick={() => setOpenDeleteOrg(true)} className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-md shadow-red-200">
          Delete Organization
        </button>
        <DeleteOrganizationModal
          open={openDeleteOrg}
          organizationName="RoomSync Corp"
          loading={loadingDeleteOrg}
          onClose={() => setOpenDeleteOrg(false)}
          onConfirm={async () => {
            setLoadingDeleteOrg(true);
            await new Promise((res) => setTimeout(res, 1500));
            setLoadingDeleteOrg(false);
            setOpenDeleteOrg(false);
            alert("Organization deleted.");
          }}
        />

        <DangerModal
          open={openDeactivate}
          title="Deactivate Account"
          description="Your account will be suspended and all active bookings will be cancelled. You can reactivate by contacting support."
          onConfirm={async () => {
            setLoadingDeactivate(true);
            await new Promise((res) => setTimeout(res, 1500));
            setLoadingDeactivate(false);
            setOpenDeactivate(false);
            alert("Account deactivated.");
          }}
          loading={loadingDeactivate}
          onClose={() => setOpenDeactivate(false)}
        />
      </div>

    </section>


  );


}