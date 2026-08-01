export default function AdminPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <p
          className="
            font-mono text-sm uppercase
            tracking-[0.25em] text-emerald-400
          "
        >
          Protected system
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-emerald-100/60">
          Your session is valid and your account has
          administrator permission.
        </p>
      </div>
    </main>
  );
}