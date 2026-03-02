import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GoogleOAuthButton from '../../components/auth/GoogleOAuthButton';
import loginAnimation from '../../assets/login-animation.json';

const loginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

export default function Login() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/';

  useEffect(() => {
    if (isAuthenticated) navigate(returnTo, { replace: true });
  }, [isAuthenticated, navigate, returnTo]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try { await login(values); } catch { /* handled in context */ }
    },
  });

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left — Animation */}
      <div className="flex-1 bg-indigo-50 flex items-center justify-center p-10 min-h-[260px] md:min-h-screen">
        <Lottie animationData={loginAnimation} loop className="w-full max-w-sm" />
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6">
              ← Back to store
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input label="Email" name="email" type="email" placeholder="you@example.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.email} touched={formik.touched.email} />
            <Input label="Password" name="password" type="password" placeholder="••••••••" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.password} touched={formik.touched.password} />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                Remember me
              </label>
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot password?
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
              or continue with
            </div>
          </div>

          <GoogleOAuthButton
            onSuccess={() => navigate(returnTo, { replace: true })}
          />

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
