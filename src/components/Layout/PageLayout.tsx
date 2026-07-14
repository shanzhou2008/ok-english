import type { ReactNode } from 'react';
import TabBar from './TabBar';

interface PageLayoutProps {
  children: ReactNode;
  showTabBar?: boolean;
  title?: string;
}

export default function PageLayout({ children, showTabBar = true, title }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F0F4FF] relative">
      {/* Decorative dot pattern at top */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, #7C5CFC 1px, transparent 1px), radial-gradient(circle, #FF6B9D 1px, transparent 1px)',
          backgroundSize: '24px 24px, 24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* Title bar */}
      {title && (
        <header className="sticky top-0 z-40 bg-[#F0F4FF]/90 backdrop-blur-sm px-4 py-3">
          <h1 className="text-lg font-bold text-center" style={{ color: '#1A1A2E' }}>
            {title}
          </h1>
        </header>
      )}

      {/* Content */}
      <main className={`relative z-10 ${showTabBar ? 'pb-20' : ''}`}>{children}</main>

      {/* Tab bar */}
      {showTabBar && <TabBar />}
    </div>
  );
}
