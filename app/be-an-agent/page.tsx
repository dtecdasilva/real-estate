'use client';

import Link from 'next/link';
import ContactSection from '../ContactSection';

export default function BeAnAgent() {
  return (
    <main>
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Become an Agent
      </h1>

      <div className="space-y-8 text-gray-700">
        {/* Step 1 */}
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Sign Up or Log In</h2>
          <p>
            Create an account or log in to start listing properties.   
            <Link
              href="/"
              className="text-blue-600 hover:underline font-medium"
            >
               Sign up here
            </Link>
            .
          </p>
        </section>
        

        {/* Step 2 */}
        <section>
          <h2 className="text-xl font-semibold mb-2">2. Wait for Verification</h2>
          <p>
            After creating an account, go to your dashboard and click on profile. upload the required documents and our team will verify your details.  
          </p>
        </section>
        <img src="scn1.jpg" alt="" />
        <img src="scn2.jpg" alt="" />
        <img src="scn3.jpg" alt="" />

        {/* Step 3 */}
        <section>
          <h2 className="text-xl font-semibold mb-2">3. Add a Listing</h2>
          <p>
            Once verified, you can add property listings.
          </p>
        </section>

        {/* Video Tutorial */}
        <section>
            <h2 className="text-xl font-semibold mb-4">
                Video: How to Log In and Add Your First Listing Property
            </h2>
            <div className="w-full rounded-lg overflow-hidden shadow" style={{ height: "600px" }}>
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
    </div>
    <ContactSection />
    </main>
  );
}
