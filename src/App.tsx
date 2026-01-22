import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import { HomePage, ToursPage } from './pages';

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tours" element={<ToursPage />} />
                    <Route path="/tours/:id" element={<PlaceholderPage title="Chi tiết Tour" />} />
                    <Route path="/artisans" element={<PlaceholderPage title="Góc Nghệ Nhân" />} />
                    <Route path="/learn" element={<PlaceholderPage title="Học Nhanh" />} />
                    <Route path="/about" element={<PlaceholderPage title="Về Chúng Tôi" />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

// Placeholder component for routes not yet implemented
function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">{title}</h1>
                <p className="text-[var(--color-text-light)]">Trang đang được phát triển...</p>
            </div>
        </div>
    );
}

export default App;
