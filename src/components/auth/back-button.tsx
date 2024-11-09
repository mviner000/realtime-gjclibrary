"use-client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface BackButtonProps {
    href: string;
    label: string;
}

export const BackButton = ({
    href,
    label,
}: BackButtonProps ) => {
    const { toast } = useToast();

    const handleClick = () => {
        toast({
            title: "Come back again",
            variant: "default",
        });
    };

    return (
        <Button
            variant="link"
            className="font-normal w-full"
            size="sm"
            asChild
              onClick={() => {
                toast({
                  variant: "emerald",
                  title: "Please got to Library Staff Admin",
                  description: "and request for your account recovery, thanks",
                  action: (
                    <ToastAction altText="Google button disabled for now">Ok</ToastAction>
                  ),
                })
              }}
        >
            <span className="cursor-pointer">
                {label}
            </span>
        </Button>
    )  
}