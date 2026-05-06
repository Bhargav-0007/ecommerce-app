import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../ui/ScrollToTop';
import ToastContainer from '../ui/Toast';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <ToastContainer />
    </div>
  );
}
