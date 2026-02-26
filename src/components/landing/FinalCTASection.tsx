import { Link } from "react-router-dom";

export function FinalCTASection() {
  return (
    <section className="mb-24 px-6 text-center lg:px-40">
      <div className="rounded-3xl bg-primary p-12 lg:p-20 relative overflow-hidden">

        <h2 className="text-3xl font-black text-white md:text-5xl">
          Ready to fix your meeting room chaos?
        </h2>

        <p className="max-w-xl mx-auto mt-6 text-white/80">
          Join thousands of companies using RoomSync.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/login"
            className="flex items-center justify-center h-14 rounded-xl bg-white px-10 font-bold text-primary decoration-transparent"
          >
            Get Started Now
          </Link>
          <button className="h-14 rounded-xl border-2 border-white/30 px-10 font-bold text-white">
            Talk to Sales
          </button>
        </div>

      </div>
    </section>
  );
}