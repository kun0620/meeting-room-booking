const features = [
  {
    icon: "calendar_month",
    title: "Smart Calendar",
    desc: "Drag-and-drop scheduling at any scale.",
  },
  {
    icon: "verified_user",
    title: "Zero Conflicts",
    desc: "Real-time syncing prevents double bookings.",
  },
  {
    icon: "bar_chart",
    title: "Usage Analytics",
    desc: "Occupancy and optimization metrics.",
  },
  {
    icon: "group",
    title: "Role Control",
    desc: "Granular permission system.",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-6 py-20 lg:px-40">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-extrabold">
          Streamline Your Workspace
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-slate-200 bg-white p-8 hover:border-primary/30 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <span className="material-symbols-outlined">
                {f.icon}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2">
              {f.title}
            </h3>

            <p className="text-sm text-slate-600">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}