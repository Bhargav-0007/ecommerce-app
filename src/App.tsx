import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { ROUTES } from './constants/theme';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME}      element={<Home />} />
          <Route path={ROUTES.PRODUCTS}  element={<Products />} />
          <Route path={ROUTES.PRODUCT}   element={<ProductDetail />} />
          <Route path={ROUTES.CART}      element={<Cart />} />
          <Route path={ROUTES.LOGIN}     element={<Login />} />
          <Route path={ROUTES.REGISTER}  element={<Register />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
