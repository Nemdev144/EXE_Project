import '../../styles/components/learn/_lesson-hero.scss';

interface LessonHeroProps {
  imageUrl: string;
  alt: string;
}

export default function LessonHero({ imageUrl, alt }: LessonHeroProps) {
  return (
    <div className="lesson-hero">
      <img src={imageUrl} alt={alt} className="lesson-hero__image" />
    </div>
  );
}
