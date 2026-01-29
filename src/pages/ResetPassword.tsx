import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authResetPassword } from "../services/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailForHint = localStorage.getItem("resetEmail") || "";

  // Ẩn scrollbar của body khi ở trang reset password
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      
      const email = localStorage.getItem("resetEmail");
      const otp = localStorage.getItem("resetOtp");
      if (!email || !otp) {
        throw new Error("Thiếu thông tin xác thực, vui lòng thử lại");
      }

      await authResetPassword({
        email,
        otp,
        newPassword: formData.newPassword,
      });

      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      
      // Chuyển về trang login
      navigate("/login");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Có lỗi xảy ra, vui lòng thử lại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      {/* FORM - Full width */}
      <div className="reset-password-page__form-container">
        <div className="reset-password-page__form-wrapper">
          {/* TITLE */}
          <h1 className="reset-password-page__title">
            THAY ĐỔI MẬT KHẨU
          </h1>
          <p className="reset-password-page__subtitle">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
          </p>
          {emailForHint && (
            <p className="reset-password-page__hint">Email: {emailForHint}</p>
          )}

          {/* ERROR */}
          {error && (
            <div className="form__error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="reset-password-page__form">
            {/* NEW PASSWORD */}
            <div className="reset-password-page__field">
              <label htmlFor="newPassword" className="reset-password-page__label">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
                className="reset-password-page__input"
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="reset-password-page__field">
              <label htmlFor="confirmPassword" className="reset-password-page__label">
                Nhập lại mật khẩu mới
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="reset-password-page__input"
                required
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="reset-password-page__submit-button"
            >
              {loading ? "Đang xử lý..." : "Thay mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
