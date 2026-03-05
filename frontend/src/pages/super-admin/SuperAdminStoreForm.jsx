import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
});

export default function SuperAdminStoreForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);

  const formik = useFormik({
    initialValues: { name: '', description: '', policies: '', isActive: true },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await storesApi.update(id, values);
          toast.success('Store updated.');
        } else {
          await storesApi.create(values);
          toast.success('Store created.');
        }
        navigate('/super-admin/stores');
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

  if (loading) return <Loader text="Loading store..." />;

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
