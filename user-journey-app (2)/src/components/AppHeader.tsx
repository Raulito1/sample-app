import { ChevronLeft } from "lucide-react";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  onBack?: () => void;
  showBackButton?: boolean;
  rightContent?: ReactNode;
  actionButton?: ReactNode;
  stickyOffsetClass?: string;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  icon,
  onBack,
  showBackButton = false,
  rightContent,
  actionButton,
  stickyOffsetClass = "",
  className = "",
}) => {
  const navigate = useNavigate();
  const hasRightSection = rightContent || actionButton;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={`${stickyOffsetClass} z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {hasRightSection && (
        <div className="flex items-center gap-4">
          {rightContent}
          {actionButton}
        </div>
      )}
    </header>
  );
};

export default AppHeader;
