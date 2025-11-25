import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  onBack?: () => void;
  rightContent?: ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  icon,
  onBack,
  rightContent,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
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
      {rightContent && <div className="flex items-center gap-4">{rightContent}</div>}
    </header>
  );
};

export default AppHeader;

