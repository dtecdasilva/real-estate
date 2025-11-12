'use client';

import Link from 'next/link';
import ContactSection from '../ContactSection';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function BeAnAgent() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
            Become an Agent
          </h1>
          <p className="text-gray-600 text-lg">
            Join our trusted network of agents and start listing properties in minutes.
          </p>
        </div>

        {/* Steps Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-10">
          {/* Step 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              1. Sign Up or Log In
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Create an account or log in to start listing properties.&nbsp;
              <SignedIn>
                <Link
                  href="/dashboard/profile"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Go to your profile
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-blue-600 font-medium hover:underline">
                    Sign up here
                  </button>
                </SignInButton>
              </SignedOut>
              .
            </p>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              2. Wait for Verification
            </h2>
            <p className="text-gray-600 leading-relaxed">
              After creating an account, go to your dashboard and click on <b>Profile</b>. Upload the required documents and our team will verify your details within 24–48 hours.
              <br/> 
            </p>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              3. Add a Listing
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Once verified, you can start adding property listings, upload photos, and manage your listings directly from your dashboard.
            </p>
            {/* SmartCue Video Tutorial under Step 2 */}
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border">
              <iframe
                src="https://embed.getsmartcue.com/IL0NV990"
                title="How to get verified as an agent"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </section>

          {/* Video Tutorial */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎥 Video: How to Log In and Add Your First Listing
            </h2>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border">
              <iframe
                src="https://embed.getsmartcue.com/IRAETJPA"
                title="How to sign up and log in"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </section>
        </div>

        {/* Contact Section */}
        <div className="mt-16">
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
