"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

type Listing = {
  id: string;
  file: string;
  title: string;
  address: string;
  city: string;
  description: string;
  price: number;
  months: string;
};

const ListingPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (id) {
        const docRef = doc(db, "listings", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
        }
      }
    };
    fetchListing();
  }, [id]);

  if (!listing) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Image
        src={listing.file}
        alt={listing.title}
        width={800}
        height={500}
        className="w-full h-96 object-cover rounded-md shadow-md"
      />
      <h1 className="text-3xl font-bold mt-6 mb-2">{listing.title}</h1>
      <p className="text-gray-700 mb-4">
        {listing.address}, {listing.city}
      </p>
      <p className="text-lg text-gray-800 mb-6">{listing.description}</p>
      <p className="text-xl text-blue-600 font-semibold">
        FCFA {listing.price.toLocaleString()} ({listing.months})
      </p>
    </div>
  );
};

export default ListingPage;
