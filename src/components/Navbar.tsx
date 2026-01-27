import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Drawer } from "antd";
import "../styles/components/_navbar.scss";

const navLinks = [
  { path: "/", label: "Trang chủ" },
  { path: "/tours", label: "Tours" },
  { path: "/artisans", label: "Góc nghệ nhân" },
  { path: "/learn", label: "Học nhanh" },
  { path: "/about", label: "Về chúng tôi" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    Boolean(localStorage.getItem("accessToken"))
  );

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(Boolean(localStorage.getItem("accessToken")));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Left: Logo */}
        <div className="navbar__logo">
          <Link to="/" className="navbar__logo-link">
            <img
              src="/logo.png"
              alt="Cội Việt"
              className="navbar__logo-image"
            />
          </Link>
          <span className="navbar__logo-text brand-name">Cội Việt</span>
        </div>

        {/* Center: Navigation Menu */}
        <div className="navbar__menu">
          <div className="navbar__menu-container">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__menu-link ${
                  isActive(link.path) ? "navbar__menu-link--active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Auth Buttons */}
        <div className="navbar__auth">
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="navbar__auth-button navbar__auth-button--profile"
              aria-label="Tài khoản"
            >
              <User size={20} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar__auth-button navbar__auth-button--login"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="navbar__auth-button navbar__auth-button--register"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Hamburger */}
        <div className="navbar__mobile-toggle">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="navbar__mobile-toggle-button"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Drawer) */}
      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        placement="right"
        size={280}
        className="navbar__drawer-antd"
        styles={{
          body: { padding: 0 }
        }}
      >
        <div className="navbar__drawer-content">
          <div className="navbar__drawer-header">
            <span className="navbar__drawer-header-title">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="navbar__drawer-header-close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="navbar__drawer-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`navbar__drawer-link ${
                  isActive(link.path) ? "navbar__drawer-link--active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar__drawer-auth">
            {isLoggedIn ? (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="navbar__drawer-auth-button navbar__drawer-auth-button--profile"
              >
                <User size={20} /> Tài khoản
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="navbar__drawer-auth-button navbar__drawer-auth-button--login"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="navbar__drawer-auth-button navbar__drawer-auth-button--register"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </nav>
  );
}
