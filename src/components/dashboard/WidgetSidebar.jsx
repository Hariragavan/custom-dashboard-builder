import { useState } from 'react';
import {
  BarChart3, LineChart, PieChart, AreaChart, ScatterChart,
  Table2, Hash, ChevronDown, ChevronRight, GripVertical
} from 'lucide-react';

const WIDGET_SECTIONS = [
  {
    title: 'Charts',
    items: [
      { type: 'bar', label: 'Bar Chart', icon: BarChart3 },
      { type: 'line', label: 'Line Chart', icon: LineChart },
      { type: 'pie', label: 'Pie Chart', icon: PieChart },
      { type: 'area', label: 'Area Chart', icon: AreaChart },
      { type: 'scatter', label: 'Scatter Plot', icon: ScatterChart },
    ]
  },
  {
    title: 'Tables',
    items: [
      { type: 'table', label: 'Table', icon: Table2 },
    ]
  },
  {
    title: 'KPIs',
    items: [
      { type: 'kpi', label: 'KPI Value', icon: Hash },
    ]
  },
];

export default function WidgetSidebar({ onAddWidget }) {
  const [expanded, setExpanded] = useState({ Charts: true, Tables: true, KPIs: true });

  const toggleSection = (title) => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('widgetType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="widget-library">
      <div className="widget-library-title">Widget Library</div>
      {WIDGET_SECTIONS.map(section => (
        <div key={section.title} className="widget-library-section">
          <div className="widget-library-section-title" onClick={() => toggleSection(section.title)}>
            {expanded[section.title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {section.title}
          </div>
          {expanded[section.title] && section.items.map(item => (
            <div
              key={item.type}
              className="widget-library-item"
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              onClick={() => onAddWidget(item.type)}
            >
              <GripVertical size={14} style={{ color: 'var(--text-muted)' }} />
              <item.icon size={16} />
              {item.label}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
