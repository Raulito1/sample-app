import React, { ReactNode } from 'react';
import AppHeader from './AppHeader';
import NavBar from './NavBar';
import PageShell from './PageShell';

interface FeatureLayoutProps {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  rightContent?: ReactNode;
  children: ReactNode;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  withTexture?: boolean;
  contentClassName?: string;
}

const FeatureLayout: React.FC<FeatureLayoutProps> = ({
  title,
  subtitle,
  icon,
  rightContent,
  children,
  isDarkMode,
  toggleTheme,
  withTexture = true,
  contentClassName = '',
}) => (
  <PageShell
    withTexture={withTexture}
    className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200"
  >
    <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    <AppHeader
      title={title}
      subtitle={subtitle}
      icon={icon}
      rightContent={rightContent}
      stickyOffsetClass="top-16"
    />

    <div className={contentClassName}>{children}</div>
  </PageShell>
);

export default FeatureLayout;
