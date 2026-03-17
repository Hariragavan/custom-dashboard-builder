import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#54bd95', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#0d9488', '#ec4899', '#6366f1', '#14b8a6', '#f97316'];

const FIELD_MAP = {
  'Product': 'product',
  'Quantity': 'quantity',
  'Unit price': 'unit_price',
  'Total amount': 'total_amount',
  'Status': 'status',
  'Created by': 'created_by',
};

const NUMERIC_FIELDS = ['Quantity', 'Unit price', 'Total amount'];

export default function PieChartWidget({ config, orders }) {
  const chartData = useMemo(() => {
    if (!config.chartData || orders.length === 0) return [];

    const field = FIELD_MAP[config.chartData];
    if (!field) return [];

    if (NUMERIC_FIELDS.includes(config.chartData)) {
      // Group by product and sum
      const grouped = {};
      orders.forEach(o => {
        const key = o.product || 'Unknown';
        if (!grouped[key]) grouped[key] = 0;
        grouped[key] += parseFloat(o[field]) || 0;
      });
      return Object.entries(grouped).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));
    } else {
      // Count occurrences
      const counts = {};
      orders.forEach(o => {
        const val = String(o[field] || 'Unknown');
        counts[val] = (counts[val] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }
  }, [config, orders]);

  return (
    <div className="widget-card" style={{ height: '100%' }}>
      <div className="widget-card-header">
        <span className="widget-card-title">{config.title || 'Pie Chart'}</span>
      </div>
      <div className="widget-card-body" style={{ padding: 8 }}>
        {chartData.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="65%"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#d1d5db' }}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
              {config.showLegend && (
                <Legend wrapperStyle={{ fontSize: 12 }} />
              )}
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
