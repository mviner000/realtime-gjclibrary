import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google"

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface HeaderProps {
    label: string;
    textColor?: string;
}

export const Header = ({
    label,
    textColor
}: HeaderProps) => {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <h1 className={cn("text-2xl font-semibold",
                font.className,
            )}>
            </h1>
            <p className={cn("text-muted-foreground text-sm", textColor)}>
                {label}
            </p>
        </div>
    )
}

export default Header

