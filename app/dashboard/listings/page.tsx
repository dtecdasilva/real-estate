'use client';

import { useEffect, useState } from "react";
import AgentSidebar from "@/components/ui/agent-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";



interface Listing {
  id: string;
  title: string;
  price: number;
  type: string;
  address: string;
  city: string;
  months: string;
  availability: string;
  description: string;
  email: string;
  file: string;
  file2: string;
  file3: string;
  video: string;
  createdAt: string;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const itemsPerPage = 5;
  const { user } = useUser();
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<Partial<Listing>>({});
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const [expandedListings, setExpandedListings] = useState<string[]>([]);

    const toggleDescription = (id: string) => {
    setExpandedListings(prev =>
        prev.includes(id)
        ? prev.filter(x => x !== id) // collapse
        : [...prev, id] // expand
    );
    };
  
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/get-listings");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter listings for logged-in user
          const userListings = data.filter((l: Listing) => l.email === userEmail);
          setListings(userListings);
          setFilteredListings(userListings);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    }
  
    if (userEmail) fetchListings(); // only fetch once email is available
  }, [userEmail]);
  
  

  useEffect(() => {
    const filtered = listings.filter((l) =>
      `${l.title} ${l.address} ${l.city}`.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredListings(filtered);
    setCurrentPage(1);
  }, [search, listings]);

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    const headers = [
      "Title",
      "Price",
      "Type",
      "Address",
      "City",
      "Months",
      "Availability",
      "Description",
      "Email",
      "File 1",
      "File 2",
      "File 3",
      "Video",
      "Created At"
    ];
    const rows = filteredListings.map((l) => [
      l.title,
      l.price,
      l.type,
      l.address,
      l.city,
      l.months,
      l.availability,
      l.description,
      l.email,
      l.file,
      l.file2,
      l.file3,
      l.video,
      new Date(l.createdAt).toLocaleString()
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "listings_export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AgentSidebar />
      <main className="flex-1 px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Listings</h1>
          <Button variant="outline" onClick={exportCSV}>
            Export CSV
          </Button>
        </div>

        <input
          type="text"
          placeholder="Search by title, address or city..."
          className="w-full md:w-1/2 p-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-auto rounded-lg shadow bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 border-b text-xs font-semibold text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Months</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">File 1</th>
                <th className="px-4 py-3">File 2</th>
                <th className="px-4 py-3">File 3</th>
                <th className="px-4 py-3">Video</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedListings.map((l) => (
                <tr key={l.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{l.title}</td>
                  <td className="px-4 py-3">FCFA {l.price}</td>
                  <td className="px-4 py-3">{l.type}</td>
                  <td className="px-4 py-3">{l.address}</td>
                  <td className="px-4 py-3">{l.city}</td>
                  <td className="px-4 py-3">{l.months}</td>
                  <td className="px-4 py-3">
                    <Badge variant={l.availability ? "secondary" : "destructive"}>
                        {l.availability || "N/A"}
                    </Badge>
                    </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="relative">
                    <p>
                        {expandedListings.includes(l.id) || (l.description?.length ?? 0) <= 100
                            ? l.description
                            : l.description?.slice(0, 100) + "..."}
                        </p>
                        {(l.description?.length ?? 0) > 100 && (
                        <button
                            className="text-blue-600 text-xs mt-1"
                            onClick={() => toggleDescription(l.id)}
                        >
                            {expandedListings.includes(l.id) ? "Show Less" : "Show More"}
                        </button>
                        )}
                    </div>
                    </td>
                  {[l.file, l.file2, l.file3].map((file, idx) => (
                    <td key={idx} className="px-4 py-3">
                      <Image
                        src={file || "/placeholder.png"} // optional fallback
                        alt={`File ${idx + 1}`}
                        width={50}
                        height={50}
                        className="rounded border shadow cursor-pointer"
                        onClick={() => setSelectedImage(file)}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <a
                      href={l.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Video
                    </a>
                  </td>
                  <td className="px-4 py-3">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                        setEditingListing(l);
                        setFormData(l);
                        }}
                    >
                        Edit
                    </Button>
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
            <div className="relative w-full h-screen flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Full View"
                fill
                className="object-contain rounded shadow-lg"
              />
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-3xl font-bold"
            >
              &times;
            </button>
          </div>
        )}
       {editingListing && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
      <h2 className="text-xl font-bold mb-4">Edit Listing</h2>

      <div className="space-y-2 max-h-[70vh] overflow-auto">
        {[
          "title",
          "price",
          "type",
          "address",
          "city",
          "months",
          "availability",
          "description",
          "file",
          "file2",
          "file3",
          "video",
        ].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="font-medium">{field}</label>
            <input
              type={field === "price" ? "number" : "text"}
              value={formData[field as keyof Listing] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field]: field === "price" ? Number(e.target.value) : e.target.value,
                }))
              }
              className="p-2 border rounded"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={() => setEditingListing(null)}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            // <-- Place your try/catch block here
            try {
              const res = await fetch(`/api/update-listing/${editingListing.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              });

              if (!res.ok) {
                const text = await res.text();
                console.error("Failed response:", text);
                throw new Error("Failed to update listing");
              }

              const updated = await res.json();
              setListings((prev) =>
                prev.map((l) => (l.id === updated.id ? updated : l))
              );
              setFilteredListings((prev) =>
                prev.map((l) => (l.id === updated.id ? updated : l))
              );
              setEditingListing(null);
            } catch (err) {
              console.error(err);
              alert("Failed to update listing. See console for details.");
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}
