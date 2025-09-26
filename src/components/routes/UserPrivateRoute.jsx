import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserPrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? children : <Navigate to="/customer-login" replace />;
};

export default UserPrivateRoute;
