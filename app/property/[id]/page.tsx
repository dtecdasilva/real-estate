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
import { doc, getDoc, updateDoc, collection, query, where, getDocs} from "firebase/firestore";

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
      Reserve Now
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
              Reserve Now
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
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-700 font-medium mb-2">Agent Fees</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Visit Fee: {visitFee}</li>
                <li>Commision Fee: {comFee}</li>
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
              handleReserveSubmit();; // currently Flutterwave payment
            }}
            className="space-y-4"
          >
            <div>
              <label>Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Phone Number</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>
            <Button type="submit">Reserve Now</Button>
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
