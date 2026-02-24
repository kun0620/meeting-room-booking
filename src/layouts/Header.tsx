export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200">

      <div className="flex items-center gap-4">
        <span className="text-slate-400">/</span>
        <h2 className="text-slate-800 font-semibold">
          Neturai Workspace
        </h2>
      </div>

      <div className="flex items-center gap-6">

        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>

          <input
            className="bg-slate-100 border-none rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Search rooms..."
            type="text"
          />
        </div>

        <button className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors">
          Upgrade
        </button>

        <div className="w-8 h-8 rounded-full bg-slate-200 ring-2 ring-white shadow-sm" />

      </div>
    </header>
  );
}