"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "./ui/use-toast";
import Encrypter from "@/utils/encrypt";

export default function ChangePassword() {
  const { toast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [encryptedText, setEncryptedText] = useState("");

  const validateNoSpaces = (value: string) => !/\s/.test(value);
  const validatePasswordLength = (value: string) => value.length >= 8;

  const handleEncrypt = () => {
    if (!validateNoSpaces(oldPassword) || !validateNoSpaces(newPassword) || !validateNoSpaces(repeatPassword)) {
      setError("Spaces are not allowed in passwords.");
      return;
    }

    if (!validatePasswordLength(newPassword)) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== repeatPassword) {
      setError("New passwords do not match.");
      return;
    }

    setError("");

    const encrypter = new Encrypter();
    const encryptedOldPassword = encrypter.encrypt(oldPassword);
    const encryptedNewPassword = encrypter.encrypt(newPassword);
    const encryptedRepeatPassword = encrypter.encrypt(repeatPassword);
    setEncryptedText(
      `Old Password: ${encryptedOldPassword}\nNew Password: ${encryptedNewPassword}\nRepeat New Password: ${encryptedRepeatPassword}`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!oldPassword || !newPassword || !repeatPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (!validateNoSpaces(oldPassword) || !validateNoSpaces(newPassword) || !validateNoSpaces(repeatPassword)) {
      setError("Password cannot contain spaces");
      setIsLoading(false);
      return;
    }

    if (newPassword !== repeatPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!validatePasswordLength(oldPassword) || !validatePasswordLength(newPassword)) {
      setError("Old password and new password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }  

    try {
      const encrypter = new Encrypter();
      const encryptedOldPassword = encrypter.encrypt(oldPassword);
      const encryptedNewPassword = encrypter.encrypt(newPassword);
      const encryptedRepeatPassword = encrypter.encrypt(repeatPassword);

      const jsonData = JSON.stringify({
        old_password: encryptedOldPassword,
        new_password: encryptedNewPassword,
        confirm_new_password: encryptedRepeatPassword,
      });

      const response = await fetch(`/api/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData?.error || "Something went wrong. Please try again.");
      } else {
        setOldPassword("");
        setNewPassword("");
        setRepeatPassword("");
        setEncryptedText("");
        toast({
          title: "Password Updated",
          description: "Your password has been changed successfully.",
        });
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-10">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="old-password">Current Password</Label>
            <Input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter your current password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repeat-password">Repeat New Password</Label>
            <Input
              id="repeat-password"
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="Repeat your new password"
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-customGreen2 hover:bg-customGreen2/90"
          >
            Change Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
