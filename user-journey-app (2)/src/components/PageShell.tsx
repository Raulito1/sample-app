import React, { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  withTexture?: boolean;
}

const PageShell: React.FC<PageShellProps> = ({
  children,
  className = '',
  withTexture = false,
}) => {
  const baseClasses =
    'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200';
  const textureClasses = withTexture
    ? " bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
    : '';

  return <div className={`${baseClasses}${textureClasses} ${className}`}>{children}</div>;
};

export default PageShell;

