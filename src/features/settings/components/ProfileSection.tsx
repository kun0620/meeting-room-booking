import { useState } from "react";

export function ProfileSection() {
  const [preview, setPreview] = useState<string | null>(null);

  const handlePreview = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleRemove = () => {
    setPreview(null);
  };

  return (
    <section>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          Profile
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
            Admin
          </span>
        </h3>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-8">
        <Input label="Display Name" defaultValue="Alex Rivera" />
        <Input label="Email Address" defaultValue="alex@roomsync.com" type="email" />
      </div>

      {/* Profile Photo */}
      <div className="mt-8 flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">

        <div className="size-16 rounded-xl bg-slate-200 overflow-hidden shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-3xl">
                person
              </span>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-bold">
            Profile Photo
          </p>
          <p className="text-xs text-slate-500 mb-2">
            JPG or PNG, max size of 800KB
          </p>

          <div className="flex gap-3">

            <label className="text-xs font-bold text-primary hover:underline cursor-pointer">
              Upload New
              <input
                type="file"
                accept="image/*"
                onChange={handlePreview}
                className="hidden"
              />
            </label>

            <button
              onClick={handleRemove}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Remove
            </button>

          </div>
        </div>
      </div>

    </section>
  );
}

function Input({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:ring-primary focus:border-primary"
      />
    </div>
  );
}