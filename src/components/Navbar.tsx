import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__content">
          <Link
            to="/"
            className="navbar__logo"
          >
            <img
              src="/Logo.png"
              alt="Cội Việt Logo"
              style={{
                height: 40,
                objectFit: "contain",
              }}
            />
          </Link>
          <div className="navbar__links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
