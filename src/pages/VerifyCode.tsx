import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authForgotPassword, authVerifyOtp } from "../services/authApi";

const VerifyCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const emailForHint = localStorage.getItem("resetEmail") || "";

  // Ẩn scrollbar của body khi ở trang verify code
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Countdown cho resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Chỉ cho phép số, tối đa 6 ký tự
    setCode(value);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số mã xác thực");
      return;
    }

    try {
      setLoading(true);
      
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        throw new Error("Thiếu thông tin xác thực, vui lòng thử lại");
      }
      await authVerifyOtp({ email, otp: code });
      localStorage.setItem("resetOtp", code);
      navigate("/reset-password");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Mã xác thực không đúng, vui lòng thử lại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    try {
      setResendCooldown(60); // 60 giây cooldown
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        throw new Error("Thiếu thông tin, vui lòng quay lại bước trước");
      }
      await authForgotPassword({ email });
      // Có thể hiển thị thông báo thành công ở đây
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Không thể gửi lại mã, vui lòng thử lại sau";
      setError(errorMessage);
    }
  };

  return (
    <div className="verify-code-page">
      {/* FORM - Full width */}
      <div className="verify-code-page__form-container">
        <div className="verify-code-page__form-wrapper">
          {/* TITLE */}
          <h1 className="verify-code-page__title">
            Mã Xác Nhận
          </h1>
          <p className="verify-code-page__subtitle">
            Vui lòng nhập mã xác minh đã được gửi đến email của bạn.
          </p>
          {emailForHint && (
            <p className="verify-code-page__hint">Đang xác thực cho: {emailForHint}</p>
          )}

          {/* ERROR */}
          {error && (
            <div className="form__error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="verify-code-page__form">
            {/* CODE INPUT */}
            <div className="verify-code-page__field">
              <input
                type="text"
                id="code"
                name="code"
                placeholder="Mã xác thực của bạn"
                value={code}
                onChange={handleChange}
                disabled={loading}
                className="verify-code-page__input verify-code-page__input--code"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="verify-code-page__submit-button"
            >
              {loading ? "Đang xác thực..." : "Xác thực"}
            </button>

            {/* RESEND LINK */}
            <p className="verify-code-page__resend-link">
              Bạn chưa nhận được mã xác thực?{" "}
              {resendCooldown > 0 ? (
                <span className="verify-code-page__cooldown">
                  Gửi lại sau {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="verify-code-page__resend-button"
                >
                  Gửi lại
                </button>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
