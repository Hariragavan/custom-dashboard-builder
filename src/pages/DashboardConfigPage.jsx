import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Sparkles } from 'lucide-react';
import WidgetSidebar from '../components/dashboard/WidgetSidebar';
import CanvasGrid from '../components/dashboard/CanvasGrid';
import WidgetSettingsDrawer from '../components/dashboard/WidgetSettingsDrawer';
import ConfirmDialog from '../components/ConfirmDialog';
import { getDashboardLayout, saveDashboardLayout } from '../services/api';

const DEFAULT_CONFIGS = {
  kpi: { title: 'Untitled', type: 'kpi', description: '', w: 2, h: 2, metric: '', aggregation: 'Count', dataFormat: 'Number', decimalPrecision: 0 },
  bar: { title: 'Untitled', type: 'bar', description: '', w: 5, h: 5, xAxis: '', yAxis: '', chartColor: '#54bd95', showDataLabels: false },
  line: { title: 'Untitled', type: 'line', description: '', w: 5, h: 5, xAxis: '', yAxis: '', chartColor: '#3b82f6', showDataLabels: false },
  area: { title: 'Untitled', type: 'area', description: '', w: 5, h: 5, xAxis: '', yAxis: '', chartColor: '#8b5cf6', showDataLabels: false },
  scatter: { title: 'Untitled', type: 'scatter', description: '', w: 5, h: 5, xAxis: '', yAxis: '', chartColor: '#f59e0b', showDataLabels: false },
  pie: { title: 'Untitled', type: 'pie', description: '', w: 4, h: 4, chartData: '', showLegend: true },
  table: { title: 'Untitled', type: 'table', description: '', w: 4, h: 4, columns: [], sortBy: '', pagination: 10, applyFilter: false, fontSize: 14, headerBackground: '#54bd95' },
};

export default function DashboardConfigPage() {
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [] });
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [deleteWidget, setDeleteWidget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardLayout();
        const lj = data.layout_json || data;
        if (lj.widgets && lj.widgets.length > 0) {
          // Ensure every widget has w and h from its type defaults
          const sanitizedWidgets = lj.widgets.map(w => ({
            ...w,
            w: typeof w.w === 'number' ? w.w : (DEFAULT_CONFIGS[w.type]?.w || 3),
            h: typeof w.h === 'number' ? w.h : (DEFAULT_CONFIGS[w.type]?.h || 3),
          }));
          setWidgets(sanitizedWidgets);

          // Sanitize layout items: react-grid-layout needs numeric w, h, x, y
          const rawLayouts = lj.layouts || { lg: [] };
          const sanitizedLayouts = {};
          for (const [bp, items] of Object.entries(rawLayouts)) {
            sanitizedLayouts[bp] = (items || []).map(item => {
              const widget = sanitizedWidgets.find(w => w.id === item.i);
              return {
                ...item,
                w: typeof item.w === 'number' ? item.w : (widget?.w || 3),
                h: typeof item.h === 'number' ? item.h : (widget?.h || 3),
                x: typeof item.x === 'number' ? item.x : 0,
                y: typeof item.y === 'number' ? item.y : 0,
              };
            });
          }
          setLayouts(sanitizedLayouts);
        }
      } catch (err) {
        console.error('Failed to load layout:', err);
      }
    };
    load();
  }, []);

  const handleDrop = (widgetType) => {
    const id = `widget-${Date.now()}`;
    const config = { ...DEFAULT_CONFIGS[widgetType], id };
    const newLayoutItem = {
      i: id,
      x: (widgets.length * 2) % 12,
      y: Infinity,
      w: config.w,
      h: config.h,
      minW: 1,
      minH: 1,
    };

    setWidgets(prev => [...prev, config]);
    setLayouts(prev => ({
      ...prev,
      lg: [...(prev.lg || []), newLayoutItem]
    }));
  };

  const handleLayoutChange = useCallback((layout, allLayouts) => {
    setLayouts(allLayouts);
  }, []);

  const handleSettings = (widget) => {
    setSelectedWidget(widget);
  };

  const handleUpdateWidget = (updatedWidget) => {
    setWidgets(prev => prev.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    // update layout sizes
    setLayouts(prev => {
      const newLayouts = { ...prev };
      Object.keys(newLayouts).forEach(bp => {
        newLayouts[bp] = (newLayouts[bp] || []).map(l =>
          l.i === updatedWidget.id ? { ...l, w: updatedWidget.w, h: updatedWidget.h } : l
        );
      });
      return newLayouts;
    });
    setSelectedWidget(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteWidget) return;
    setWidgets(prev => prev.filter(w => w.id !== deleteWidget.id));
    setLayouts(prev => {
      const newLayouts = { ...prev };
      Object.keys(newLayouts).forEach(bp => {
        newLayouts[bp] = (newLayouts[bp] || []).filter(l => l.i !== deleteWidget.id);
      });
      return newLayouts;
    });
    setDeleteWidget(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveDashboardLayout({ widgets, layouts });
      navigate('/');
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAutoAlign = () => {
    // 1. Sort widgets by type: KPIs first, then Charts, then Tables
    const typeOrder = { kpi: 0, bar: 1, line: 1, area: 1, pie: 1, scatter: 1, table: 2 };
    const sortedWidgets = [...widgets].sort((a, b) => (typeOrder[a.type] ?? 1) - (typeOrder[b.type] ?? 1));

    // 2. Pack them into the 12-column Grid
    const newLgLayout = [];
    let currentX = 0;
    let currentY = 0;
    let maxRowHeight = 0;

    sortedWidgets.forEach((widget) => {
      const w = typeof widget.w === 'number' ? widget.w : (DEFAULT_CONFIGS[widget.type]?.w || 3);
      const h = typeof widget.h === 'number' ? widget.h : (DEFAULT_CONFIGS[widget.type]?.h || 3);

      // If it doesn't fit on this row, wrap to the next
      if (currentX + w > 12) {
        currentX = 0;
        currentY += maxRowHeight;
        maxRowHeight = 0; // reset for new row
      }

      newLgLayout.push({
        i: widget.id,
        x: currentX,
        y: currentY,
        w,
        h,
        minW: 1,
        minH: 1,
      });

      currentX += w;
      maxRowHeight = Math.max(maxRowHeight, h);
    });

    setLayouts(prev => ({ ...prev, lg: newLgLayout }));
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Configure Dashboard</h1>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleAutoAlign} id="auto-align-btn">
            <Sparkles size={16} />
            Auto Align
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="save-config-btn">
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </header>
      <div className="config-layout" style={{ height: 'calc(100vh - 73px)' }}>
        <WidgetSidebar onAddWidget={handleDrop} />
        <CanvasGrid
          widgets={widgets}
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          onSettings={handleSettings}
          onDelete={setDeleteWidget}
        />
      </div>

      {selectedWidget && (
        <WidgetSettingsDrawer
          widget={selectedWidget}
          onSave={handleUpdateWidget}
          onClose={() => setSelectedWidget(null)}
        />
      )}

      {deleteWidget && (
        <ConfirmDialog
          title="Delete Widget"
          message={`Are you sure you want to delete "${deleteWidget.title}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteWidget(null)}
        />
      )}
    </>
  );
}
