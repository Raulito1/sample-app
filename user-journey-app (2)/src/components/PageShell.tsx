import React, { ReactNode } from 'react';
import cubes from '../assets/textures/cubes.png';

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
  const textureStyle = withTexture
    ? { backgroundImage: `url(${cubes})`, backgroundAttachment: 'fixed' }
    : undefined;

  return (
    <div className={`${baseClasses} ${className}`} style={textureStyle}>
      {children}
    </div>
  );
};

export default PageShell;
