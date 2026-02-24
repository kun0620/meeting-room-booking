const data = [
  { day: "Mon", value: 60 },
  { day: "Tue", value: 75 },
  { day: "Wed", value: 40 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 65 },
  { day: "Sat", value: 25 },
  { day: "Sun", value: 15 },
];

export function WeeklyUsageChart() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-900">
            Weekly Room Usage
          </h3>
          <p className="text-sm text-slate-500">
            Occupancy rate per day
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black text-primary">
            84%
          </p>
          <p className="text-xs text-emerald-600 font-bold">
            +5% from last week
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between h-48 gap-3 px-2 mt-8">

        {data.map((item) => (
          <div
            key={item.day}
            className="flex flex-col items-center flex-1 gap-3 h-full"
          >
            <div className="w-full bg-primary/10 rounded-t-lg h-full flex flex-col justify-end overflow-hidden">
              <div
                className="w-full bg-primary rounded-t-lg transition-all"
                style={{ height: `${item.value}%` }}
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              {item.day}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}