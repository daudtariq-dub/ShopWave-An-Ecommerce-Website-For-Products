import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { productsApi } from '../../api/products.api';
import { useProducts } from '../../hooks/useProducts';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/extended/Select';
import ImageUpload from '../../components/ui/extended/ImageUpload';
import Loader from '../../components/ui/Loader';
import { toast } from 'react-toastify';

const CATEGORIES = ['electronics', 'clothing', 'home', 'sports', 'books', 'beauty', 'toys', 'jewelery'];

const productSchema = Yup.object({
  title: Yup.string().required('Product name is required'),
  price: Yup.number().positive('Price must be positive').required('Price is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
  stock: Yup.number().integer().min(0).required('Stock is required'),
  sku: Yup.string(),
});

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { product, loading: fetchLoading, fetchProductById } = useProducts();
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) fetchProductById(id);
  }, [id]); // eslint-disable-line

  useEffect(() => {
    if (isEdit && product) {
      formik.setValues({
        title: product.title ?? '',
        price: product.price ?? '',
        category: product.category ?? '',
        description: product.description ?? '',
        stock: product.stock ?? product.stockQuantity ?? 0,
        sku: product.sku ?? '',
      });
      setImages(product.images ?? (product.image ? [product.image] : []));
    }
  }, [product]); // eslint-disable-line

  const formik = useFormik({
    initialValues: { title: '', price: '', category: '', description: '', stock: 0, sku: '' },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      setSaving(true);
      try {
        const payload = { ...values, images, image: images[0] ?? null };
        if (isEdit) {
          await productsApi.update(id, payload);
          toast.success('Product updated');
        } else {
          await productsApi.create(payload);
          toast.success('Product created');
        }
        navigate('/admin/products');
      } catch (err) {
        toast.error(err.response?.data?.message ?? 'Failed to save product');
      } finally {
        setSaving(false);
      }
    },
  });

  if (isEdit && fetchLoading) return <Loader text="Loading product..." />;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/products')} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="flex flex-col gap-4">
            <Input label="Product Name *" name="title" placeholder="e.g. Wireless Headphones Pro" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.title} touched={formik.touched.title} />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Price ($) *" name="price" type="number" step="0.01" placeholder="29.99" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.price} touched={formik.touched.price} />
              <Select
                label="Category *"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                placeholder="Select category"
                options={CATEGORIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description *</label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                placeholder="Describe the product..."
                className={[
                  'w-full px-4 py-2.5 text-sm rounded-xl border transition-colors resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400',
                  formik.touched.description && formik.errors.description
                    ? 'border-red-400'
                    : 'border-gray-300',
                ].join(' ')}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-xs text-red-500">{formik.errors.description}</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Inventory</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Initial Stock *" name="stock" type="number" min="0" value={formik.values.stock} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.stock} touched={formik.touched.stock} />
            <Input label="SKU" name="sku" placeholder="SKU-001" value={formik.values.sku} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Product Images</h2>
          <ImageUpload images={images} onChange={setImages} />
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={saving}>
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
