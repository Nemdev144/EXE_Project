import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();
  const isTourDetail = /^\/tours\/\d+$/.test(pathname);

  return (
    <div className={`main-layout ${isTourDetail ? 'main-layout--tour-detail' : ''}`}>
      <Navbar />
      <main className="main-layout__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
