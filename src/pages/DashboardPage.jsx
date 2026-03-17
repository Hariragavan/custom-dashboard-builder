import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactGridLayout from 'react-grid-layout';
import { Settings2, Calendar } from 'lucide-react';
import KPIWidget from '../components/widgets/KPIWidget';
import ChartWidget from '../components/widgets/ChartWidget';
import PieChartWidget from '../components/widgets/PieChartWidget';
import TableWidget from '../components/widgets/TableWidget';
import { getDashboardLayout, getOrders } from '../services/api';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = ReactGridLayout.WidthProvider(ReactGridLayout.Responsive);

const DATE_FILTERS = [
  { label: 'All time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 90 Days', value: '90' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [] });
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [layoutData, ordersData] = await Promise.all([
          getDashboardLayout(),
          getOrders()
        ]);
        const lj = layoutData.layout_json || layoutData;
        if (lj.widgets) setWidgets(lj.widgets);
        if (lj.layouts) {
          // Sanitize layout items: react-grid-layout requires numeric w, h, x, y
          const sanitized = {};
          for (const [breakpoint, items] of Object.entries(lj.layouts)) {
            sanitized[breakpoint] = (items || []).map(item => ({
              ...item,
              w: typeof item.w === 'number' ? item.w : (breakpoint === 'lg' ? 3 : 4),
              h: typeof item.h === 'number' ? item.h : 3,
              x: typeof item.x === 'number' ? item.x : 0,
              y: typeof item.y === 'number' ? item.y : 0,
            }));
          }
          setLayouts(sanitized);
        }
        setOrders(ordersData);
      } catch (err) {
        console.error('Failed to load:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // The filtering hook
  const filteredOrders = useMemo(() => {
    if (dateFilter === 'all') return orders;
    const now = new Date();
    let cutoff;
    if (dateFilter === 'today') {
      cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else {
      const days = parseInt(dateFilter);
      cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
    return orders.filter(o => new Date(o.order_date) >= cutoff);
  }, [orders, dateFilter]);

  const memoizedLayouts = useMemo(() => layouts, [layouts]);

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'kpi':
        return <KPIWidget config={widget} orders={filteredOrders} />;
      case 'bar':
      case 'line':
      case 'area':
      case 'scatter':
        return <ChartWidget config={widget} orders={filteredOrders} />;
      case 'pie':
        return <PieChartWidget config={widget} orders={filteredOrders} />;
      case 'table':
        return <TableWidget config={widget} orders={filteredOrders} />;
      default:
        return <div>Unknown widget</div>;
    }
  };

  if (loading) {
    return (
      <>
        <header className="page-header">
          <h1 className="page-title">Dashboard</h1>
        </header>
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="header-actions">
          {widgets.length > 0 && (
            <div className="date-filter">
              <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
              <label>Show data for</label>
              <select className="form-select" style={{ width: 160 }} value={dateFilter} onChange={e => setDateFilter(e.target.value)} id="date-filter">
                {DATE_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          )}
          <button className="btn btn-primary" onClick={() => navigate('/configure')} id="configure-btn">
            <Settings2 size={16} />
            Configure Dashboard
          </button>
        </div>
      </header>

      <div className="page-content">
        {widgets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h3>No widgets configured</h3>
            <p>Configure your dashboard by adding widgets to visualize your customer order data.</p>
            <button className="btn btn-primary" onClick={() => navigate('/configure')}>
              <Settings2 size={16} />
              Configure Dashboard
            </button>
          </div>
        ) : (
          <ResponsiveGridLayout
            className="layout"
            layouts={memoizedLayouts}
            breakpoints={{ lg: 1200, md: 768, sm: 0 }}
            cols={{ lg: 12, md: 8, sm: 4 }}
            rowHeight={60}
            isDraggable={false}
            isResizable={false}
            compactType="vertical"
            margin={[16, 16]}
          >
            {widgets.map(widget => (
              <div key={widget.id}>
                {renderWidget(widget)}
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </div>
    </>
  );
}
