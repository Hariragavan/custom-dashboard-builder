import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart } from 'lucide-react';

export default function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">DB</div>
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            <span className="sidebar-tooltip">Dashboard</span>
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            <span className="sidebar-tooltip">Customer Orders</span>
          </NavLink>
        </nav>
      </aside>
      <nav className="mobile-bottom-nav">
        <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          <ShoppingCart size={20} />
          <span>Orders</span>
        </NavLink>
      </nav>
    </>
  );
}
