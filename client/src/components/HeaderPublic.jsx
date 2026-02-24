import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';


export default function HeaderPublic(){

  return(
      <>
        <Navbar fluid className="bg-white border-b border-gray-400 sticky top-0 z-10 print:hidden">
          <Link to="/">
            <img src="/logo.PNG" className="mr-3 h-[50px] w-[50px]" alt="Flowbite React Logo" />
          </Link>          
        </Navbar>      
      </>
  )
    
}