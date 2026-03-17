import { useState } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

export default function OrdersTable({ orders, onEdit, onDelete }) {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e, order) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, order });
  };

  const handleRowClick = (e, order) => {
    // Only show context menu on right click or 3-dot menu
  };

  const closeContextMenu = () => setContextMenu(null);

  const statusClass = (status) => {
    switch (status) {
      case 'Pending': return 'badge badge-pending';
      case 'In progress': return 'badge badge-progress';
      case 'Completed': return 'badge badge-completed';
      default: return 'badge';
    }
  };

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" id="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Order Date</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} onContextMenu={(e) => handleContextMenu(e, order)}>
                <td>#{order.id}</td>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {order.first_name} {order.last_name}
                </td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>${parseFloat(order.unit_price).toFixed(2)}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  ${parseFloat(order.total_amount).toFixed(2)}
                </td>
                <td><span className={statusClass(order.status)}>{order.status}</span></td>
                <td>{order.created_by}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="widget-action-btn"
                    style={{ opacity: 1 }}
                    onClick={(e) => handleContextMenu(e, order)}
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contextMenu && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={closeContextMenu} />
          <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
            <button
              className="context-menu-item"
              onClick={() => { onEdit(contextMenu.order); closeContextMenu(); }}
            >
              <Edit size={14} />
              Edit
            </button>
            <button
              className="context-menu-item danger"
              onClick={() => { onDelete(contextMenu.order); closeContextMenu(); }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}
