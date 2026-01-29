import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authForgotPassword } from "../services/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ẩn scrollbar của body khi ở trang forgot password
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);
      
      await authForgotPassword({ email });
      
      // Lưu email/phone để dùng ở bước tiếp theo
      localStorage.setItem("resetEmail", email);
      
      // Chuyển sang trang nhập mã xác thực
      navigate("/verify-code");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Có lỗi xảy ra, vui lòng thử lại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {/* FORM - Full width */}
      <div className="forgot-password-page__form-container">
        <div className="forgot-password-page__form-wrapper">
          {/* TITLE */}
          <h1 className="forgot-password-page__title">
            Quên Mật khẩu
          </h1>
          <p className="forgot-password-page__subtitle">
            Nhập email đã đăng ký để nhận mã xác thực đặt lại mật khẩu.
          </p>

          {/* ERROR */}
          {error && (
            <div className="form__error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="forgot-password-page__form">
            {/* EMAIL OR PHONE */}
            <div className="forgot-password-page__field">
              <label htmlFor="email" className="forgot-password-page__label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={handleChange}
                disabled={loading}
                className="forgot-password-page__input"
              />
              <p className="forgot-password-page__hint">
                Mã xác thực sẽ được gửi về email này.
              </p>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="forgot-password-page__submit-button"
            >
              {loading ? "Đang gửi..." : "Nhận mã xác thực"}
            </button>

            {/* LOGIN LINK */}
            <p className="forgot-password-page__login-link">
              Bạn đã có tài khoản?{" "}
              <Link to="/login">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
