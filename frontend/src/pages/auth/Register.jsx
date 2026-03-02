import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GoogleOAuthButton from '../../components/auth/GoogleOAuthButton';
import loginAnimation from '../../assets/login-animation.json';

const registerSchema = Yup.object({
  name: Yup.string().min(2, 'Name too short').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'At least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function Register() {
  const { register, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try { await register(values); } catch { /* handled in context */ }
    },
  });

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <div className="flex-1 bg-indigo-50 flex items-center justify-center p-10 min-h-[200px] md:min-h-screen">
        <Lottie animationData={loginAnimation} loop className="w-full max-w-sm" />
      </div>

      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6">
              ← Back to store
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
            <p className="text-gray-500 text-sm mt-1">Join us and start shopping</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input label="Full Name" name="name" placeholder="Jane Doe" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.name} touched={formik.touched.name} />
            <Input label="Email" name="email" type="email" placeholder="you@example.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.email} touched={formik.touched.email} />
            <Input label="Password" name="password" type="password" placeholder="Min 8 characters" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.password} touched={formik.touched.password} />
            <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.confirmPassword} touched={formik.touched.confirmPassword} />

            <p className="text-xs text-gray-400">
              By registering you agree to our Terms of Service and Privacy Policy.
            </p>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">or</div>
          </div>

          <GoogleOAuthButton onSuccess={() => navigate('/', { replace: true })} />

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
