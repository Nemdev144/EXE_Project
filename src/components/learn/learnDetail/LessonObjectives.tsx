import { useState } from 'react';
import { Pin, RefreshCw } from 'lucide-react';
import '../../../styles/components/learnDetail/_lesson-objectives.scss';

interface LessonObjectivesProps {
  objectives: string[];
}

export default function LessonObjectives({ objectives }: LessonObjectivesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const progress = ((currentIndex + 1) / objectives.length) * 100;

  return (
    <div
      className={`lesson-objectives ${
        isPinned ? 'lesson-objectives--pinned' : ''
      }`}
    >
      <div className="lesson-objectives__header">
        <h2 className="lesson-objectives__title">Mục tiêu bài học</h2>
        <div className="lesson-objectives__controls">
          <button
            className={`lesson-objectives__control-btn ${
              isPinned ? 'lesson-objectives__control-btn--active' : ''
            }`}
            onClick={() => setIsPinned(!isPinned)}
            aria-label={isPinned ? 'Bỏ cố định' : 'Cố định'}
          >
            <Pin size={16} />
          </button>
          <button
            className="lesson-objectives__control-btn"
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % objectives.length)
            }
            aria-label="Làm mới"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      <div className="lesson-objectives__content">
        <p className="lesson-objectives__text">{objectives[currentIndex]}</p>
        <div className="lesson-objectives__progress">
          <span className="lesson-objectives__progress-text">
            {currentIndex + 1}/{objectives.length}
          </span>
          <div className="lesson-objectives__progress-bar">
            <div
              className="lesson-objectives__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
