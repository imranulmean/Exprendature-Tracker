import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import AdminDrawer from "./AdminDrawer";

export default function Header(){
    
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const handleSignout = async () => {
        try {
          const res = await fetch(`${BASE_API}/api/auth/signout`, {
            method: 'POST',
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            dispatch(signoutSuccess());
          }
        } catch (error) {
          console.log(error.message);
        }
      };    
    
    return (
        <Navbar fluid className="bg-gray-900 border-b border-gray-400 sticky top-0 z-10" 
              style={{'background':"#000"}}>
          <Link to="/">
            <img src="/logo.PNG" style={{'filter': 'invert(1)'}} className="mr-3 h-[50px] w-[50px]" alt="Flowbite React Logo" />
          </Link>
          <Link className="text-lg font-bold leading-none text-gray-900 text-white" to='/'>Home</Link>
          <Link className="text-lg font-bold leading-none text-gray-900 text-white" to='/insertion'>Insertion</Link>
          <div className="flex md:order-2 gap-2">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt='user' img={currentUser.profilePicture} rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{currentUser.displayName}</span>
                <span className="block truncate text-sm font-medium">{currentUser.email}</span>
              </Dropdown.Header>
              {/* <Dropdown.Item>Dashboard</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Earnings</Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Logout</Dropdown.Item>
            </Dropdown>
            {
              currentUser.isAdmin &&
              <AdminDrawer />
            }
            {/* <Navbar.Toggle /> */}
          </div>          

          {/* <Navbar.Collapse>
            <Navbar.Link active as={'div'}>
              <Link to='/'>Home</Link>
            </Navbar.Link>
            <Navbar.Link as={'div'}>
              <Link to='/insertion'>Insertion</Link>
            </Navbar.Link>
          </Navbar.Collapse> */}
        </Navbar>
      ); 
}