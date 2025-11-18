import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { logout, isTokenExpired } from "../../redux/authSlice";
import { useEffect } from "react";

const UserPrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (token && isTokenExpired()) {
      dispatch(logout());
    }
  }, [token, dispatch]);

  if (!user || !token || isTokenExpired()) {
    return <Navigate to="/customer-login" replace state={{ from: location }} />;
  }

  return children;
};

export default UserPrivateRoute;
