import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import '../../styles/components/learn/_quiz-sidebar.scss';

interface QuizSidebarProps {
  timeLeft: number; // in seconds
  totalQuestions: number;
  answeredCount: number;
  onSubmit: () => void;
  backUrl: string;
  canSubmit?: boolean;
}

export default function QuizSidebar({
  timeLeft,
  totalQuestions,
  answeredCount,
  onSubmit,
  backUrl,
  canSubmit = false,
}: QuizSidebarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quiz-sidebar">
      {/* Timer */}
      <div className="quiz-sidebar__timer-card">
        <Clock size={64} className="quiz-sidebar__timer-icon" />
        <div className="quiz-sidebar__timer-text">{formatTime(timeLeft)}</div>
        <div className="quiz-sidebar__timer-label">Thời gian làm bài còn lại</div>
        <div className="quiz-sidebar__progress-dots">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <div
              key={index}
              className={`quiz-sidebar__progress-dot ${
                index < answeredCount
                  ? 'quiz-sidebar__progress-dot--answered'
                  : index === answeredCount
                  ? 'quiz-sidebar__progress-dot--current'
                  : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="quiz-sidebar__notes">
        <strong>Lưu ý</strong>
        <p>Không quay lại sau khi nộp</p>
        <p>Mỗi câu chỉ 1 đáp án</p>
      </div>

      {/* Actions */}
      <div className="quiz-sidebar__actions">
        <button
          className="quiz-sidebar__submit-btn"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          Nộp bài
        </button>
        <Link to={backUrl} className="quiz-sidebar__back-btn">
          Quay về bài học
        </Link>
      </div>
    </div>
  );
}
