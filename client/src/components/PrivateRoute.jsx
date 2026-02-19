import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {  
  const { currentUser } = useSelector((state) => state.user);
  alert(JSON.stringify(currentUser))
  return currentUser ? <Outlet /> : <Navigate to='/login' />;
}
