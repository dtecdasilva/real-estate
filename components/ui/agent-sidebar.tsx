'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Plus, Home, MessageSquare, Settings, User, Users } from "lucide-react";
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

  return (
    <aside className="w-64 bg-white border-r p-6 hidden md:block">
      <h2 className="text-lg font-semibold mb-8">Agent Panel</h2>
      <nav className="flex flex-col gap-4">
        <SidebarLink icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" href="/dashboard" />

        {/* 👇 Only show Users tab if role is NOT agent */}
        {role !== "agent" && (
          <SidebarLink icon={<Users className="w-4 h-4" />} label="Users" href="/dashboard/users" />
        )}

        <SidebarLink icon={<Home className="w-4 h-4" />} label="Listings" href="/dashboard/listings" />
        {/* <SidebarLink icon={<Plus className="w-4 h-4" />} label="Properties" href="/dashboard/new" /> */}
        {/* <SidebarLink icon={<MessageSquare className="w-4 h-4" />} label="Messages" href="/dashboard/messages" /> */}
        <SidebarLink icon={<User className="w-4 h-4" />} label="Profile" href="/dashboard/profile" />
        {/* <SidebarLink icon={<Settings className="w-4 h-4" />} label="Settings" href="/dashboard/settings" /> */}
      </nav>
    </aside>
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
