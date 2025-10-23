"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface Listing {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  email: string;
  city: string;
  months: number;
  type: string;
  file: string; // Image URL
}
interface PropertyDetailsProps {
  limit?: number;
  showFilters?: boolean;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  limit,
  showFilters = true,
}) => {
  const searchParams = useSearchParams();
  const effectiveLimit = limit ?? (searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined);
  const effectiveShowFilters = showFilters ?? (searchParams.get("showFilters") !== "false");
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [listings, setListings] = useState<Listing[]>([]); // <-- add this
  // NEW: read cat query (rent or buy)
  const catFromQuery = searchParams.get("cat") || "";

  const typeFromQuery = searchParams.get("type") || "";
  const [typeFilter, setTypeFilter] = useState(typeFromQuery);
  const [monthsFilter, setMonthsFilter] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");


  // keep typeFilter in sync with URL changes
  useEffect(() => {
    if (typeFromQuery) setTypeFilter(typeFromQuery);
  }, [typeFromQuery]);

  // Fetch listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      const snapshot = await getDocs(collection(db, "listings"));
      const data: Listing[] = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          title: docData.title as string,
          description: docData.description as string,
          address: docData.address as string,
          price: Number(docData.price),
          email: docData.email as string,
          city: docData.city as string,
          months: Number(docData.months),
          type: docData.type as string,
          file: docData.file as string,
        };
      });
      setListings(data); // now this will work
    };
  
    fetchListings(); // <-- you were missing this call
  }, []);

  // Toggle description expand/collapse
  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get unique cities and types for filters
  const cities = Array.from(new Set(listings.map((l) => l.city)));
  const types = Array.from(new Set(listings.map((l) => l.type)));

  // Categories for rent and buy
  const RENT_TYPES = ["chambre moderne", "studio", "apartment", "guest-house"];
  const BUY_TYPES = ["land", "for sale - house"];

  // Filter listings
  const filteredListings = listings.filter((listing) => {
    const cityMatch =
      cityFilter ? listing.city === cityFilter : true;

    const typeMatch =
      typeFilter
        ? listing.type.toLowerCase() === typeFilter.toLowerCase()
        : true;

    const monthsMatch =
      monthsFilter ? listing.months <= Number(monthsFilter) : true;

    const textMatch = textFilter
      ? `${listing.title} ${listing.description} ${listing.address} ${listing.city} ${listing.type}`
          .toLowerCase()
          .includes(textFilter.toLowerCase())
      : true;

    const priceMatch = (() => {
        if (!priceRange) return true;
        if (priceRange.endsWith("+")) {
          const min = Number(priceRange.replace("+", ""));
          return listing.price >= min;
        }
        const [min, max] = priceRange.split("-").map(Number);
        return listing.price >= min && listing.price <= max;
    })();
          // NEW: match based on ?cat=rent or ?cat=buy
    const catMatch = catFromQuery
      ? catFromQuery === "rent"
        ? RENT_TYPES.includes(listing.type.toLowerCase())
        : catFromQuery === "buy"
        ? BUY_TYPES.includes(listing.type.toLowerCase())
        : true
      : true;

    return cityMatch && typeMatch && monthsMatch && textMatch && catMatch && priceMatch;
  });

  const clearFilters = () => {
    setCityFilter("");
    setTypeFilter("");
    setMonthsFilter("");
    setTextFilter("");
    setPriceRange("");
  };

  return (
    <section className="bg-[#f4f8fb] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
          Discover Our Featured Listings
        </h2>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Use the filters to find the perfect home or investment.
        </p>

        {/* Filters */}
        {effectiveShowFilters && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
            <input
              type="text"
              placeholder="Search anything..."
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
              className="border p-2 rounded w-full md:w-64"
            />

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="border p-2 rounded w-full md:w-64"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border p-2 rounded w-full md:w-64"
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="How many months can you pay?"
              value={monthsFilter}
              onChange={(e) => setMonthsFilter(e.target.value)}
              className="border p-2 rounded w-full md:w-64"
            />

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="border p-2 rounded w-full md:w-64"
            >
              <option value="">All Price Ranges</option>
              <option value="25000-35000">25k - 35k</option>
              <option value="35000-50000">35k - 50k</option>
              <option value="50000-100000">50k - 100k</option>
              <option value="100000-200000">100k - 200k</option>
              <option value="200000-500000">200k - 500k</option>
              <option value="500000-1000000">500k - 1M</option>
              <option value="1000000+">1M+</option>
            </select>


            <button
              onClick={clearFilters}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Listings grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {filteredListings.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <h3 className="text-2xl font-semibold text-gray-800">
                No Listings Found
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                We couldn’t find any listings matching your filters. Try
                adjusting your search or clearing the filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            (effectiveLimit ? filteredListings.slice(0, effectiveLimit) : filteredListings).map(
              (listing) => {
                const isExpanded = expandedDescriptions[listing.id];
                return (
                  <Link href={`/property/${listing.id}`} key={listing.id}>
                    <Card className="relative bg-white overflow-hidden shadow-md transition hover:shadow-lg cursor-pointer p-0">
                      {/* Type tag */}
                      <div className="absolute top-4 right-4 bg-yellow-200 text-black-800 text-xs font-semibold px-3 py-1 rounded-full z-10 shadow">
                        {listing.type}
                      </div>

                      {/* Image */}
                      <Image
                        src={listing.file}
                        alt={listing.title}
                        className="w-full h-56 object-cover block"
                      />

                      <CardContent className="px-6 py-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {listing.title}
                        </h2>
                        <p className="mt-1 text-md font-semibold text-gray-900 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>
                            {listing.address}, {listing.city}
                          </span>
                        </p>

                        <p
                          className={`mt-2 text-sm text-gray-500 ${
                            isExpanded ? "" : "line-clamp-2"
                          }`}
                        >
                          {listing.description}
                        </p>
                        {listing.description.length > 100 && (
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // prevent Link navigation
                              toggleDescription(listing.id);
                            }}
                            className="text-green-600 text-sm mt-1 hover:underline focus:outline-none"
                          >
                            {isExpanded ? "Read less" : "Read more"}
                          </button>
                        )}

                        <p className="mt-4 text-lg font-bold text-blue-600 mb-4">
                          FCFA {listing.price.toLocaleString()}{" "}
                          <small>({listing.months})</small>
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyDetails;
