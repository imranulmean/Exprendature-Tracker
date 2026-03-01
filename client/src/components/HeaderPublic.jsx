import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';


export default function HeaderPublic(){

  return(
      <>
        <Navbar fluid className="bg-white border-b border-gray-400 sticky top-0 z-10 print:hidden">
          <Link to="/">
            <img src="/logo.PNG" className="mr-3 h-[50px] w-[50px]" alt="Flowbite React Logo" />
          </Link>
          <Dropdown arrowIcon={true} label="Other Items"
                    class='rounded-md text-sm font-medium text-gray-900 '
          >
            <Dropdown.Item>
                <Link to="/callstream">Call</Link>
            </Dropdown.Item>
            <Dropdown.Item>
                <Link to="/startPractice">Practice</Link>
            </Dropdown.Item>            
          </Dropdown>                    
        </Navbar>      
      </>
  )
    
}