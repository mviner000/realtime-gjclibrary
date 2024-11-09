"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RetrievePicture from "../auth/picture/retrieve-picture";
import UploadPicture from "../auth/picture/upload-picture";
import ChangePassword2 from "../ChangePassword2";
import QRCodeComponent, { QRCodeComponentRef } from "../auth/qr-code";
import { CurrentUser } from "@/utils/getCurrentUser";
import { saveAs } from 'file-saver';
import { useRef } from "react";
import Image from "next/image";

export default function SettingsTab({ user }: { user: CurrentUser }) {

  const qrCodeRef = useRef<QRCodeComponentRef>(null);

  const downloadQRCode = () => {
    const qrCode = qrCodeRef.current;
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode.toDataURL();
      link.download = 'qr_code.png';
      link.click();
    }
  };
  return (
    <div className="container mx-auto">
      <Tabs defaultValue="QR Code" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="QR Code">QR Code</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="QR Code">
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>
                <span className="mt-2 gap-1 flex-col flex w-80">
                  <span>Download, or screenshot your code</span>
                  <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                    Please update your password for account protection.
                  </span>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="w-fit">
                {user && (
                  <QRCodeComponent
                    ref={qrCodeRef}
                    value={user.school_id}
                    imageSrc="/images/gendejesusbg.png"
                  />
                )}
              </div>
              {/* di ko mapagana, unable to open downloaded file */}
              <Button
                disabled
                className="mt-4 bg-customGreen2 hover:bg-customGreen2/90"
                onClick={downloadQRCode}
              >
                Download QR Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col-reverse md:flex-row gap-8">
              <div className="flex flex-col  gap-2">
                <RetrievePicture />
                <UploadPicture />
              </div>

              <div className=" flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">School ID #:</p>
                  <p>{user?.school_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Username:</p>
                  <p>{user?.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Email:</p>
                  <p>{user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Role:</p>
                  <p>{user?.is_staff ? "Admin" : "Student"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <ChangePassword2 />
        </TabsContent>
      </Tabs>
    </div>
  );
}
