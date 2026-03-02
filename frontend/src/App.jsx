import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SearchProvider>
            <AppRoutes />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              toastClassName="!rounded-xl !shadow-lg !text-sm !font-medium"
            />
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
