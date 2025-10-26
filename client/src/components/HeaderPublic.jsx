import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';


export default function HeaderPublic(){

  return(
      <>
        <Navbar fluid className="bg-gray-900 border-b border-gray-400 sticky top-0 z-10 print:hidden" 
              style={{'background':"#000"}}>
          <Link to="/">
            <img src="/logo.PNG" style={{'filter': 'invert(1)'}} className="mr-3 h-[50px] w-[50px]" alt="Flowbite React Logo" />
          </Link>
          <Link className="text-lg font-bold leading-none text-gray-900 text-white text-center" to='/startPractice'>Start Practice </Link>
        </Navbar>      
      </>
  )
    
}