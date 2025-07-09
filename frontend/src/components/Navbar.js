import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isGameRoute = location.pathname === "/game";

  if (isGameRoute) return null;

  return (
    <nav>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </nav>
  );
}
export default Navbar;
