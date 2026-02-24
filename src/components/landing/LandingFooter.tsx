export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-12 dark:bg-background-dark lg:px-40">

      <div className="mx-auto max-w-[1280px] flex flex-col lg:flex-row justify-between gap-12">

        <div className="flex flex-col gap-6 lg:w-1/3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-sm">
                meeting_room
              </span>
            </div>
            <h2 className="text-lg font-bold">
              RoomSync
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            The modern standard for meeting room management.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          © 2024 RoomSync Inc. All rights reserved.
        </div>

      </div>

    </footer>
  );
}