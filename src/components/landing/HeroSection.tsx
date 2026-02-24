export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:px-40 lg:py-24">
      <div className="flex w-full flex-col gap-8 lg:w-1/2">

        <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          New: v2.0 Now Live
        </span>

        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
          Simple Meeting Room Booking for{" "}
          <span className="text-primary">
            Modern Teams
          </span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400">
          Stop using Excel. Manage room bookings easily with a streamlined platform.
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="h-14 min-w-[160px] rounded-xl bg-primary px-8 font-bold text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            Start Free
          </button>

          <button className="h-14 min-w-[160px] rounded-xl border-2 border-primary/20 px-8 font-bold text-primary hover:bg-primary/5">
            Book Demo
          </button>
        </div>
      </div>

      <div className="relative w-full lg:w-1/2">
        <div className="absolute -inset-4 rounded-xl bg-primary/10 blur-2xl"></div>
        <div className="relative rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="h-[380px] flex items-center justify-center text-slate-400">
            Dashboard Preview
          </div>
        </div>
      </div>
    </section>
  );
}