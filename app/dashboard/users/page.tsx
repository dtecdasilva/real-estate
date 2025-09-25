'use client';

import { useEffect, useState } from "react";
import AgentSidebar from "@/components/ui/agent-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

interface FirebaseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage: string;
  idDocumentImage: string;
  submittedAt: string;
  verified: boolean;
}

export default function AdminsPage() {
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<FirebaseUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/get-users");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter out admins, only keep agents
          const agentsOnly = data.filter((user: FirebaseUser) => user.role !== "admin");
          setUsers(agentsOnly);
          setFilteredUsers(agentsOnly);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }
  
    fetchUsers();
  }, []);
  
  useEffect(() => {
    const filtered = users.filter((u) =>
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [search, users]);

  const handleVerify = async (userId: string) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", userId); // ✅ use the argument
      await updateDoc(userRef, { verified: true });
      alert("User verified ✅");
    } catch (error) {
      console.error("Error verifying user: ", error);
    } finally {
      setLoading(false); // optional: reset loading
    }
  };
  

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    const headers = [
      "Full Name",
      "Email",
      "Role",
      "Submitted",
      "Verified",
    ];
    const rows = filteredUsers.map((u) => [
      `${u.firstName} ${u.lastName}`,
      u.email,
      u.role,
      new Date(u.submittedAt).toLocaleString(),
      u.verified ? "Yes" : "No",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AgentSidebar />
      <main className="flex-1 px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admins & Agents</h1>
          <Button variant="outline" onClick={exportCSV}>
            Export CSV
          </Button>
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full md:w-1/2 p-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-auto rounded-lg shadow bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 border-b text-xs font-semibold text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3">ID Document</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3">{user.email}</td> 
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        user.role === "admin" ? "destructive" : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        user.verified
                          ? "text-green-600 font-medium"
                          : "text-yellow-600"
                      }
                    >
                      {user.verified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      width={50}
                      height={50}
                      className="rounded border shadow cursor-pointer"
                      onClick={() => setSelectedImage(user.profileImage)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={user.idDocumentImage}
                      alt="ID"
                      width={50}
                      height={50}
                      className="rounded border shadow cursor-pointer"
                      onClick={() => setSelectedImage(user.idDocumentImage)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {!user.verified && (
                      <Button
                        onClick={() => handleVerify(user.id)}
                        disabled={loading}
                        size="sm"
                      >
                        {loading ? "Verifying..." : "Verify"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Fullscreen image modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Full View"
              className="max-w-full max-h-full object-contain rounded shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-3xl font-bold"
            >
              &times;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
