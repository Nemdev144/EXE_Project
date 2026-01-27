import { useNavigate, Link } from 'react-router-dom';
import '../../styles/components/learn/_quiz-result-summary.scss';

interface QuizResultSummaryProps {
  score: number; // percentage
  timeSpent: number; // in seconds
  correctCount: number;
  totalCount: number;
  retakeUrl: string;
  backUrl: string;
}

export default function QuizResultSummary({
  score,
  timeSpent,
  correctCount,
  totalCount,
  retakeUrl,
  backUrl,
}: QuizResultSummaryProps) {
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs.toString().padStart(2, '0')} giây`;
  };

  return (
    <div className="quiz-result-summary">
      <h3 className="quiz-result-summary__title">Tổng kết nhanh</h3>
      
      <div className="quiz-result-summary__metrics">
        <div className="quiz-result-summary__metric">
          <span className="quiz-result-summary__metric-label">Điểm số</span>
          <span className="quiz-result-summary__metric-value">{score}%</span>
        </div>
        <div className="quiz-result-summary__metric">
          <span className="quiz-result-summary__metric-label">Thời gian</span>
          <span className="quiz-result-summary__metric-value">{formatTime(timeSpent)}</span>
        </div>
        <div className="quiz-result-summary__metric">
          <span className="quiz-result-summary__metric-label">Số câu đúng</span>
          <span className="quiz-result-summary__metric-value">{correctCount}/{totalCount}</span>
        </div>
      </div>

      <div className="quiz-result-summary__progress-section">
        <div className="quiz-result-summary__progress-label">Am hiểu cồng chiêng</div>
        <div className="quiz-result-summary__progress-bar">
          <div
            className="quiz-result-summary__progress-fill"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="quiz-result-summary__actions">
        <button
          className="quiz-result-summary__retake-btn"
          onClick={() => navigate(retakeUrl)}
        >
          Làm lại Quiz
        </button>
        <Link to={backUrl} className="quiz-result-summary__back-btn">
          Quay về bài học
        </Link>
      </div>
    </div>
  );
}
