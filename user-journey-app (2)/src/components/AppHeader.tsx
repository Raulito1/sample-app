import React, { ReactNode } from "react";

interface AppHeaderProps {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  onBack?: () => void;
  rightContent?: ReactNode;
  actionButton?: ReactNode;
  stickyOffsetClass?: string;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  icon,
  // onBack intentionally unused; navigation handled via NavBar
  rightContent,
  actionButton,
  stickyOffsetClass = "top-0",
  className = "",
}) => {
  const hasRightSection = rightContent || actionButton;

  return (
    <header
      className={`sticky ${stickyOffsetClass} z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-4">
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
