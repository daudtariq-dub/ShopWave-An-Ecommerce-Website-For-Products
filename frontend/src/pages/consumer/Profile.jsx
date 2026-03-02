import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { toast } from 'react-toastify';

const profileSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function Profile() {
  const { user, updateUser } = useAuth();

  const formik = useFormik({
    initialValues: { name: user?.name ?? '', email: user?.email ?? '' },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        updateUser({ ...user, ...values });
        toast.success('Profile updated');
      } catch {
        toast.error('Failed to update profile');
      }
    },
  });

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-700">
              {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name ?? 'User'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {user?.role && (
              <span className="inline-block mt-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">
                {user.role}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.name}
            touched={formik.touched.name}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={formik.isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
