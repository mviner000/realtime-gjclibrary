"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useGlobalStore } from "@/stores/globalStore";
import Cookie from "js-cookie";

const CORRECT_PINCODE = "123456";
const COOKIE_EXPIRATION = 30 / (24 * 60); // 30 = Minutes

type Props = {
  setIsLocked: (bool: boolean) => void;
};

const PincodeModal = ({ setIsLocked }: Props) => {
  const setIsPinModalOpen = useGlobalStore((state) => state.setIsPinModalOpen);
  const isPinModalOpen = useGlobalStore((state) => state.isPinModalOpen);
  const [inputVal, setInputVal] = useState("");
  const [isError, setIsError] = useState(false);

  const [open, setOpen] = useState(isPinModalOpen);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);

    if (CORRECT_PINCODE === inputVal) {
      setIsLocked(false);
      setIsPinModalOpen(false);
      Cookie.set("unlocked-pin-timer", new Date().toISOString(), {
        expires: COOKIE_EXPIRATION,
      });
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    setIsError(false);
  }, []);

  useEffect(() => {
    setOpen(isPinModalOpen);
  }, [isPinModalOpen]);

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setIsPinModalOpen(e);
        setOpen(e);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg shadow shadow-customGold"
        >
          <LockKeyhole className="size-5 text-customGreen" />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-1 w-fit">
        <DialogHeader>
          <DialogTitle>Pin Code</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-base">
          Enter the 6-digit code sent to unlock the navbar
        </DialogDescription>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center mt-4"
        >
          <InputOTP
            autoFocus
            maxLength={6}
            value={inputVal}
            onChange={(value) => setInputVal(value)}
            minLength={6}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="size-14 text-lg font-medium" />
              <InputOTPSlot index={1} className="size-14 text-lg font-medium" />
              <InputOTPSlot index={2} className="size-14 text-lg font-medium" />
              <InputOTPSlot index={3} className="size-14 text-lg font-medium" />
              <InputOTPSlot index={4} className="size-14 text-lg font-medium" />
              <InputOTPSlot index={5} className="size-14 text-lg font-medium" />
            </InputOTPGroup>
          </InputOTP>

          {isError && (
            <p className="text-red-500 text-sm font-medium -my-2">
              Incorrect Pin code
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-customGreen hover:bg-customGreen/90"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PincodeModal;
