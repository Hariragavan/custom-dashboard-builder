import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const METRIC_OPTIONS = [
  'Customer ID', 'Customer name', 'Email id', 'Address', 'Order date',
  'Product', 'Created by', 'Status', 'Total amount', 'Unit price', 'Quantity'
];

const NUMERIC_METRICS = ['Total amount', 'Unit price', 'Quantity', 'Customer ID'];

const AGGREGATIONS = ['Sum', 'Average', 'Count'];
const DATA_FORMATS = ['Number', 'Currency'];

const CHART_AXIS_OPTIONS = ['Product', 'Quantity', 'Unit price', 'Total amount', 'Status', 'Created by', 'Duration'];
const PIE_DATA_OPTIONS = ['Product', 'Quantity', 'Unit price', 'Total amount', 'Status', 'Created by'];

const TABLE_COLUMNS = [
  'Customer ID', 'Customer name', 'Email id', 'Phone number', 'Address',
  'Order ID', 'Order date', 'Product', 'Quantity', 'Unit price',
  'Total amount', 'Status', 'Created by'
];

const WIDGET_TYPE_LABELS = {
  kpi: 'KPI', bar: 'Bar Chart', line: 'Line Chart',
  pie: 'Pie Chart', area: 'Area Chart', scatter: 'Scatter Plot', table: 'Table',
};

export default function WidgetSettingsDrawer({ widget, onSave, onClose }) {
  const [config, setConfig] = useState({ ...widget });
  const [columnsOpen, setColumnsOpen] = useState(false);

  useEffect(() => { setConfig({ ...widget }); }, [widget]);

  const update = (field, value) => setConfig(prev => ({ ...prev, [field]: value }));

  const isNonNumeric = config.metric && !NUMERIC_METRICS.includes(config.metric);

  const handleSave = () => {
    onSave(config);
  };

  const toggleColumn = (col) => {
    const cols = config.columns || [];
    if (cols.includes(col)) {
      update('columns', cols.filter(c => c !== col));
    } else {
      update('columns', [...cols, col]);
    }
  };

  return (
    <>
      <div className="settings-drawer-overlay" onClick={onClose} />
      <div className="settings-drawer">
        <div className="settings-drawer-header">
          <h3>Widget Settings</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        <div className="settings-drawer-body">
          {/* Common fields */}
          <div className="form-group">
            <label className="form-label">Widget title <span className="required">*</span></label>
            <input className="form-input" value={config.title} onChange={e => update('title', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Widget type</label>
            <input className="form-input" value={WIDGET_TYPE_LABELS[config.type]} readOnly style={{ background: '#f9fafb' }} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} value={config.description || ''} onChange={e => update('description', e.target.value)} placeholder="Enter description" />
          </div>

          {/* Widget Size */}
          <div className="settings-section">
            <div className="settings-section-title">Widget Size</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Width (Columns) <span className="required">*</span></label>
                <input className="form-input" type="number" min="1" max="12" value={config.w} onChange={e => update('w', Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
              <div className="form-group">
                <label className="form-label">Height (Rows) <span className="required">*</span></label>
                <input className="form-input" type="number" min="1" value={config.h} onChange={e => update('h', Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
            </div>
          </div>

          {/* KPI specific */}
          {config.type === 'kpi' && (
            <div className="settings-section">
              <div className="settings-section-title">Data Settings</div>
              <div className="form-group">
                <label className="form-label">Select metric <span className="required">*</span></label>
                <select className="form-select" value={config.metric} onChange={e => {
                  update('metric', e.target.value);
                  if (!NUMERIC_METRICS.includes(e.target.value)) {
                    update('aggregation', 'Count');
                  }
                }}>
                  <option value="">Select metric</option>
                  {METRIC_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Aggregation <span className="required">*</span></label>
                <select className="form-select" value={config.aggregation} onChange={e => update('aggregation', e.target.value)} disabled={isNonNumeric}>
                  {AGGREGATIONS.map(a => <option key={a} value={a} disabled={isNonNumeric && a !== 'Count'}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Data format <span className="required">*</span></label>
                <select className="form-select" value={config.dataFormat} onChange={e => update('dataFormat', e.target.value)}>
                  {DATA_FORMATS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Decimal precision <span className="required">*</span></label>
                <input className="form-input" type="number" min="0" value={config.decimalPrecision} onChange={e => update('decimalPrecision', Math.max(0, parseInt(e.target.value) || 0))} />
              </div>
            </div>
          )}

          {/* Chart specific (bar, line, area, scatter) */}
          {['bar', 'line', 'area', 'scatter'].includes(config.type) && (
            <>
              <div className="settings-section">
                <div className="settings-section-title">Data Settings</div>
                <div className="form-group">
                  <label className="form-label">Choose X-Axis data <span className="required">*</span></label>
                  <select className="form-select" value={config.xAxis} onChange={e => update('xAxis', e.target.value)}>
                    <option value="">Select X-Axis</option>
                    {CHART_AXIS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Choose Y-Axis data <span className="required">*</span></label>
                  <select className="form-select" value={config.yAxis} onChange={e => update('yAxis', e.target.value)}>
                    <option value="">Select Y-Axis</option>
                    {CHART_AXIS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <div className="settings-section-title">Styling</div>
                <div className="form-group">
                  <label className="form-label">Chart color</label>
                  <div className="color-picker-wrapper">
                    <input type="color" value={config.chartColor || '#54bd95'} onChange={e => update('chartColor', e.target.value)} className="color-preview" />
                    <input className="form-input" value={config.chartColor || '#54bd95'} onChange={e => update('chartColor', e.target.value)} style={{ flex: 1 }} placeholder="#54bd95" />
                  </div>
                </div>
                <div className="checkbox-wrapper">
                  <input type="checkbox" id="showDataLabels" checked={config.showDataLabels || false} onChange={e => update('showDataLabels', e.target.checked)} />
                  <label htmlFor="showDataLabels">Show data labels</label>
                </div>
              </div>
            </>
          )}

          {/* Pie chart specific */}
          {config.type === 'pie' && (
            <>
              <div className="settings-section">
                <div className="settings-section-title">Data Settings</div>
                <div className="form-group">
                  <label className="form-label">Choose chart data <span className="required">*</span></label>
                  <select className="form-select" value={config.chartData} onChange={e => update('chartData', e.target.value)}>
                    <option value="">Select data</option>
                    {PIE_DATA_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="checkbox-wrapper" style={{ marginTop: 8 }}>
                  <input type="checkbox" id="showLegend" checked={config.showLegend || false} onChange={e => update('showLegend', e.target.checked)} />
                  <label htmlFor="showLegend">Show legend</label>
                </div>
              </div>
            </>
          )}

          {/* Table specific */}
          {config.type === 'table' && (
            <>
              <div className="settings-section">
                <div className="settings-section-title">Data Settings</div>
                <div className="form-group">
                  <label className="form-label">Choose columns <span className="required">*</span></label>
                  <div className="multiselect-container">
                    <div className="multiselect-trigger" onClick={() => setColumnsOpen(!columnsOpen)}>
                      {(config.columns || []).length === 0 ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Select columns</span>
                      ) : (
                        (config.columns || []).map(col => (
                          <span key={col} className="multiselect-tag">
                            {col}
                            <button onClick={(e) => { e.stopPropagation(); toggleColumn(col); }}>×</button>
                          </span>
                        ))
                      )}
                    </div>
                    {columnsOpen && (
                      <div className="multiselect-dropdown">
                        {TABLE_COLUMNS.map(col => (
                          <label key={col} className="multiselect-option">
                            <input type="checkbox" checked={(config.columns || []).includes(col)} onChange={() => toggleColumn(col)} />
                            {col}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Sort by</label>
                  <select className="form-select" value={config.sortBy || ''} onChange={e => update('sortBy', e.target.value)}>
                    <option value="">None</option>
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                    <option value="Order date">Order date</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pagination</label>
                  <select className="form-select" value={config.pagination || 10} onChange={e => update('pagination', parseInt(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                </div>
                <div className="checkbox-wrapper" style={{ marginBottom: 16 }}>
                  <input type="checkbox" id="applyFilter" checked={config.applyFilter || false} onChange={e => update('applyFilter', e.target.checked)} />
                  <label htmlFor="applyFilter">Apply filter</label>
                </div>
              </div>
              <div className="settings-section">
                <div className="settings-section-title">Styling</div>
                <div className="form-group">
                  <label className="form-label">Font size</label>
                  <input className="form-input" type="number" min="12" max="18" value={config.fontSize || 14} onChange={e => {
                    const val = parseInt(e.target.value) || 14;
                    update('fontSize', Math.min(18, Math.max(12, val)));
                  }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Header background</label>
                  <div className="color-picker-wrapper">
                    <input type="color" value={config.headerBackground || '#54bd95'} onChange={e => update('headerBackground', e.target.value)} className="color-preview" />
                    <input className="form-input" value={config.headerBackground || '#54bd95'} onChange={e => update('headerBackground', e.target.value)} style={{ flex: 1 }} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="settings-drawer-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Apply</button>
        </div>
      </div>
    </>
  );
}
