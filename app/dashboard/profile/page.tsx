'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentSidebar from "@/components/ui/agent-sidebar";
import UploadForm from "@/app/upload-form/page";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedImageUrl2, setUploadedImageUrl2] = useState('');
  const [fullName, setFullName] = useState('');

  const isVerified = user?.emailAddresses[0]?.verification?.status === "verified";

  useEffect(() => {
    if (user) {
      setFullName(`${user.firstName || ""} ${user.lastName || ""}`);
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "id") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        type === "profile" ? setProfileImage(reader.result as string) : setIdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSubmit = async () => {
    if (!user) return;
    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ");

    try {
      await setDoc(doc(db, "users", user.id), {
        firstName,
        lastName,
        email: user.emailAddresses[0]?.emailAddress,
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
              <p><strong>Email Verified:</strong>{" "}
                <span className={isVerified ? "text-green-600" : "text-red-600"}>
                  {isVerified ? "Yes" : "No"}
                </span>
              </p>
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

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload for Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Upload Profile Photo</label>
                <UploadForm onUpload={(url) => setUploadedImageUrl(url)} />
              </div>

              <div>
                <label className="text-sm font-medium">Upload ID Document</label>
                <UploadForm onUpload={(url) => setUploadedImageUrl2(url)} />
              </div>

              <Button onClick={handleNameSubmit} className="w-full">Submit for Verification</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
