import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const COLUMN_MAP = {
  'Customer ID': { key: 'id', format: v => `#${v}` },
  'Customer name': { key: null, format: (_, o) => `${o.first_name} ${o.last_name}` },
  'Email id': { key: 'email' },
  'Phone number': { key: 'phone' },
  'Address': { key: null, format: (_, o) => `${o.street_address}, ${o.city}, ${o.state}` },
  'Order ID': { key: 'id', format: v => `ORD-${v}` },
  'Order date': { key: 'order_date', format: v => new Date(v).toLocaleDateString() },
  'Product': { key: 'product' },
  'Quantity': { key: 'quantity' },
  'Unit price': { key: 'unit_price', format: v => `$${parseFloat(v).toFixed(2)}` },
  'Total amount': { key: 'total_amount', format: v => `$${parseFloat(v).toFixed(2)}` },
  'Status': { key: 'status' },
  'Created by': { key: 'created_by' },
};

export default function TableWidget({ config, orders }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [filterText, setFilterText] = useState('');

  const columns = config.columns || [];
  const pageSize = config.pagination || 10;
  const fontSize = config.fontSize || 14;
  const headerBg = config.headerBackground || '#54bd95';

  const sortedOrders = useMemo(() => {
    let sorted = [...orders];
    if (config.sortBy === 'Ascending') {
      sorted.sort((a, b) => a.id - b.id);
    } else if (config.sortBy === 'Descending') {
      sorted.sort((a, b) => b.id - a.id);
    } else if (config.sortBy === 'Order date') {
      sorted.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
    }
    return sorted;
  }, [orders, config.sortBy]);

  const filteredOrders = useMemo(() => {
    if (!filterText || !config.applyFilter) return sortedOrders;
    const lower = filterText.toLowerCase();
    return sortedOrders.filter(o => {
      return Object.values(o).some(v => String(v).toLowerCase().includes(lower));
    });
  }, [sortedOrders, filterText, config.applyFilter]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const pageOrders = filteredOrders.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const getCellValue = (order, colName) => {
    const colDef = COLUMN_MAP[colName];
    if (!colDef) return '';
    let val;
    if (colDef.key) {
      val = order[colDef.key];
    }
    if (colDef.format) {
      return colDef.format(val, order);
    }
    return val ?? '';
  };

  if (columns.length === 0) {
    return (
      <div className="widget-card" style={{ height: '100%' }}>
        <div className="widget-card-header">
          <span className="widget-card-title">{config.title || 'Table'}</span>
        </div>
        <div className="widget-card-body">
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No columns selected</div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="widget-card-header" style={{ flexShrink: 0 }}>
        <span className="widget-card-title">{config.title || 'Table'}</span>
      </div>
      {config.applyFilter && (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-light)', flexShrink: 0 }}>
          <input
            className="form-input"
            placeholder="Search..."
            value={filterText}
            onChange={e => { setFilterText(e.target.value); setCurrentPage(0); }}
            style={{ fontSize: 13 }}
          />
        </div>
      )}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="data-table" style={{ fontSize }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} style={{ background: headerBg, fontSize: Math.max(11, fontSize - 1) }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageOrders.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No data</td></tr>
            ) : (
              pageOrders.map((order, i) => (
                <tr key={order.id || i}>
                  {columns.map(col => {
                    const val = getCellValue(order, col);
                    if (col === 'Status') {
                      const cls = val === 'Pending' ? 'badge-pending' : val === 'In progress' ? 'badge-progress' : 'badge-completed';
                      return <td key={col}><span className={`badge ${cls}`}>{val}</span></td>;
                    }
                    return <td key={col}>{val}</td>;
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination" style={{ padding: '8px 16px', flexShrink: 0 }}>
          <span>Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, filteredOrders.length)} of {filteredOrders.length}</span>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <button key={i} className={`pagination-btn ${i === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(i)}>
                {i + 1}
              </button>
            ))}
            <button className="pagination-btn" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
