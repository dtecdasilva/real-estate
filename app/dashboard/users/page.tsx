'use client';

import { useEffect, useState } from "react";
import AgentSidebar from "@/components/ui/agent-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import Image from "next/image";

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
  whatsapp?: string;
  commissionFee?: string;
  visitFee?: string;
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
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [search, users]);

  const handleVerify = async (userId: string) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { verified: true });
      alert("User verified ✅");
    } catch (error) {
      console.error("Error verifying user: ", error);
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    const headers = ["Full Name", "Email", "Role", "WhatsApp", "Commission", "Visit Fee", "Submitted", "Verified"];
    const rows = filteredUsers.map((u) => [
      `${u.firstName} ${u.lastName}`,
      u.email,
      u.role,
      u.whatsapp|| "",
      u.commissionFee || "",
      u.visitFee || "",
      new Date(u.submittedAt).toLocaleString(),
      u.verified ? "Yes" : "No",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-muted">
      <div className="md:w-64 w-full">
        <AgentSidebar />
      </div>

      <main className="flex-1 px-4 md:px-6 py-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">Admins & Agents</h1>
          <Button variant="outline" onClick={exportCSV} className="w-full md:w-auto">
            Export CSV
          </Button>
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full p-2 border rounded-lg text-sm md:text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm md:text-base text-left">
            <thead className="bg-gray-100 border-b text-xs md:text-sm font-semibold text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Visit</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3">ID Document</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{user.whatsapp || "-"}</td>
                  <td className="px-4 py-3">{user.commissionFee || "-"}%</td>
                  <td className="px-4 py-3">{user.visitFee || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(user.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={user.verified ? "text-green-600 font-medium" : "text-yellow-600"}>
                      {user.verified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Image
                      src={user.profileImage}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded border shadow cursor-pointer"
                      onClick={() => setSelectedImage(user.profileImage)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Image
                      src={user.idDocumentImage}
                      alt="ID"
                      width={40}
                      height={40}
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
                        className="w-full md:w-auto"
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

        {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-full max-h-full">
                <Image
                  src={selectedImage}
                  alt="Full View"
                  width={800}       // maximum width
                  height={800}      // maximum height
                  className="object-contain rounded shadow-lg"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                  className="absolute top-2 right-2 text-white text-3xl font-bold"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

      </main>
    </div>
  );
}
