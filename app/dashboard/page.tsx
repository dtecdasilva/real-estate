'use client';

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Eye, MessageSquare, User } from "lucide-react";
import AgentSidebar from "@/components/ui/agent-sidebar";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function AgentDashboard() {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen bg-muted">
      <AgentSidebar />

      <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
            Hi, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
        </h1>

        <div>
            <SignedIn>
            <UserButton />
            </SignedIn>
            <SignedOut>
            <SignInButton mode="modal">
                <User className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black" />
            </SignInButton>
            </SignedOut>
        </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Home className="w-5 h-5" /> Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold"></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Eye className="w-5 h-5" /> Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold"></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <MessageSquare className="w-5 h-5" /> Reserves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold"></p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <ul className="space-y-3">
              <li className="p-4 border rounded-md">🏠 Studio at Biyem-Assi — FCFA 150,000</li>
              <li className="p-4 border rounded-md">🏠 Apartment in Bonamoussadi — FCFA 250,000</li>
            </ul> */}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
