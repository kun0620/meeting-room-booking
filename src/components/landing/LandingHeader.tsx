export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80 px-6 lg:px-40 py-4">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined">
              meeting_room
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            RoomSync
          </h2>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          <a className="text-sm font-medium text-slate-600 hover:text-primary">
            Features
          </a>
          <a className="text-sm font-medium text-slate-600 hover:text-primary">
            Pricing
          </a>
          <a className="text-sm font-medium text-slate-600 hover:text-primary">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex px-4 py-2 text-sm font-bold hover:bg-slate-100 rounded-lg">
            Login
          </button>

          <button className="bg-primary px-5 py-2 text-sm font-bold text-white rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90">
            Start Free
          </button>
        </div>
      </div>
    </header>
  );
}