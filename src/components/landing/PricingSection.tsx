export function PricingSection() {
  return (
    <section className="px-6 py-20 lg:px-40 bg-slate-50 dark:bg-background-dark/50 rounded-3xl mx-4 mb-20">

      <div className="mb-16 text-center">
        <h2 className="text-3xl font-extrabold">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-3">
          Choose the plan that fits your team.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">

        {/* Free */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:bg-slate-900">
          <h3 className="text-lg font-bold mb-4">Free</h3>
          <p className="text-4xl font-black mb-6">$0</p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>2 meeting rooms</li>
            <li>50 bookings / month</li>
            <li>Basic support</li>
          </ul>
          <button className="mt-8 w-full rounded-xl border py-3 font-bold">
            Get Started
          </button>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border-2 border-primary bg-white p-8 shadow-xl dark:bg-slate-900">
          <h3 className="text-lg font-bold mb-4">Pro</h3>
          <p className="text-4xl font-black mb-6">$49</p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>Unlimited rooms</li>
            <li>Unlimited bookings</li>
            <li>Analytics</li>
            <li>Team management</li>
          </ul>
          <button className="mt-8 w-full rounded-xl bg-primary py-3 font-bold text-white">
            Go Pro
          </button>
        </div>

        {/* Enterprise */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:bg-slate-900">
          <h3 className="text-lg font-bold mb-4">Enterprise</h3>
          <p className="text-4xl font-black mb-6">Custom</p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>Custom branding</li>
            <li>Full API access</li>
            <li>SSO Integration</li>
          </ul>
          <button className="mt-8 w-full rounded-xl border py-3 font-bold">
            Contact Us
          </button>
        </div>

      </div>
    </section>
  );
}