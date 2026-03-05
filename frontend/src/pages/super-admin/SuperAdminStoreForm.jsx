import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Copy, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { storesApi } from '../../api/stores.api';
import { toast } from 'react-toastify';

const schema = Yup.object({
  name: Yup.string().required('Store name is required'),
  description: Yup.string(),
  policies: Yup.string(),
  isActive: Yup.boolean(),
  adminEmail: Yup.string().email('Must be a valid email').optional(),
});

export default function SuperAdminStoreForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [createdAdmin, setCreatedAdmin] = useState(null); // { email, password }
  const [copied, setCopied] = useState(false);

  const formik = useFormik({
    initialValues: { name: '', description: '', policies: '', isActive: true, adminEmail: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          const { adminEmail: _, ...editValues } = values;
          await storesApi.update(id, editValues);
          toast.success('Store updated.');
          navigate('/super-admin/stores');
        } else {
          const res = await storesApi.create(values);
          if (res.generatedPassword) {
            setCreatedAdmin({ email: values.adminEmail, password: res.generatedPassword });
          } else {
            toast.success('Store created' + (values.adminEmail ? ` and ${values.adminEmail} assigned as admin` : '') + '.');
            navigate('/super-admin/stores');
          }
        }
      } catch (err) {
        toast.error(err?.response?.data?.error ?? 'Failed to save store.');
      }
    },
  });

  useEffect(() => {
    if (!isEdit) return;
    storesApi.getAll()
      .then((d) => {
        const store = d.stores?.find((s) => s.id === id);
        if (store) {
          formik.setValues({
            name: store.name ?? '',
            description: store.description ?? '',
            policies: store.policies ?? '',
            isActive: store.isActive ?? true,
          });
        }
      })
      .catch(() => toast.error('Failed to load store.'))
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line

  const copyPassword = () => {
    navigator.clipboard.writeText(createdAdmin.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Loader text="Loading store..." />;

  // Show generated password modal after successful creation
  if (createdAdmin) {
    return (
      <div className="max-w-lg flex flex-col gap-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-emerald-900">Store created successfully</h2>
            <p className="text-sm text-emerald-700 mt-1">
              A new admin account was created for <strong>{createdAdmin.email}</strong>. Share these credentials with them — the password is only shown once.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Login credentials</p>
            <div className="bg-white border border-emerald-200 rounded-xl p-4 flex flex-col gap-2 font-mono text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-900">{createdAdmin.email}</span></div>
              <div className="flex justify-between items-center gap-3">
                <span className="text-gray-500">Password</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-bold">{createdAdmin.password}</span>
                  <button onClick={copyPassword} className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400">The admin can change their password after logging in from their Profile page.</p>
          <Button variant="primary" onClick={() => navigate('/super-admin/stores')}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Store' : 'New Store'}</h1>
        <p className="text-sm text-gray-500 mt-1">{isEdit ? 'Update store details' : 'Create a new tenant store'}</p>
      </div>

      <Card>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Store name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.name}
            touched={formik.touched.name}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Brief description of this store..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Policies</label>
            <textarea
              name="policies"
              rows={5}
              value={formik.values.policies}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Store rules and policies..."
            />
          </div>

          {!isEdit && (
            <div className="flex flex-col gap-1">
              <Input
                label="Admin email (optional)"
                name="adminEmail"
                type="email"
                value={formik.values.adminEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.adminEmail}
                touched={formik.touched.adminEmail}
                placeholder="user@example.com — will be promoted to Admin"
              />
              <p className="text-xs text-gray-400">The user must already have an account. They'll be assigned the Admin role and linked to this store.</p>
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formik.values.isActive}
              onChange={formik.handleChange}
              className="w-4 h-4 accent-violet-600"
            />
            <span className="text-sm font-medium text-gray-700">Store is active</span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" loading={formik.isSubmitting}>
              {isEdit ? 'Save Changes' : 'Create Store'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/super-admin/stores')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
