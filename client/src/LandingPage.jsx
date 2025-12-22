import {React,useEffect} from "react";
import { Link,useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";

export default function LandingPage() {

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* HERO */}
      <main className="flex-1 mt-10">
        <section className="container mx-auto px-6 py-2 text-center">
          <img class="mx-auto w-22 h-26" src="/images/logouppng.png" alt="logo" />
          <h2 className="text-4xl font-bold text-blue-950 mx-auto leading-tight">
            BIZORA<br></br><p className="text-yellow-300 font-light text-2xl pb-10">Ignite.Innovate.Prosper</p>
          </h2>
          
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Connect with startup founders, investors, and mentors. Share ideas, find co-founders, join events,
            and collaborate on projects.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Link
              to="/register"
              className="but border border-black px-6 py-3 rounded-xl bg-gray-900 text-black transition-colors duration-300 hover:bg-blue-200 hover:text-blue-900"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="but border border-black px-6 py-3 rounded-xl  bg-gray-900 text-black transition-colors duration-300 hover:bg-blue-200 hover:text-blue-900"
            >
              Login
            </Link>
            
          </div>

          {/* Tagline strip */}
          <div className="mx-auto max-w-2xl mt-6 my-16 bg-white/6 rounded-md py-4 px-6 flex items-center justify-between gap-4">
            <div className="text-left">
              <div className="text-sm uppercase tracking-wider">Our Promise</div>
              <div className="text-lg font-semibold">Ignite. Innovate. Prosper.</div>
            </div>

            <div className="hidden md:flex gap-6">
              <div className="text-center">
                <div className="font-bold text-xl">Ideas</div>
                <div className="text-sm opacity-90">Share & refine concepts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">Events</div>
                <div className="text-sm opacity-90">Host & join meetups</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">Collaborate</div>
                <div className="text-sm opacity-90">Partner on projects</div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="bg-white/6 py-20 mx-6">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">About Bizora</h2>
              <p className="mb-4 text-yellow-200/95">
                Bizora is a community-first platform that connects founders, investors and mentors. We help turn
                ideas into businesses by providing tools for discovery, events, messaging, and collaboration.
              </p>

              <ul className="space-y-2 text-yellow-200/90">
                <li>• Curated events and workshops</li>
                <li>• Private messaging & team formation</li>
                <li>• Project collaboration spaces</li>
              </ul>

              <div className="mt-15">
                <Link
                  to="/about"
                  className="but border border-black px-6 py-3 rounded-xl bg-gray-900 text-black transition-colors duration-300 hover:bg-blue-200 hover:text-blue-900"
                >
                  Learn more
                </Link>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-900/30 p-8">
              <img class="rounded-lg" src="/images/headmain.png" alt="head" />
              <div className="text-sm mt-4 text-yellow-200">Headquarters</div>
              <div className="font-semibold text-lg">Bangalore · India</div>
            </div>
          </div>
        </section>

        {/* FEATURES / PROMISE CARDS */}
        <section className="py-16 mx-6">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold mb-6">Ignite. Innovate. Prosper.</h3>
            <p className="mb-8 max-w-2xl mx-auto text-yellow-200/85">
              Three pillars guide how we work with founders and builders — ignite ideas, provide tools for
              innovation, and help teams prosper with connections and opportunities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-white/6 shadow hover:scale-[1.02] transition">
                <div className="text-xl font-semibold mb-2">Ignite</div>
                <div className="text-sm">Find mentors, feedback, and seed collaborators to spark your idea.</div>
              </div>

              <div className="p-6 rounded-lg bg-white/6 shadow hover:scale-[1.02] transition">
                <div className="text-xl font-semibold mb-2">Innovate</div>
                <div className="text-sm">Access resources, workshops, and tools to iterate quickly.</div>
              </div>

              <div className="p-6 rounded-lg bg-white/6 shadow hover:scale-[1.02] transition">
                <div className="text-xl font-semibold mb-2">Prosper</div>
                <div className="text-sm">Connect with investors, partners, and customers to grow sustainably.</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}