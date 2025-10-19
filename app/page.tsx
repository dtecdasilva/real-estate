"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Plus, Flag, Heart, User, LayoutDashboard,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatAreYouLookingFor from "./WhatAreYouLookingFor";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import Link from "next/link";
import { X } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import UploadForm from "@/components/ui/UploadForm";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { doc, getDoc } from "firebase/firestore"; 
import PropertyDetails from "@/components/ui/PropertyDetails";




const images = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];
 // place in /public

export default function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedImageUrl2, setUploadedImageUrl2] = useState('');
  const [uploadedImageUrl3, setUploadedImageUrl3] = useState('');
  const { user } = useUser();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return setIsVerified(null);

      // If you have a Firestore "users" collection with a "verified" field:
      const snap = await getDoc(doc(db, "users", user.id));
      setIsVerified(snap.exists() ? snap.data().verified === true : false);

      // OR, if you use Clerk public metadata:
      // setIsVerified(user.publicMetadata?.verified === true);
    };
    fetchStatus();
  }, [user]);

  useEffect(() => {
    console.log("Page mounted");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      alert("You are not verified to add listings.");
      return;
    }  
    const form = e.target as HTMLFormElement;
    const data = {
      description: form.description.value,
      title: form.tit.value,
      address: form.address.value,
      city: form.city.value,
      months: form.months.value,
      price: Number(form.price.value),
      createdAt: new Date(),
      email: form.email.value,
      file: uploadedImageUrl,
      file2: uploadedImageUrl2,
      file3: uploadedImageUrl3,
      type: form.type.value,
      video: form.video.value,
      availability: "open",
    };
  
    try {
      await addDoc(collection(db, "listings"), data);
      alert("Listing added!");
      setShowModal(false); // close modal
      form.reset(); // clear form
    } catch (error) {
      console.error("Error adding listing: ", error);
      alert("Failed to add listing.");
    }
    
  };
  return (
    <main>
    <section className="relative w-full h-screen text-white">
      {/* Background Images */}
      {images.map((img, index) => (
        <Image
          key={img}
          src={img}
          alt="Background"
          fill
          className={`absolute inset-0 z-0 object-cover brightness-[0.5] transition-opacity duration-1000 ease-in-out ${
            currentImage === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Top Navbar */}
      <div className="relative z-10 px-4 md:px-40 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center ">
            <div className="p-2 rounded-full">
              <Image src="/logo.png" alt="Logo" width={60} height={24} />
            </div>
            <span className="font-bold text-lg text-white">Brisko</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 mr-4" />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 font-medium text-white relative">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="/property?cat=rent" className="hover:text-blue-400">Rent</Link>
          <Link href="/property?cat=buy" className="hover:text-blue-400">Buy</Link>
          <Link href="/be-an-agent" className="hover:text-blue-400">Be an Agent</Link>
          <Link href="/" className="hover:text-blue-400">Contact</Link>
        </nav>

        {/* CTA & Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={() => {
              if (!isVerified) {
                alert("Your account is not verified. Please wait for your account to be verified");
                return;
              }
              setShowModal(true);
            }}
            className="bg-blue-600 text-white hover:bg-white hover:text-black px-5 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Listing
          </Button>
          <Flag className="w-5 h-5 cursor-pointer" />
          <SignedIn>
            <Link href="/dashboard">
              <LayoutDashboard className="w-5 h-5 cursor-pointer" />
            </Link>
          </SignedIn>
          <SignedOut>
            <Heart className="w-5 h-5 cursor-pointer" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <User className="w-5 h-5 cursor-pointer" />
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
  <>
    {/* Overlay background */}
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
      onClick={() => setMobileOpen(false)}
    />

    {/* Drawer menu */}
    <div
      className={`fixed top-0 right-0 h-full w-72 bg-gray-900 text-white p-6 transform transition-transform duration-300 ease-in-out z-[9999] ${
        mobileOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col gap-4 h-full overflow-y-auto">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <Link href="/property?cat=rent" className="hover:text-blue-400">Rent</Link>
        <Link href="/property?cat=buy" className="hover:text-blue-400">Buy</Link>
        <Link href="/be-an-agent" className="hover:text-blue-400">Be an Agent</Link>
        <Link href="/" className="hover:text-blue-400">Contact</Link>

        <Button
          onClick={() => {
            if (!isVerified) {
              alert("Your account is not verified. Please wait for your account to be verified");
              return;
            }
            setShowModal(true);
          }}
          className="bg-blue-600 text-white w-full mt-2"
        >
          Add Listing
        </Button>

        <div className="flex gap-4 mt-2">
          <Flag className="w-5 h-5 cursor-pointer" />
          <SignedIn>
            <Link href="/dashboard">
              <LayoutDashboard className="w-5 h-5 cursor-pointer" />
            </Link>
          </SignedIn>
          <SignedOut>
            <Heart className="w-5 h-5 cursor-pointer" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <User className="w-5 h-5 cursor-pointer" />
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  </>
)}


      </div>


      {/* Hero Content */}
      <div className="relative z-0 flex flex-col justify-center h-full px-8 md:px-45 max-w-5xl -mt-20 md:mt-[-5rem]">
        <p className="text-lg md:text-xl py-1">Your trusted partner in real estate.</p>
        <h1 className="text-4xl md:text-6xl font-extrabold mt-4 leading-tight py-3">
          Find Your <span className="text-blue-500">Perfect</span> Home or Investment
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-xl">
          Explore homes, apartments, lands, and commercial spaces across top locations. Buy, rent, or sell with confidence.
        </p>
        <Link href="/property"><Button className="mt-9 w-fit py-7 px-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 cursor-pointer">
          Browse Listings
        </Button></Link>
      </div>

      {/* Carousel Arrows */}
      <div className="hidden md:flex absolute right-40 bottom-40 md:bottom-70 flex-col gap-4 z-10">
        <button
          className="w-15 h-15 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black cursor-pointer"
          onClick={() =>
            setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
          }
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          className="w-15 h-15 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black cursor-pointer"
          onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
    <Suspense fallback={<div>Loading listings...</div>}>
      <PropertyDetails limit={3} showFilters={false} />
    </Suspense>
    <WhatAreYouLookingFor />
    <ContactSection/>
    <Footer />
    {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
    <button
      onClick={() => setShowModal(false)}
      className="absolute top-3 right-3 text-gray-500 hover:text-black"
    >
      <X className="w-6 h-6" />
    </button>

    <h2 className="text-xl font-bold mb-4">Add New Listing</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      
        {/* 👤 Hidden email input (only when signed in) */}
        {user && (
          <input
            type="hidden"
            name="email"
            value={user.emailAddresses[0]?.emailAddress || ""}
            readOnly
          />
        )}

        {/* 🚪 Show Sign In button if logged out */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Sign In to Continue
            </button>
          </SignInButton>
        </SignedOut>
        <select className="w-full border p-2 rounded" name="type" required>
          <option>Select the type of house</option>
          <option>Chambre Moderne</option>
          <option>Studio</option>
          <option>Apartment</option>
          <option>House-For-Sale</option>
          <option>Guest-House</option>
          <option>Land</option>
        </select>
        <select
          name="city"
          className="w-full border p-2 rounded"
          defaultValue="" 
          required
        >
          <option value="" disabled>
            Select a city
          </option>
          <option value="Douala">Douala</option>
          <option value="Yaoundé">Yaounde</option>
          <option value="Bamenda">Bamenda</option>
          <option value="Bafoussam">Bafoussam</option>
          <option value="Garoua">Garoua</option>
          <option value="Maroua">Maroua</option>
          <option value="Nkongsamba">Nkongsamba</option>
          <option value="Ebolowa">Ebolowa</option>
          <option value="Kribi">Kribi</option>
          <option value="Limbe">Limbe</option>
          <option value="Kumba">Kumba</option>
          <option value="Buea">Buea</option>
          <option value="Foumban">Foumban</option>
          <option value="Bertoua">Bertoua</option>
          <option value="Ngaoundéré">Ngaoundéré</option>
          <option value="Kousséri">Kousséri</option>
        </select>
      <input
        type="text"
        placeholder="Title"
        name="tit"
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        placeholder="Description"
        name="description"
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Address"
        name="address"
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="number"
        placeholder="Price"
        name="price"
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="number"
        placeholder="Minimum number of months"
        name="months"
        className="w-full border p-2 rounded"
        required
      />
      
      <UploadForm onUpload={(url) => setUploadedImageUrl(url)} />

      <textarea
        placeholder="Video Link"
        name="video"
        className="w-full border p-2 rounded"
      />
      <Button type="submit" className="bg-blue-600 text-white w-full">
        Submit Listing
      </Button>
    </form>
  </div>
</div>

)}
    </main>
    
  );
}
