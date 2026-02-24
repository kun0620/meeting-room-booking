export function OrganizationSection() {
  return (
    <section>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">
          Organization
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Current Plan:
          </span>
          <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase">
            Pro
          </span>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl p-6 space-y-4">

        <p className="font-bold text-lg">
          RoomSync Corp
        </p>

        <p className="text-sm text-slate-500">
          Organization ID: RS-9921-X
        </p>

      </div>

    </section>
  );
}