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
        <Navbar fluid className="bg-white border-b border-gray-400 sticky top-0 z-10 print:hidden">
          <Link to="/">
            <img src="/logo.PNG" className="mr-3 h-[50px] w-[50px]" alt="Flowbite React Logo" />
          </Link>
          {/* <Link className="text-sm font-medium leading-none text-gray-900 text-white text-center" to='/insertion'> Add/Edit <br/> Expense</Link>
          <Link className="text-sm font-medium leading-none text-gray-900 text-white text-center" to='/income'> Add/Edit <br/> Income</Link>         */}
          <Link className="text-sm font-medium leading-none text-gray-900 text-white text-center" to='/startPractice'> Practice</Link>
          <Dropdown arrowIcon={true} label="Other Items"
                    class='rounded-md text-sm font-medium text-gray-900 '
          >
            <Dropdown.Item>
                <Link to="/callstream">Call</Link>
            </Dropdown.Item>
            <Dropdown.Item>
                <Link to="/chat">Chat</Link>
            </Dropdown.Item>              
            <Dropdown.Item>
                <Link to="/startPractice">Practice</Link>
            </Dropdown.Item>
            <Dropdown.Item>
                <Link to="/tasks">Tasks</Link>
            </Dropdown.Item>            
          </Dropdown>           
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
          </div>          
        </Navbar>
      ); 
}