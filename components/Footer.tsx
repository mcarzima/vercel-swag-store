"use cache";

export default async function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} Vercel, Inc. All rights reserved.</p>
        <div className="flex gap-4">
          
        </div>
      </div>
    </footer>
  );
}
