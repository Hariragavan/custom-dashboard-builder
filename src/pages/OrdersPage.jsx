import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import OrdersTable from '../components/orders/OrdersTable';
import OrderForm from '../components/orders/OrderForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/api';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Status filter
    if (statusFilter !== 'All') {
      const statusMap = {
        'Pending': 'Pending',
        'In Progress': 'In progress',
        'Completed': 'Completed'
      };
      result = result.filter(o => o.status === statusMap[statusFilter]);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o =>
        (o.id && o.id.toLowerCase().includes(q)) ||
        (`${o.first_name} ${o.last_name}`.toLowerCase().includes(q)) ||
        (o.email && o.email.toLowerCase().includes(q)) ||
        (o.phone && o.phone.toLowerCase().includes(q)) ||
        (o.product && o.product.toLowerCase().includes(q)) ||
        (o.status && o.status.toLowerCase().includes(q)) ||
        (o.created_by && o.created_by.toLowerCase().includes(q))
      );
    }

    return result;
  }, [orders, statusFilter, searchQuery]);

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

  // Count orders by status for badge numbers
  const statusCounts = useMemo(() => ({
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    'In Progress': orders.filter(o => o.status === 'In progress').length,
    Completed: orders.filter(o => o.status === 'Completed').length,
  }), [orders]);

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

      {/* Toolbar: Status Filters + Search */}
      <div className="orders-toolbar">
        <div className="status-filter-tabs">
          {STATUS_FILTERS.map(status => (
            <button
              key={status}
              className={`status-tab ${statusFilter === status ? 'active' : ''} ${status === 'Completed' && statusFilter === status ? 'status-tab-completed' : ''} ${status === 'Pending' && statusFilter === status ? 'status-tab-pending' : ''} ${status === 'In Progress' && statusFilter === status ? 'status-tab-progress' : ''}`}
              onClick={() => setStatusFilter(status)}
              id={`filter-${status.toLowerCase().replace(' ', '-')}`}
            >
              {status}
              {statusCounts[status] > 0 && (
                <span className="status-tab-count">{statusCounts[status]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="orders-search-wrapper">
          <Search size={16} className="orders-search-icon" />
          <input
            type="text"
            className="orders-search-input"
            placeholder="Search orders, customer, product..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            id="orders-search"
          />
        </div>
      </div>

      <div className="page-content" style={{ paddingTop: 0 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading orders...</div>
        ) : filteredOrders.length === 0 && orders.length === 0 ? (
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
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={36} />
            </div>
            <h3>No matching orders</h3>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <OrdersTable orders={filteredOrders} onEdit={handleEdit} onDelete={setConfirmDelete} />
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
