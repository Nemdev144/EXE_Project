import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authGoogleLogin, authRegister } from "../services/authApi";
import { message } from "antd";
import { getGoogleIdToken } from "../utils/googleAuth";
import { persistAuthSession } from "../utils/authSession";

const GOOGLE_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  "87846938671-76pcjrb3ucf7ngmkai7b2qni7uvrn9qt.apps.googleusercontent.com";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const registerPayload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      await authRegister(registerPayload);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Đăng ký thất bại, vui lòng thử lại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    try {
      setLoading(true);
      const idToken = await getGoogleIdToken(GOOGLE_CLIENT_ID);
      const response = await authGoogleLogin({ idToken });
      persistAuthSession(response);
      message.success("Đăng ký với Google thành công!");
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Đăng ký Google thất bại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Ẩn scrollbar của body khi ở trang register
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="register-page">
      {/* LEFT FORM - 40% width */}
      <div className="register-page__form-container">
        <div className="register-page__form-wrapper">
          {/* TITLE */}
          <h1 className="register-page__title">
            Đăng Ký
          </h1>
          <p className="register-page__subtitle">
            Tạo tài khoản chỉ với tên đăng nhập, email và mật khẩu.
          </p>

          {error && <div className="form__error">{error}</div>}
          <form onSubmit={handleSubmit} className="register-page__form">
            {/* Tên đăng nhập */}
            <div className="register-page__field">
              <label
                htmlFor="username"
                className="register-page__label"
              >
                Tên đăng nhập <span className="register-page__required">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Tên đăng nhập"
                required
              />
            </div>

            {/* Email */}
            <div className="register-page__field">
              <label
                htmlFor="email"
                className="register-page__label"
              >
                Email <span className="register-page__required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Email"
                required
              />
            </div>

            {/* Mật khẩu */}
            <div className="register-page__field">
              <label
                htmlFor="password"
                className="register-page__label"
              >
                Mật khẩu <span className="register-page__required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Mật khẩu"
                required
              />
            </div>

            {/* Xác thực mật khẩu */}
            <div className="register-page__field">
              <label
                htmlFor="confirmPassword"
                className="register-page__label"
              >
                Xác thực mật khẩu <span className="register-page__required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="register-page__input"
                placeholder="Xác thực mật khẩu"
                required
              />
            </div>

            {/* Nút Đăng ký */}
            <button
              type="submit"
              className="register-page__submit-button"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            <div className="register-page__divider">
              <span>Hoặc</span>
            </div>

            <button
              type="button"
              disabled={loading}
              className="register-page__google-button"
              onClick={handleGoogleRegister}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Đăng ký với Google</span>
            </button>

            {/* Link đăng nhập */}
            <p className="register-page__login-link">
              Bạn đã có tài khoản?{" "}
              <Link to="/login">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT IMAGE - 60% width - Large image container */}
      <div className="register-page__image-container">
        <img
          src="/picture1.png"
          alt="Vietnam Culture"
          className="register-page__image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error("Failed to load image:", target.src);
          }}
        />
      </div>
    </div>
  );
};

export default Register;
