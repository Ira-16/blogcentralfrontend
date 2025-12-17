import { Loader2 } from "lucide-react";

export default function Loader({ size = "default", text = "Loading..." }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600`} />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  );
}
