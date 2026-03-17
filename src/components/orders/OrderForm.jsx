import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { X } from 'lucide-react';

const COUNTRIES = ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'];
const PRODUCTS = [
  'Fiber Internet 300 Mbps',
  '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps',
  'Business Internet 500 Mbps',
  'VoIP Corporate Package',
];
const STATUSES = ['Pending', 'In progress', 'Completed'];
const CREATORS = ['Mr. Michael Harris', 'Mr. Ryan Cooper', 'Ms. Olivia Carter', 'Mr. Lucas Martin'];

export default function OrderForm({ order, onSubmit, onClose }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: order ? {
      first_name: order.first_name,
      last_name: order.last_name,
      email: order.email,
      phone: order.phone,
      street_address: order.street_address,
      city: order.city,
      state: order.state,
      postal_code: order.postal_code,
      country: order.country,
      product: order.product,
      quantity: order.quantity,
      unit_price: order.unit_price,
      total_amount: order.total_amount,
      status: order.status,
      created_by: order.created_by,
    } : {
      quantity: 1,
      unit_price: '',
      total_amount: 0,
      status: 'Pending',
      country: '',
      product: '',
      created_by: '',
    }
  });

  const quantity = watch('quantity');
  const unitPrice = watch('unit_price');

  useEffect(() => {
    const q = parseInt(quantity) || 0;
    const p = parseFloat(unitPrice) || 0;
    setValue('total_amount', (q * p).toFixed(2));
  }, [quantity, unitPrice, setValue]);

  const validationRule = { required: 'Please fill the field' };

  const onFormSubmit = (data) => {
    data.quantity = parseInt(data.quantity);
    data.unit_price = parseFloat(data.unit_price);
    data.total_amount = parseFloat(data.total_amount);
    onSubmit(data);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{order ? 'Edit Order' : 'Create Order'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="modal-body">
            {/* Customer Information */}
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
              Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="form-group">
                <label className="form-label">First name <span className="required">*</span></label>
                <input className={`form-input ${errors.first_name ? 'error' : ''}`} {...register('first_name', validationRule)} placeholder="Enter first name" />
                {errors.first_name && <div className="form-error">{errors.first_name.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Last name <span className="required">*</span></label>
                <input className={`form-input ${errors.last_name ? 'error' : ''}`} {...register('last_name', validationRule)} placeholder="Enter last name" />
                {errors.last_name && <div className="form-error">{errors.last_name.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Email id <span className="required">*</span></label>
                <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" {...register('email', validationRule)} placeholder="Enter email" />
                {errors.email && <div className="form-error">{errors.email.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone number <span className="required">*</span></label>
                <input className={`form-input ${errors.phone ? 'error' : ''}`} {...register('phone', validationRule)} placeholder="Enter phone" />
                {errors.phone && <div className="form-error">{errors.phone.message}</div>}
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Street Address <span className="required">*</span></label>
                <input className={`form-input ${errors.street_address ? 'error' : ''}`} {...register('street_address', validationRule)} placeholder="Enter street address" />
                {errors.street_address && <div className="form-error">{errors.street_address.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">City <span className="required">*</span></label>
                <input className={`form-input ${errors.city ? 'error' : ''}`} {...register('city', validationRule)} placeholder="Enter city" />
                {errors.city && <div className="form-error">{errors.city.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">State / Province <span className="required">*</span></label>
                <input className={`form-input ${errors.state ? 'error' : ''}`} {...register('state', validationRule)} placeholder="Enter state" />
                {errors.state && <div className="form-error">{errors.state.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Postal code <span className="required">*</span></label>
                <input className={`form-input ${errors.postal_code ? 'error' : ''}`} {...register('postal_code', validationRule)} placeholder="Enter postal code" />
                {errors.postal_code && <div className="form-error">{errors.postal_code.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Country <span className="required">*</span></label>
                <select className={`form-select ${errors.country ? 'error' : ''}`} {...register('country', validationRule)}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <div className="form-error">{errors.country.message}</div>}
              </div>
            </div>

            {/* Order Information */}
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, marginTop: 8, color: 'var(--text-primary)' }}>
              Order Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Choose product <span className="required">*</span></label>
                <select className={`form-select ${errors.product ? 'error' : ''}`} {...register('product', validationRule)}>
                  <option value="">Select product</option>
                  {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.product && <div className="form-error">{errors.product.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Quantity <span className="required">*</span></label>
                <input className={`form-input ${errors.quantity ? 'error' : ''}`} type="number" min="1" {...register('quantity', { required: 'Please fill the field', min: { value: 1, message: 'Minimum value is 1' } })} />
                {errors.quantity && <div className="form-error">{errors.quantity.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Unit price ($) <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)', fontSize: 14 }}>$</span>
                  <input className={`form-input ${errors.unit_price ? 'error' : ''}`} type="number" step="0.01" min="0" {...register('unit_price', validationRule)} style={{ paddingLeft: 28 }} placeholder="0.00" />
                </div>
                {errors.unit_price && <div className="form-error">{errors.unit_price.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Total amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)', fontSize: 14 }}>$</span>
                  <input className="form-input" type="text" {...register('total_amount')} readOnly style={{ paddingLeft: 28, background: '#f9fafb' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status <span className="required">*</span></label>
                <select className={`form-select ${errors.status ? 'error' : ''}`} {...register('status', validationRule)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.status && <div className="form-error">{errors.status.message}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Created by <span className="required">*</span></label>
                <select className={`form-select ${errors.created_by ? 'error' : ''}`} {...register('created_by', validationRule)}>
                  <option value="">Select creator</option>
                  {CREATORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.created_by && <div className="form-error">{errors.created_by.message}</div>}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="submit-order-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
