import { useMemo } from 'react';
import ReactGridLayout from 'react-grid-layout';
import { Settings, Trash2 } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = ReactGridLayout.WidthProvider(ReactGridLayout.Responsive);

export default function CanvasGrid({ widgets, layouts, onLayoutChange, onSettings, onDelete }) {
  const memoizedLayouts = useMemo(() => layouts, [layouts]);

  return (
    <div className="canvas-area">
      {widgets.length === 0 ? (
        <div className="empty-state" style={{ padding: '120px 20px' }}>
          <div className="empty-state-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h3>Drag widgets here</h3>
          <p>Select widgets from the library on the left to build your dashboard</p>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={memoizedLayouts}
          breakpoints={{ lg: 1200, md: 768, sm: 0 }}
          cols={{ lg: 12, md: 8, sm: 4 }}
          rowHeight={60}
          onLayoutChange={onLayoutChange}
          isDraggable
          isResizable
          draggableCancel=".widget-action-btn"
          compactType="vertical"
          margin={[16, 16]}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="widget-card">
              <div className="widget-card-header">
                <span className="widget-card-title">{widget.title || 'Untitled'}</span>
                <div className="widget-actions" style={{ opacity: 1 }}>
                  <button
                    className="widget-action-btn"
                    onClick={() => onSettings(widget)}
                    title="Settings"
                  >
                    <Settings size={14} />
                  </button>
                  <button
                    className="widget-action-btn delete"
                    onClick={() => onDelete(widget)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="widget-card-body">
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  <div style={{ marginBottom: 4, fontSize: 24 }}>
                    {getWidgetIcon(widget.type)}
                  </div>
                  <div style={{ fontWeight: 500 }}>{getWidgetLabel(widget.type)}</div>
                  {widget.description && (
                    <div style={{ fontSize: 11, marginTop: 4 }}>{widget.description}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}

function getWidgetIcon(type) {
  const icons = { kpi: '📊', bar: '📊', line: '📈', pie: '🥧', area: '📉', scatter: '🔵', table: '📋' };
  return icons[type] || '📊';
}

function getWidgetLabel(type) {
  const labels = { kpi: 'KPI Card', bar: 'Bar Chart', line: 'Line Chart', pie: 'Pie Chart', area: 'Area Chart', scatter: 'Scatter Plot', table: 'Table' };
  return labels[type] || type;
}
