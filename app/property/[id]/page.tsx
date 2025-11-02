"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Dialog } from "@headlessui/react";
import { Calendar, X, Video, Phone } from "lucide-react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";

type Listing = {
  id?: string;
  title: string;
  address: string;
  city: string;
  description: string;
  type: string;
  price: number;
  months: string;
  file: string;
  file2?: string;
  file3?: string;
  video?: string;
  availability: string;
  email?: string; 
};

const ListingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    amount: "",
  });
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const handleVideoOpen = () => setIsVideoOpen(true);
  const handleVideoClose = () => setIsVideoOpen(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

const images = [listing?.file, listing?.file2, listing?.file3]
  .filter((url): url is string => Boolean(url))
  .map((url) => ({ src: url }));

  // Fetch the listing details
  useEffect(() => {
    const fetchListing = async () => {
      if (typeof id === "string") {
        const docRef = doc(db, "listings", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data() as Listing);
        }
        else {
          console.error("No such document!");
        }
      }
    };

    fetchListing();
  }, [id]);
  const [recommendedListings, setRecommendedListings] = useState<Listing[]>([]);

  useEffect(() => {
  if (!listing) return; // early return inside effect is fine
  const fetchRecommended = async () => {
    try {
      const listingsRef = collection(db, "listings");
      const querySnapshot = await getDocs(listingsRef);
      const allListings: Listing[] = [];
  
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Listing;
        if (docSnap.id !== listing.id) {
          allListings.push({ id: docSnap.id, ...data });
        }
      });
  
      // Compute matching score with priority
      const scored = allListings.map((item) => {
        let score = 0;
  
        // 1️⃣ Highest priority: same city (weight 3)
        if (item.city === listing.city) score += 3;
  
        // 2️⃣ Next: same property type (weight 2)
        if (item.type === listing.type) score += 2;
  
        // 3️⃣ Lowest: within ±20% budget range (weight 1)
        if (item.price >= listing.price * 0.8 && item.price <= listing.price * 1.2) score += 1;
  
        return { ...item, score };
      });
  
      // Sort by highest score first, then closest price
      const sorted = scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return Math.abs(a.price - listing.price) - Math.abs(b.price - listing.price);
      });
  
      // Select top 3 best-matched listings only
      const topRecommendations = sorted.slice(0, Math.max(3, sorted.length));
  
      setRecommendedListings(topRecommendations);
    } catch (error) {
      console.error("Error fetching recommended listings:", error);
    }
  };  

  fetchRecommended();
  }, [listing]);

  const [agentPhone, setAgentPhone] = useState("");
  const [comFee, setComFee] = useState("");
  const [visitFee, setVisitFee] = useState("");
  useEffect(() => {
    const fetchAgentPhone = async () => {
      if (!listing?.email) return;
  
      try {
        const q = query(collection(db, "users"), where("email", "==", listing.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setAgentPhone(userData.whatsapp || ""); 
          setComFee(userData.commissionFee || ""); 
          setVisitFee(userData.visitFee || ""); 
        } else {
          console.warn("No user found with that email.");
        }
      } catch (error) {
        console.error("Error fetching agent phone:", error);
      }
    };
  
    fetchAgentPhone();
  }, [listing?.email]);

  const handleDialogClose = () => setIsOpen(false);
  const handleReserveProperty = () => setIsOpen(true);
  const handleCloseButton = () => setIsOpen(false);

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      amount: "",
    });
  };

  

  const handleReserveSubmit = async () => {
    if (!listing?.id) return;
  
    if (!formData.fullName || !formData.phoneNumber) {
      alert("Please enter your full name and phone number.");
      return;
    }
  
    try {
      // Update Firestore
      const docRef = doc(db, "listings", listing.id);
      await updateDoc(docRef, { availability: "reserved" });

      // 2️⃣ Save reservation info to "contact" collection
      await addDoc(collection(db, "contacts"), {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        listingId: listing.id,
        listingTitle: listing.title || "",
        status: "reserved",
        createdAt: new Date(),
      });
  
      // Update local state
      setListing({ ...listing, availability: "reserved" });
  
      alert(`Thank you ${formData.fullName}, property reserved successfully!`);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error reserving property:", error);
      alert("Failed to reserve property. Please try again.");
    }
  };

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  

  if (!listing) return <div className="p-8 text-center">Loading...</div>;
  
  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
    <p className="text-sm text-gray-600">
      BP: {listing.address}, {listing.city}, Cameroon –{" "}
      <span className="text-blue-600 underline cursor-pointer">Show on map</span>
    </p>
  </div>
  
  {/* Buttons Row */}
  <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
    {/* Reserve Button */}
    <Button
      onClick={handleReserveProperty}
      className="bg-blue-600 text-white hover:bg-white hover:text-black px-6 py-3 flex items-center gap-2 text-sm"
    >
      <Calendar size={18} />
      Reserve
    </Button>


    {/* Video Button */}
    <Button
      onClick={handleVideoOpen}
      className="bg-orange-600 text-white hover:bg-white hover:text-black px-6 py-3 flex items-center gap-2 text-sm"
    >
      <Video size={18} />
      Video
    </Button>

    {/* Contact Agent Button */}
    <Button
      onClick={() => {
        if (!agentPhone) {
          alert("Agent contact not available yet.");
          return;
        }
        const message = `Hi, I am from Shelter Space. I need the house "${listing.title}"`;
        const url = `https://wa.me/+237${agentPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
      }}
      className="bg-green-600 text-white hover:bg-white hover:text-black px-6 py-3 flex items-center gap-2 text-sm"
    >
      <Phone size={18} />
      Contact Agent
    </Button>

  </div>
</div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="md:col-span-2 cursor-pointer"
            onClick={() => { setLightboxOpen(true); setLightboxIndex(0); }}
          >
            <Image
              src={listing.file}
              alt="Main"
              width={800}
              height={500}
              className="w-full h-[400px] object-cover rounded-xl shadow"
            />
          </div>

          <div className="grid grid-rows-2 gap-2 h-[400px]">
            {listing.file2 && (
              <div
                className="cursor-pointer"
                onClick={() => { setLightboxOpen(true); setLightboxIndex(1); }}
              >
                <Image
                  src={listing.file2}
                  alt="Gallery 2"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover rounded-xl shadow"
                />
              </div>
            )}
            {listing.file3 && (
              <div
                className="cursor-pointer"
                onClick={() => { setLightboxOpen(true); setLightboxIndex(2); }}
              >
                <Image
                  src={listing.file3}
                  alt="Gallery 3"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover rounded-xl shadow"
                />
              </div>
            )}
          </div>
        </div>

        {lightboxOpen && (
          <Lightbox
            open={lightboxOpen}
            index={lightboxIndex}
            close={() => setLightboxOpen(false)}
            slides={images} // array of { src: string }
          />
        )}

        {/* Property Details */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Property Details</h2>
              <span className="bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
                {listing.type}
              </span>
            </div>

            <div className="text-gray-600">
              <p><strong>Address:</strong> {listing.address}, {listing.city}</p>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">{listing.description}</p>

            <div className="text-xl font-bold text-blue-600">
              FCFA {listing.price.toLocaleString()}{" "}
              <span className="text-sm text-gray-500">({listing.months} months)</span>
            </div>

            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Button
              onClick={handleReserveProperty}
              className="bg-blue-600 text-white hover:bg-white hover:text-black px-6 py-3 flex items-center gap-2 text-sm"
            >
              <Calendar size={18} />
              Reserve
            </Button>


              {/* Video Button */}
              <Button
                onClick={handleVideoOpen}
                className="bg-orange-600 text-white hover:bg-white hover:text-black px-6 py-3 flex items-center gap-2 text-sm"
              >
                <Video size={18} />
                Video
              </Button>

              {/* Contact Agent Button */}
              <Button
                onClick={() => {
                  const phone = "237671543308"; // agent's WhatsApp number
                  const message = `Hi, I am from Shelter Space. I need the house "${listing.title}"`;
                  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                  window.open(url, "_blank");
                }}
                className="bg-green-600 text-white hover:bg-white hover:text-black px-6 py-3 flex items-center gap-2 text-sm"
              >
                <Phone size={18} />
                Contact Agent
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 w-full max-w-sm mx-auto">
              <p className="text-gray-800 font-semibold text-lg mb-4">Agent Fees</p>
              <ul className="space-y-2">
                <li className="flex justify-between items-center text-gray-600">
                  <span>Visitation Fee</span>
                  <span className="font-medium text-gray-800">{visitFee ? `₣${Number(visitFee).toLocaleString()}` : "0"}</span>
                </li>
                <li className="flex justify-between items-center text-gray-600">
                  <span>Commission Fee</span>
                  <span className="font-medium text-gray-800">
                    {(((Number(comFee) || 0) / 100) * (Number(listing.price) || 0)).toLocaleString()}
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow">
              <iframe
                src={`https://maps.google.com/maps?q=${listing.address}${listing.city}&z=14&output=embed`}
                className="w-full h-40 border-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        {recommendedListings.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recommended Listings
          </h2>

          <div
            className="
              flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory 
              scrollbar-hide pb-4
            "
          >
            {recommendedListings.map((rec) => (
              <div
                key={rec.id}
                className="
                  bg-white rounded-2xl shadow-md overflow-hidden 
                  hover:shadow-lg transition relative 
                  min-w-[80%] sm:min-w-[50%] md:min-w-[33%] lg:min-w-[25%] 
                  snap-center
                "
              >
                <div className="relative">
                  <Image
                    src={rec.file}
                    alt={rec.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-200 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full z-10 shadow">
                    {rec.type}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {rec.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {rec.address}, {rec.city}
                  </p>
                  <p className="text-blue-600 font-bold mt-2">
                    FCFA {rec.price.toLocaleString()}
                  </p>
                  <Button
                    onClick={() => (window.location.href = `/property/${rec.id}`)}
                    className="mt-3 w-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
                  >
                    View Property
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      </div>
      

      {/* Modal */}
      <Dialog open={isOpen} onClose={handleDialogClose} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4 bg-black bg-opacity-50">
          <Dialog.Panel className="bg-white max-w-md w-full rounded-xl p-6 relative space-y-4 shadow-lg">
            <button
              onClick={handleCloseButton}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <Dialog.Title className="text-lg font-bold mb-4">Reserve Property</Dialog.Title>
            <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReserveSubmit(); // currently Flutterwave payment
            }}
            className="space-y-5 bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="e.g. 6xx xxx xxx"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
            >
              Reserve Now
            </Button>
          </form>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog open={isVideoOpen} onClose={handleVideoClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white max-w-3xl w-full rounded-xl p-4 relative shadow-lg">
          <button
            onClick={handleVideoClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
          <Dialog.Title className="text-lg font-bold mb-4">Property Video</Dialog.Title>

          <div className="aspect-w-16 aspect-h-9 w-full">
            {listing.video?.includes("youtube.com") || listing.video?.includes("vimeo.com") ? (
              <iframe
                src={listing.video}
                title="Property Video"
                allow="autoplay; fullscreen"
                className="w-full h-[500px] rounded-lg"
              ></iframe>
            ) : (
              <video
                src={listing.video}
                controls
                className="w-full h-[500px] rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
    </div>
  );
};

export default ListingPage;
