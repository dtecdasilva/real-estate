'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentSidebar from "@/components/ui/agent-sidebar";
import UploadForm from "@/components/ui/UploadForm";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { user } = useUser();
  const isVerified = user?.emailAddresses[0]?.verification?.status === "verified";
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedImageUrl2, setUploadedImageUrl2] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [visitFee, setVisitFee] = useState('');
  const [commissionFee, setCommissionFee] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(`${user.firstName || ""} ${user.lastName || ""}`);
    }
  }, [user]);

  const handleNameSubmit = async () => {
    if (!user) return;
    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ");

    try {
      await setDoc(doc(db, "users", user.id), {
        firstName,
        lastName,
        email: user.emailAddresses[0]?.emailAddress,
        whatsapp,
        visitFee,
        commissionFee,
        role: 'agent',
        profileImage: uploadedImageUrl || user.imageUrl || "",
        idDocumentImage: uploadedImageUrl2 || "",
        verified: false,
        submittedAt: new Date(),
      });
      alert("User details & images saved to Firebase!");
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
              
              {!isVerified && (
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

          {/* Upload & Details Section */}
          <Card>
            <CardHeader>
            <CardTitle>{isVerified ? "Edit Details" : "Upload for Verification"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  type="tel"
                  placeholder="e.g. +237 6xx xxx xxx"
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

              {!isVerified && (
                <>
                  <div>
                    <label className="text-sm font-medium">Upload your Photo</label>
                    <UploadForm onUpload={(url) => setUploadedImageUrl(url)} /> 
                  </div>

                  <div>
                    <label className="text-sm font-medium">Upload ID Card Document</label>
                    <UploadForm onUpload={(url) => setUploadedImageUrl2(url)} />
                  </div>
                </>
              )}

              <Button onClick={handleNameSubmit} className="w-full">
                {isVerified ? "Save Changes" : "Submit for Verification"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
