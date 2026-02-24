import { ProfileSection } from "../components/ProfileSection";
import { SecuritySection } from "../components/SecuritySection";
import { OrganizationSection } from "../components/OrganizationSection";
import { DangerZone } from "../components/DangerZone";

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            Settings
          </h2>
          <p className="text-slate-500 mt-1">
            Manage your profile, security, and organization preferences.
          </p>
        </div>

        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm">
          Save Changes
        </button>
      </header>

      <div className="space-y-16">

        <ProfileSection />

        <Divider />

        <SecuritySection />

        <Divider />

        <OrganizationSection />

        <DangerZone />

      </div>

    </div>
  );
}

function Divider() {
  return (
    <hr className="border-slate-200" />
  );
}