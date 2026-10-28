
import { useState } from "react";

const SESSION_KEY = "vibetracker.demoSession";

export default function DemoLoginGate({ children }) {
  const [loggedIn, setLoggedIn] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === "active";
  });

  function handleLogin(e) {
    e.preventDefault();
    sessionStorage.setItem(SESSION_KEY, "active");
    setLoggedIn(true);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  }

  if (loggedIn) {
    return (
      <>
        <div className="flex items-center justify-between bg-teal-950 px-6 py-3 text-sm text-white">
          <span>Vibecoding Tracker — Demo Session</span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-teal-400 px-4 py-2 hover:bg-teal-800"
          >
            Log out
          </button>
        </div>
        {children}
      </>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">

        <section className="bg-teal-950 p-10 text-white">
          <div className="mb-12 text-xl font-bold">
            Vibecoding Project Tracker
          </div>

          <h1 className="mb-5 text-3xl font-bold">
            From Intent to Ship.
          </h1>

          <p className="mb-10 text-teal-100">
            Manage your projects, organise tasks,
            track progress and keep AI development
            context in one place.
          </p>

          <div className="space-y-4 text-sm text-teal-100">
            <p>✓ Kanban Task Management</p>
            <p>✓ AI Context & Task Handoffs</p>
            <p>✓ Smart Project Insights</p>
            <p>✓ Deliverable Tracking</p>
          </div>
        </section>

        <section className="p-8 md:p-12">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Welcome Back
          </h2>

          <p className="mb-8 text-sm text-slate-500">
            Sign in to continue to your project tracker.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="demo-email"
                className="mb-2 block text-sm font-medium"
              >
                Email Address
              </label>
              <input
                id="demo-email"
                type="text"
                inputMode="email"
                autoComplete="off"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-300 p-3 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="demo-password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="demo-password"
                type="password"
                autoComplete="off"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 p-3 focus:border-teal-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-teal-700 p-3 font-semibold text-white hover:bg-teal-800"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Coursework demonstration only.
            Any details or empty fields will work.
            No credentials are checked or stored.
            Do not enter a real password.
          </p>
        </section>
      </div>
    </main>
  );
}
