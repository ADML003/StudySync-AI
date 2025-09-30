import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ children, className = "" }) => {
  return (
    <div
      className={cn(
        "relative inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
        className
      )}
    >
      {children}
    </div>
  );
};

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt = "",
  className = "",
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  if (!src || imageError) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "aspect-square h-full w-full object-cover transition-opacity",
        imageLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageError(true)}
    />
  );
};

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium",
        className
      )}
    >
      {children}
    </div>
  );
};
