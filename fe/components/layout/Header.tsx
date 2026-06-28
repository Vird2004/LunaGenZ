import Link from 'next/link';
import { Moon } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass !rounded-none !border-t-0 !border-x-0 border-b-white/10 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Moon className="w-8 h-8 text-accent group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-400">
            LunaGenZ
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/numerology" className="text-white/80 hover:text-accent transition-colors">
            Thần Số Học
          </Link>
          <Link href="/lenormand" className="text-white/80 hover:text-accent transition-colors">
            Trải Bài Lenormand
          </Link>
        </nav>
      </div>
    </header>
  );
}
