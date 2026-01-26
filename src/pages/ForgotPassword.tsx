import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
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
    setEmailOrPhone(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailOrPhone.trim()) {
      setError("Vui lòng nhập email hoặc số điện thoại");
      return;
    }

    try {
      setLoading(true);
      
      // Fake API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Lưu email/phone để dùng ở bước tiếp theo
      localStorage.setItem("resetEmailOrPhone", emailOrPhone);
      
      // Chuyển sang trang nhập mã xác thực
      navigate("/verify-code");
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
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
            Làm ơn nhập email hoặc số điện thoại và chúng tôi sẽ gửi bạn hướng dẫn đặt lại mật khẩu mới.
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
              <label htmlFor="emailOrPhone" className="forgot-password-page__label">
                Email hoặc số điện thoại
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                placeholder="email@gmail.com | 0123 456 789"
                value={emailOrPhone}
                onChange={handleChange}
                disabled={loading}
                className="forgot-password-page__input"
              />
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
