import '../styles/components/_loading.scss';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message = 'Đang tải...', size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="loading-spinner__container">
        <div className="loading-spinner__spinner">
          <div className="loading-spinner__ring"></div>
          <div className="loading-spinner__ring"></div>
          <div className="loading-spinner__ring"></div>
        </div>
        <p className="loading-spinner__message">{message}</p>
      </div>
    </div>
  );
}
