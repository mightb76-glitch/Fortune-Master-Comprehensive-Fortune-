import React from 'react';

interface TarotCardProps {
  name: string;
  isFlipped: boolean;
  onClick: () => void;
  isSelectable?: boolean;
  imageSrc?: string;
  isChosen?: boolean;
}

// Add CSS to head for backface-visibility, ensures smooth 3D flip effect
const style = document.createElement('style');
style.textContent = `
  .backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
`;
document.head.append(style);

export default function TarotCard({ name, isFlipped, onClick, isSelectable = true, imageSrc, isChosen = false }: TarotCardProps): React.JSX.Element {
  
  const cardBack = (
    <div className="absolute w-full h-full bg-gradient-to-br from-indigo-800 to-purple-900 rounded-lg flex items-center justify-center p-4 backface-hidden shadow-xl">
      <div className="w-20 h-20 border-2 border-yellow-400/50 rounded-full flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-yellow-400/50 rounded-full flex items-center justify-center">
           <div className="w-6 h-6 border-2 border-yellow-400/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  const cardFront = (
    <div className={`absolute w-full h-full bg-gray-800 border-2 border-yellow-500 rounded-lg flex flex-col items-center justify-center backface-hidden [transform:rotateY(180deg)] shadow-2xl overflow-hidden ${isChosen ? 'chosen-card-glow' : ''}`}>
      {imageSrc ? (
        <div className="relative w-full h-full">
          <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-yellow-300 text-center truncate">{name}</h3>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <h3 className="text-xl font-bold text-yellow-300 text-center">{name}</h3>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="group w-40 h-64 [perspective:1000px]"
      onClick={isSelectable && !isFlipped ? onClick : undefined}
      aria-label={isFlipped ? `선택된 카드: ${name}` : `타로 카드 선택하기`}
    >
      <div 
        className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''} ${isSelectable && !isFlipped ? 'cursor-pointer hover:scale-105' : ''}`}
      >
        {cardBack}
        {cardFront}
      </div>
    </div>
  );
}