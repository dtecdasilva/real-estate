'use client';

import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useUser();

  const handleResendVerification = async () => {
    try {
      await user?.emailAddresses[0]?.prepareVerification({ strategy: "email_code" });
      alert("Verification email sent!");
    } catch (err) {
      console.error("Failed to send verification", err);
      alert("Error sending verification email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-10">
      <SignedIn>
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-lg font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-muted-foreground text-sm">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>

            <div className="text-sm">
                <p>
                <strong>Email Verified:</strong>{" "}
                {user?.emailAddresses[0]?.verification?.status === "verified" ? (
                    <span className="text-green-600">Yes</span>
                ) : (
                    <span className="text-red-600">No</span>
                )}
                </p>
                {user?.emailAddresses[0]?.verification?.status !== "verified" && (
                <Button
                    className="mt-4 w-full"
                    onClick={handleResendVerification}
                >
                    Resend Verification Email
                </Button>
                )}
            </div>
          </CardContent>
        </Card>
      </SignedIn>

      <SignedOut>
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">Please sign in to view your profile.</p>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
