export function SecuritySection() {
  return (
    <section>
      <h3 className="text-xl font-bold mb-6">
        Security
      </h3>

      <div className="grid md:grid-cols-3 gap-6">

        <PasswordInput label="Current Password" />
        <PasswordInput label="New Password" />
        <PasswordInput label="Confirm Password" />

      </div>

      <div className="mt-6">
        <button className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold text-sm">
          Update Password
        </button>
      </div>

    </section>
  );
}

function PasswordInput({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700">
        {label}
      </label>
      <input
        type="password"
        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
      />
    </div>
  );
}