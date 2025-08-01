import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
      <Link to="/">Home</Link>
      <Link to="/blogs">Blogs</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
}
