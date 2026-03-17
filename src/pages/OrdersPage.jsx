import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import OrdersTable from '../components/orders/OrdersTable';
import OrderForm from '../components/orders/OrderForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCreate = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, data);
      } else {
        await createOrder(data);
      }
      setShowForm(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error('Failed to save order:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteOrder(confirmDelete.id);
      setConfirmDelete(null);
      fetchOrders();
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Customer Orders</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleCreate} id="create-order-btn">
            <Plus size={16} />
            Create Order
          </button>
        </div>
      </header>
      <div className="page-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingCartEmpty />
            </div>
            <h3>No orders yet</h3>
            <p>Get started by creating your first customer order.</p>
            <button className="btn btn-primary" onClick={handleCreate}>
              <Plus size={16} />
              Create Order
            </button>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <OrdersTable orders={orders} onEdit={handleEdit} onDelete={setConfirmDelete} />
          </div>
        )}
      </div>

      {showForm && (
        <OrderForm
          order={editingOrder}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingOrder(null); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Order"
          message={`Are you sure you want to delete the order for ${confirmDelete.first_name} ${confirmDelete.last_name}?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
}

function ShoppingCartEmpty() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}
