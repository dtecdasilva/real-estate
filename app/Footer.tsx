// app/components/Footer.tsx
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube, FaTiktok } from "react-icons/fa";

  
  export default function Footer() {
    return (
      <footer className="bg-gray-700 text-white pt-12 pb-6 px-9">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-5 gap-8">
          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-lg mb-4">Popular Searches</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">› Apartment for Rent</li>
              <li className="hover:text-white cursor-pointer">› Apartment Low to hide</li>
              <li className="hover:text-white cursor-pointer">› Offices for Buy</li>
              <li className="hover:text-white cursor-pointer">› Offices for Rent</li>
              <li className="text-blue-400 cursor-pointer hover:underline">More</li>
            </ul>
          </div>
  
          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-lg mb-4">Homepress Markets</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">Los Angeles Offices</li>
              <li className="hover:text-white cursor-pointer">Las Vegas Apartments</li>
              <li className="hover:text-white cursor-pointer">Sacramento Townhome</li>
              <li className="hover:text-white cursor-pointer">San Francisco Offices</li>
              <li className="text-blue-400 cursor-pointer hover:underline">More</li>
            </ul>
          </div>
  
          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">Pricing Plans</li>
              <li className="hover:text-white cursor-pointer">Our Services</li>
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
              <li className="text-blue-400 cursor-pointer hover:underline">More</li>
            </ul>
          </div>
  
          {/* Column 4 - Subscribe */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-lg mb-4">Subscribe</h4>
            <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border border-white text-white placeholder-white rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-5">
              Subscribe
            </button>
          </div>
        </div>
  
        {/* Bottom Bar */}
        <div className="border-t border-gray-500 mt-10 pt-6 px-4 text-sm flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          <p className="text-gray-300 mb-4 md:mb-0 text-center md:text-left">
            Copyright © 2022. HomePress – Real Estate WordPress Theme by StylemixThemes.
          </p>
  
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
                <FaFacebookF className="text-blue-600 hover:opacity-80 cursor-pointer" size={20} />
                <FaInstagram className="text-pink-500 hover:opacity-80 cursor-pointer" size={20} />
                <FaTwitter className="text-blue-400 hover:opacity-80 cursor-pointer" size={20} />
                <FaLinkedinIn className="text-blue-700 hover:opacity-80 cursor-pointer" size={20} />
                <FaYoutube className="text-red-600 hover:opacity-80 cursor-pointer" size={20} />
                <FaTiktok className="text-white hover:opacity-80 cursor-pointer" size={20} />
         </div>
        </div>
      </footer>
    );
  }
  