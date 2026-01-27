import '../../styles/components/_loading.scss';

export default function LessonCardSkeleton() {
  return (
    <div className="loading-skeleton__card">
      <div className="loading-skeleton__image" />
      <div className="loading-skeleton__content">
        <div className="loading-skeleton__title" />
        <div className="loading-skeleton__meta">
          <div className="loading-skeleton__meta-item" />
          <div className="loading-skeleton__meta-item" />
        </div>
        <div className="loading-skeleton__progress">
          <div className="loading-skeleton__progress-bar" />
        </div>
        <div className="loading-skeleton__button" />
      </div>
    </div>
  );
}
