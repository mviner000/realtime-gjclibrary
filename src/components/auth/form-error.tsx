import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type FormErrorProps = {
    message?: string;
}

export const FormError = ({message}: FormErrorProps) => {
    if (!message) return null;
    return (
        <div className="bg-rose-500/20 text-rose-500 text-sm p-3 rounded-md flex items-center gap-x-2 mb-2.5 mt-1">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}