"use client";


import { ToastAction } from "@/components/ui/toast"

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const Social = () => {
  const { toast } = useToast()
  return (
    <div className="w-full flex items-center gap-x-2">
      <Button
        onClick={() => {
          toast({
            variant: "emerald",
            title: "Google Sign in is in beta mode",
            description: "Try again another time, thanks",
            action: (
              <ToastAction altText="Google button disabled for now">Ok</ToastAction>
            ),
          })
        }}
        size="lg"
        className="border border-teal-500 w-full bg-gradient-to-r from-yellow-300 via-emerald-900 
        to-emerald-500 hover:bg-gradient-to-r hover:from-cyan-500  hover:to-emerald-500 text-white outline-2 shadow-md outline-black"
        variant="outline"
        // onClick={() => handleClick("google")}
      >

        
        <svg fill="none" height="25" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
          <path d="m21.8055 10.0415h-.8055v-.0415h-9v4h5.6515c-.8245 2.3285-3.04 4-5.6515 4-3.3135 0-6-2.6865-6-6s2.6865-6 6-6c1.5295 0 2.921.577 3.9805 1.5195l2.8285-2.8285c-1.786-1.6645-4.175-2.691-6.809-2.691-5.5225 0-10 4.4775-10 10s4.4775 10 10 10 10-4.4775 10-10c0-.6705-.069-1.325-.1945-1.9585z"
            fill="#000000" />
          <path d="m3.15295 7.3455 3.2855 2.4095c.889-2.201 3.042-3.755 5.56155-3.755 1.5295 0 2.921.577 3.9805 1.5195l2.8285-2.8285c-1.786-1.6645-4.175-2.691-6.809-2.691-3.84105 0-7.17205 2.1685-8.84705 5.3455z"
            fill="#000000" /><path d="m12 22c2.583 0 4.93-.9885 6.7045-2.596l-3.095-2.619c-1.004.7605-2.252 1.215-3.6095 1.215-2.60097 0-4.80947-1.6585-5.64147-3.973l-3.261 2.5125c1.655 3.2385 5.016 5.4605 8.90247 5.4605z"
              fill="#000000" />
          <path d="m21.8055 10.0415h-.8055v-.0415h-9v4h5.6515c-.396 1.1185-1.1155 2.083-2.0435 2.7855.0005-.0005.001-.0005.0015-.001l3.095 2.619c-.219.199 3.2955-2.4035 3.2955-7.4035 0-.6705-.069-1.325-.1945-1.9585z"
            fill="#000000" />
        </svg>

        <svg className="ml-[-27px] mt-[-3px]" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="m21.8055 10.0415h-.8055v-.0415h-9v4h5.6515c-.8245 2.3285-3.04 4-5.6515 4-3.3135 0-6-2.6865-6-6s2.6865-6 6-6c1.5295 0 2.921.577 3.9805 1.5195l2.8285-2.8285c-1.786-1.6645-4.175-2.691-6.809-2.691-5.5225 0-10 4.4775-10 10s4.4775 10 10 10 10-4.4775 10-10c0-.6705-.069-1.325-.1945-1.9585z"
            fill="#ffc107" />
          <path d="m3.15295 7.3455 3.2855 2.4095c.889-2.201 3.042-3.755 5.56155-3.755 1.5295 0 2.921.577 3.9805 1.5195l2.8285-2.8285c-1.786-1.6645-4.175-2.691-6.809-2.691-3.84105 0-7.17205 2.1685-8.84705 5.3455z"
            fill="#ff3d00" /><path d="m12 22c2.583 0 4.93-.9885 6.7045-2.596l-3.095-2.619c-1.004.7605-2.252 1.215-3.6095 1.215-2.60097 0-4.80947-1.6585-5.64147-3.973l-3.261 2.5125c1.655 3.2385 5.016 5.4605 8.90247 5.4605z"
              fill="#4caf50" />
          <path d="m21.8055 10.0415h-.8055v-.0415h-9v4h5.6515c-.396 1.1185-1.1155 2.083-2.0435 2.7855.0005-.0005.001-.0005.0015-.001l3.095 2.619c-.219.199 3.2955-2.4035 3.2955-7.4035 0-.6705-.069-1.325-.1945-1.9585z"
            fill="#1976d2" />
        </svg>
      </Button>
      
    </div>
  );
};
