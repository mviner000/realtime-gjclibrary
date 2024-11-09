// components/ui/Toast.tsx
"use client";

import React from "react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@radix-ui/react-toast";

interface ToastComponentProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void; // Function to handle open state
}

const ToastComponent: React.FC<ToastComponentProps> = ({
  title,
  description,
  open,
  onOpenChange,
}) => {
  return (
    <ToastProvider>
      <Toast open={open} onOpenChange={onOpenChange}>
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{description}</ToastDescription>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export default ToastComponent;
