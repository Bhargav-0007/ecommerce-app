import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import { AdminRoute } from './components/ProtectedRoute';
import { ROUTES } from './constants/theme';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public store routes */}
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME}      element={<Home />} />
          <Route path={ROUTES.PRODUCTS}  element={<Products />} />
          <Route path={ROUTES.PRODUCT}   element={<ProductDetail />} />
          <Route path={ROUTES.CART}      element={<Cart />} />
          <Route path={ROUTES.LOGIN}     element={<Login />} />
          <Route path={ROUTES.REGISTER}  element={<Register />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>

        {/* Admin routes — own layout, no public header/footer */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index           element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders"   element={<AdminOrders />} />
          <Route path="users"    element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
