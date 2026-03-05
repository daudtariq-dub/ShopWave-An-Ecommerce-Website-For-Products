import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatPrice } from '../../utils/helpers';
import { toast } from 'react-toastify';

const STEPS = ['Shipping', 'Review', 'Confirm'];

const shippingSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string().required('Postal code is required'),
  country: Yup.string().required('Country is required'),
});

export default function Checkout() {
  const [step, setStep] = useState(0);
  const { items, totalPrice, clearCart } = useCart();
  const { placeOrder, loading } = useOrders();
  const navigate = useNavigate();

  const tax = totalPrice * 0.08;
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const total = totalPrice + tax + shipping;

  const STORAGE_KEY = 'checkout_shipping';
  const saved = (() => { try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)); } catch { return null; } })();

  const formik = useFormik({
    initialValues: saved ?? {
      firstName: '', lastName: '', email: '',
      address: '', city: '', state: '', postalCode: '', country: 'US',
    },
    validationSchema: shippingSchema,
    onSubmit: () => setStep(1),
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formik.values));
  }, [formik.values]);

  const handlePlaceOrder = async () => {
    try {
      const order = await placeOrder({
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: formik.values,
        total,
      });
      clearCart();
      sessionStorage.removeItem(STORAGE_KEY);
      navigate(`/order-confirmation/${order.id}`);
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      {/* Step indicators */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={[
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold',
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500',
            ].join(' ')}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${i === step ? 'text-indigo-600' : 'text-gray-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-3" />}
          </div>
        ))}
      </div>

      {/* Step 0: Shipping */}
      {step === 0 && (
        <Card>
          <h2 className="font-semibold text-gray-900 mb-5">Shipping Address</h2>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First name" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.firstName} touched={formik.touched.firstName} />
              <Input label="Last name" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.lastName} touched={formik.touched.lastName} />
            </div>
            <Input label="Email" name="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.email} touched={formik.touched.email} />
            <Input label="Street address" name="address" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.address} touched={formik.touched.address} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" name="city" value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.city} touched={formik.touched.city} />
              <Input label="State" name="state" value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.state} touched={formik.touched.state} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Postal code" name="postalCode" value={formik.values.postalCode} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.postalCode} touched={formik.touched.postalCode} />
              <Input label="Country" name="country" value={formik.values.country} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.errors.country} touched={formik.touched.country} />
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <Button type="submit" variant="primary">Continue to Review →</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Step 1: Review */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4">Shipping to</h2>
            <p className="text-sm text-gray-700">
              {formik.values.firstName} {formik.values.lastName}<br />
              {formik.values.address}<br />
              {formik.values.city}, {formik.values.state} {formik.values.postalCode}<br />
              {formik.values.country}
            </p>
          </Card>

          <Card>
            <h2 className="font-semibold text-gray-900 mb-4">Order Items ({items.length})</h2>
            <div className="flex flex-col divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">×{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-3 pt-3 flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </Card>

          <div className="flex justify-between gap-3">
            <Button variant="ghost" onClick={() => setStep(0)}>← Edit Address</Button>
            <Button variant="primary" onClick={() => setStep(2)}>Confirm Order →</Button>
          </div>
        </div>
      )}

      {/* Step 2: Confirm */}
      {step === 2 && (
        <Card className="text-center">
          <div className="py-4 flex flex-col items-center gap-5">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <Check className="w-8 h-8 text-indigo-600" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ready to place your order?</h2>
              <p className="text-gray-500 text-sm mt-1">Total: <strong>{formatPrice(total)}</strong></p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" size="lg" loading={loading} onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
