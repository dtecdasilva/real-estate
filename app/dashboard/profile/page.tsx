'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentSidebar from "@/components/ui/agent-sidebar";
import UploadForm from "@/components/ui/UploadForm";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { user } = useUser();
  const isEmailVerified = user?.emailAddresses[0]?.verification?.status === "verified";

  const [profileImage, setProfileImage] = useState(''); // For profile photo
  const [idDocument, setIdDocument] = useState(''); // For ID card

  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [visitFee, setVisitFee] = useState('');
  const [commissionFee, setCommissionFee] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setFullName(`${user.firstName || ""} ${user.lastName || ""}`);

      const docRef = doc(db, "users", user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setWhatsapp(data.whatsapp || "");
        setVisitFee(data.visitFee || "");
        setCommissionFee(data.commissionFee || "");
        setVerified(data.verified || false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    if (!profileImage) {
      alert("Please upload a profile image before saving.");
      return;
    }

    if (!idDocument) {
      alert("Please upload a profile image before saving.");
      return;
    }  
  
    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ");

    try {
      await setDoc(doc(db, "users", user.id), {
        firstName,
        lastName,
        email: user.emailAddresses[0]?.emailAddress,
        whatsapp,
        visitFee,
        role: 'agent',
        commissionFee,
        profileImage,
        idDocument,
        verified,
        submittedAt: new Date(),
      });

      alert("Details saved successfully!");
    } catch (err) {
      console.error("Error saving to Firebase:", err);
      alert("Failed to save user data.");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <AgentSidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Profile Verification</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
              <p>
                <strong>Verified?:</strong>{" "}
                <span className={verified ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {verified ? "Yes" : "No"}
                </span>
              </p>
              {!isEmailVerified && (
                <Button
                  onClick={() =>
                    user?.emailAddresses[0]?.prepareVerification({ strategy: "email_code" })
                  }
                >
                  Resend Verification Email
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {verified ? "Edit Profile Details" : "Submit for Verification"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Editable fields (for both verified and unverified users) */}
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">WhatsApp Number</label>
                <Input
                  type="number"
                  placeholder="e.g. 6xx xxx xxx"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Visit Fee (FCFA)</label>
                <Input
                  type="number"
                  placeholder="e.g. 2000"
                  value={visitFee}
                  onChange={(e) => setVisitFee(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Commission Fee (%)</label>
                <Input
                  type="number"
                  placeholder="e.g. 10"
                  value={commissionFee}
                  onChange={(e) => setCommissionFee(e.target.value)}
                />
              </div>

              {/* Only show upload section if not verified */}
              {!verified && (
                <>
                  <div>
                    <label className="text-sm font-medium">Upload Your Photo</label>
                    <UploadForm
                        onUpload={(urls: string[]) => {
                          if (urls.length > 0) setProfileImage(urls[0]); // take the first uploaded image
                        }}
                      />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Upload ID Card Document</label>
                    <UploadForm
                        onUpload={(urls: string[]) => {
                          if (urls.length > 0) setIdDocument(urls[0]); // take the first uploaded image
                        }}
                      />
                  </div>
                </>
              )}

              <Button onClick={handleSave} className="w-full">
                {verified ? "Save Changes" : "Submit for Verification"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
