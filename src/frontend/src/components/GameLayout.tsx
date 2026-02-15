import { ReactNode } from 'react';

interface GameLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
}

export default function GameLayout({ children, backgroundImage }: GameLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
