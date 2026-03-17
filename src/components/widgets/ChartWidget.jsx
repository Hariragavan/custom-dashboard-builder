import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Cell
} from 'recharts';

const FIELD_MAP = {
  'Product': 'product',
  'Quantity': 'quantity',
  'Unit price': 'unit_price',
  'Total amount': 'total_amount',
  'Status': 'status',
  'Created by': 'created_by',
  'Duration': null,
};

const NUMERIC_FIELDS = ['Quantity', 'Unit price', 'Total amount'];

function getFieldValue(order, field) {
  const key = FIELD_MAP[field];
  if (!key) return null;
  return order[key];
}

export default function ChartWidget({ config, orders }) {
  const chartData = useMemo(() => {
    if (!config.xAxis || !config.yAxis || orders.length === 0) return [];

    const xIsNumeric = NUMERIC_FIELDS.includes(config.xAxis);
    const yIsNumeric = NUMERIC_FIELDS.includes(config.yAxis);

    if (xIsNumeric && yIsNumeric) {
      // scatter-style: direct mapping
      return orders.map(o => ({
        x: parseFloat(getFieldValue(o, config.xAxis)) || 0,
        y: parseFloat(getFieldValue(o, config.yAxis)) || 0,
        name: getFieldValue(o, config.xAxis),
      }));
    }

    // Group by x-axis category, aggregate y-axis
    const grouped = {};
    orders.forEach(o => {
      const xVal = String(getFieldValue(o, config.xAxis) || 'Unknown');
      if (!grouped[xVal]) grouped[xVal] = [];
      grouped[xVal].push(parseFloat(getFieldValue(o, config.yAxis)) || 0);
    });

    return Object.entries(grouped).map(([name, values]) => ({
      name,
      value: values.reduce((a, b) => a + b, 0),
    }));
  }, [config, orders]);

  const color = config.chartColor || '#54bd95';

  const renderChart = () => {
    const commonProps = { data: chartData, margin: { top: 10, right: 20, left: 10, bottom: 20 } };

    switch (config.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} label={config.showDataLabels ? { position: 'top', fontSize: 11 } : false} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, r: 4 }} label={config.showDataLabels ? { position: 'top', fontSize: 11 } : false} />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
            <defs>
              <linearGradient id={`gradient-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#gradient-${config.id})`} label={config.showDataLabels ? { position: 'top', fontSize: 11 } : false} />
          </AreaChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="x" name={config.xAxis} tick={{ fontSize: 11 }} />
            <YAxis dataKey="y" name={config.yAxis} tick={{ fontSize: 11 }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
            <Scatter dataKey="y" fill={color}>
              {chartData.map((_, i) => <Cell key={i} fill={color} />)}
            </Scatter>
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="widget-card" style={{ height: '100%' }}>
      <div className="widget-card-header">
        <span className="widget-card-title">{config.title || 'Chart'}</span>
      </div>
      <div className="widget-card-body" style={{ padding: 8 }}>
        {chartData.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
