import React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, setIsOpen } as any);
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger: React.FC<
  DropdownMenuTriggerProps & {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
  }
> = ({ children, asChild = false, isOpen, setIsOpen }) => {
  const handleClick = () => {
    setIsOpen?.(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
};

export const DropdownMenuContent: React.FC<
  DropdownMenuContentProps & {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
  }
> = ({ children, align = "start", className = "", isOpen, setIsOpen }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const alignClass = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  }[align];

  return (
    <div
      ref={ref}
      className={`absolute top-full mt-1 ${alignClass} min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 ${className}`}
    >
      <div className="py-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { setIsOpen } as any);
          }
          return child;
        })}
      </div>
    </div>
  );
};

export const DropdownMenuItem: React.FC<
  DropdownMenuItemProps & { setIsOpen?: (open: boolean) => void }
> = ({ children, onClick, className = "", setIsOpen }) => {
  const handleClick = () => {
    onClick?.();
    setIsOpen?.(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors ${className}`}
      type="button"
    >
      {children}
    </button>
  );
};

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className = "",
}) => {
  return <hr className={`border-gray-200 dark:border-gray-600 ${className}`} />;
};
