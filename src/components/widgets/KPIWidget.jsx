import { useMemo } from 'react';

const FIELD_MAP = {
  'Customer ID': 'id',
  'Customer name': o => `${o.first_name} ${o.last_name}`,
  'Email id': 'email',
  'Address': o => `${o.street_address}, ${o.city}`,
  'Order date': 'order_date',
  'Product': 'product',
  'Created by': 'created_by',
  'Status': 'status',
  'Total amount': 'total_amount',
  'Unit price': 'unit_price',
  'Quantity': 'quantity',
};

function getFieldValue(order, metric) {
  const mapping = FIELD_MAP[metric];
  if (!mapping) return null;
  if (typeof mapping === 'function') return mapping(order);
  return order[mapping];
}

export default function KPIWidget({ config, orders }) {
  const value = useMemo(() => {
    if (!config.metric || orders.length === 0) return '—';

    const values = orders.map(o => getFieldValue(o, config.metric));

    switch (config.aggregation) {
      case 'Count':
        return values.length;
      case 'Sum': {
        const nums = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
        return nums.reduce((a, b) => a + b, 0);
      }
      case 'Average': {
        const nums = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
        return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
      }
      default:
        return values.length;
    }
  }, [config, orders]);

  const formatted = useMemo(() => {
    if (value === '—') return value;
    const precision = config.decimalPrecision || 0;
    const num = parseFloat(value).toFixed(precision);
    if (config.dataFormat === 'Currency') {
      return `$${parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })}`;
    }
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision });
  }, [value, config]);

  return (
    <div className="widget-card" style={{ height: '100%' }}>
      <div className="widget-card-header">
        <span className="widget-card-title">{config.title || 'KPI'}</span>
      </div>
      <div className="widget-card-body" style={{ flexDirection: 'column' }}>
        <div className="kpi-value">{formatted}</div>
        <div className="kpi-label">
          {config.aggregation} of {config.metric || 'metric'}
        </div>
        {config.description && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{config.description}</div>
        )}
      </div>
    </div>
  );
}
