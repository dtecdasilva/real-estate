'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, CheckCircle, MessageSquare, User } from "lucide-react";
import AgentSidebar from "@/components/ui/agent-sidebar";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  availability: string;
  createdAt: string;
  email: string;
}

export default function AgentDashboard() {
  const { user } = useUser();
  const [listings, setListings] = useState<Listing[]>([]);
  const [recentListings, setRecentListings] = useState<Listing[]>([]);

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    async function fetchListings() {
      if (!userEmail) return;
      try {
        const res = await fetch("/api/get-listings");
        const data: Listing[] = await res.json();
        // Only include this user's listings
        const userListings = data.filter((l: Listing) => l.email === userEmail);
        setListings(userListings);
        // Sort by createdAt descending and take 2 recent listings
        const sorted = [...userListings].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentListings(sorted.slice(0, 2));
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    }

    fetchListings();
  }, [userEmail]);

  const uploadedCount = listings.length;
  const reservedCount = listings.filter((l) => l.availability === "reserved").length;
  const isVerified = user?.externalAccounts ? true : false; // replace with actual verification logic if needed

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
              <p className="text-2xl font-bold">{uploadedCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" /> Profile Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${isVerified ? "text-green-600" : "text-yellow-600"}`}>
                {isVerified ? "Verified" : "Not Verified"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <MessageSquare className="w-5 h-5" /> Reserved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{reservedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentListings.length > 0 ? (
                recentListings.map((l) => (
                  <li key={l.id} className="p-4 border rounded-md">
                    🏠 {l.title} in {l.city} — FCFA {l.price.toLocaleString()} ({l.availability})
                  </li>
                ))
              ) : (
                <li className="p-4 text-gray-500">No listings yet</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
