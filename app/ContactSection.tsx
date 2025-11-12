// app/components/ContactSection.tsx
import { Mail, PhoneCall, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Call Us */}
          <div className="flex justify-between items-center bg-white p-6 shadow-sm rounded">
            <div>
              <h3 className="font-bold text-xl">Call Us</h3>
              <p className="text-gray-600">+237 671 53 42 24</p>
            </div>
            <PhoneCall className="text-orange-500 w-10 h-10" />
          </div>

          {/* Email */}
          <div className="flex justify-between items-center bg-white p-6 shadow-sm rounded">
            <div>
              <h3 className="font-bold text-xl">Email</h3>
              <p className="text-gray-600">mybrico237@gmail.com</p>
            </div>
            <Mail className="text-blue-500 w-10 h-10" />
          </div>

          {/* Address */}
          <div className="flex justify-between items-center bg-white p-6 shadow-sm rounded">
            <div>
              <h3 className="font-bold text-xl">Address</h3>
              <p className="text-gray-600">Carrefour Bastos, Yaounde</p>
            </div>
            <MapPin className="text-red-500 w-10 h-10" />
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="bg-white p-8 shadow rounded">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                What is your request
              </label>
              <textarea
                placeholder="Your message"
                className="w-full border rounded px-4 py-2 h-24"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="mt-12 px-4 sm:px-6 lg:px-12">
        <div className="w-full h-64 sm:h-80 lg:h-96 rounded-md overflow-hidden border">
          <iframe
            src="https://www.google.com/maps?q=carrefour+bastos+yaounde&output=embed"
            width="100%"
            height="100%"
            className="w-full h-full rounded-md"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>  
  );
}
