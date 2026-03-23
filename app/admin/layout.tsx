import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  ChevronLeft,
  Hammer
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-obsidian text-ivory">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col bg-obsidian-200">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <Hammer className="w-6 h-6 text-gold" />
          <span className="font-spectral text-xl font-bold tracking-tighter uppercase italic">
            Atelier <span className="text-gold">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <AdminNavLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />}>
            Overview
          </AdminNavLink>
          <AdminNavLink href="/admin/products" icon={<Package className="w-4 h-4" />}>
            Vault Management
          </AdminNavLink>
          <AdminNavLink href="/admin/orders" icon={<ShoppingCart className="w-4 h-4" />}>
            Orders
          </AdminNavLink>
          <AdminNavLink href="/admin/customers" icon={<Users className="w-4 h-4" />}>
            Customers
          </AdminNavLink>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <AdminNavLink href="/admin/settings" icon={<Settings className="w-4 h-4" />}>
            Settings
          </AdminNavLink>
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2 text-sm text-ivory/60 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-obsidian-100">
          <h1 className="font-spectral text-lg italic text-ivory/80 uppercase tracking-widest">
            Sovereign Command
          </h1>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-[10px] font-bold text-gold">
               HB
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-ivory/70 hover:text-white hover:bg-white/5 transition-all group"
    >
      <span className="text-ivory/40 group-hover:text-gold transition-colors">
        {icon}
      </span>
      {children}
    </Link>
  );
}
