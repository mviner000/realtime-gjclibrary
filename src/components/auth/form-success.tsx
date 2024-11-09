import {CheckCircledIcon} from "@radix-ui/react-icons";

type FormSuccessProps = {
    message?: string;
    link?: {
        href: string;
      } | null;
}

export const FormSuccess = ({
    message,
    link,
}: FormSuccessProps) => {
    if (!message) return null;
    return (
        <div className="bg-emerald-500/70 text-white-500 text-sm p-3 rounded-md flex items-center gap-x-2 mb-2.5 mt-1">
            <CheckCircledIcon className="h-4 w-4" />
            {link ? (
                <a href={link.href}>
                    <p>{message}</p>
                </a>
            ) : (
                <p>{message}</p>
            )}
        </div>
    )
}