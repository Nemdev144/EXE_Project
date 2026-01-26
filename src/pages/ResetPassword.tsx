import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      
      // Fake API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Xóa resetEmailOrPhone sau khi đổi mật khẩu thành công
      localStorage.removeItem("resetEmailOrPhone");
      
      // Chuyển về trang login
      navigate("/login");
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
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
            Vui lòng nhập mật khẩu mới
          </p>

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
