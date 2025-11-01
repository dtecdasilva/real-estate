'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Home, User, Users, Menu, X } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";   // ⬅️ your Firestore config
import { useUser } from "@clerk/nextjs"; // ⬅️ or your auth hook

export default function AgentSidebar() {
  const { user } = useUser();                 // current auth user
  const [role, setRole] = useState<string>(); // Firestore role

  useEffect(() => {
    if (!user?.id) return;
    // Fetch role from Firestore
    const fetchRole = async () => {
      const ref = doc(db, "users", user.id);   // your users collection
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setRole(snap.data().role);
      }
    };
    fetchRole();
  }, [user?.id]);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r p-6 z-50 transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:block
        `}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setMobileOpen(false)}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Sidebar content */}
        <Link href="/" className="text-lg font-semibold mb-8 inline-block">Home</Link>
        <nav className="flex flex-col gap-4">
          <SidebarLink icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" href="/dashboard" />

          {role === "sadmin" && (
            <SidebarLink icon={<Users className="w-4 h-4" />} label="Users" href="/dashboard/users" />
          )}

          <SidebarLink icon={<Home className="w-4 h-4" />} label="Listings" href="/dashboard/listings" />
          <SidebarLink icon={<User className="w-4 h-4" />} label="Profile" href="/dashboard/profile" />
        </nav>
      </aside>
    </>
  );
}

function SidebarLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-black transition"
    >
      {icon}
      {label}
    </Link>
  );
}
