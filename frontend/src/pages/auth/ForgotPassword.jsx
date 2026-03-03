import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const forgotSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotSchema,
    onSubmit: async (values, { resetForm }) => {
      // Mock behavior until backend endpoint is connected.
      toast.success(`Password reset link sent to ${values.email}`);
      resetForm();
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 p-6">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-4">
            ← Back to login
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your email and we&apos;ll send a reset link.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
          <Button type="submit" variant="primary" fullWidth>
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  );
}

