import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authApi } from '../../api/auth.api';
import { toast } from 'react-toastify';

const profileSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().min(8, 'At least 8 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const profileFormik = useFormik({
    initialValues: { name: user?.name ?? '', email: user?.email ?? '' },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const updated = await authApi.updateProfile(values);
        updateUser({ ...user, ...updated });
        toast.success('Profile updated');
      } catch (err) {
        toast.error(err?.response?.data?.error ?? 'Failed to update profile');
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: passwordSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await authApi.updateProfile({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        toast.success('Password changed successfully');
        resetForm();
        setShowPasswordForm(false);
      } catch (err) {
        toast.error(err?.response?.data?.error ?? 'Failed to change password');
      }
    },
  });

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your admin account settings</p>
      </div>

      {/* Profile info */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-xl">
            {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
        </div>

        <form onSubmit={profileFormik.handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            name="name"
            value={profileFormik.values.name}
            onChange={profileFormik.handleChange}
            onBlur={profileFormik.handleBlur}
            error={profileFormik.errors.name}
            touched={profileFormik.touched.name}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={profileFormik.values.email}
            onChange={profileFormik.handleChange}
            onBlur={profileFormik.handleBlur}
            error={profileFormik.errors.email}
            touched={profileFormik.touched.email}
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={profileFormik.isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change password */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Password</h2>
            <p className="text-sm text-gray-500">Change your login password</p>
          </div>
          {!showPasswordForm && (
            <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(true)}>
              Change Password
            </Button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={passwordFormik.handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordFormik.values.currentPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              error={passwordFormik.errors.currentPassword}
              touched={passwordFormik.touched.currentPassword}
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordFormik.values.newPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              error={passwordFormik.errors.newPassword}
              touched={passwordFormik.touched.newPassword}
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordFormik.values.confirmPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              error={passwordFormik.errors.confirmPassword}
              touched={passwordFormik.touched.confirmPassword}
            />
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setShowPasswordForm(false); passwordFormik.resetForm(); }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={passwordFormik.isSubmitting}>
                Update Password
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
