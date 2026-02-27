import '../../../styles/components/learnDetail/_lesson-hero.scss';

interface LessonHeroProps {
  imageUrl: string;
  alt: string;
}

export default function LessonHero({ imageUrl, alt }: LessonHeroProps) {
  return (
    <div className="lesson-hero">
      <img 
        src={imageUrl || '/nen.png'} 
        alt={alt} 
        className="lesson-hero__image"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/nen.png';
        }}
      />
    </div>
  );
}
