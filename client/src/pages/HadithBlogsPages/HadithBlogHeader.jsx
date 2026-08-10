import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import HadithBlogProtetion from "./HadithBlogProtetion";


export default function HadithBlogHeader(){

    const navigate = useNavigate();
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const location = useLocation();   
    const [menuOpen, setMenuOpen] = useState(false);
    const [hadithBlogUserInfo, setHadithBlogUserInfo]=useState({});

    useState(()=>{
        setHadithBlogUserInfo(JSON.parse(localStorage.getItem('hadithBlogUserInfo')));
    },[])


    const handleSignout=()=>{
        localStorage.removeItem('hadithBlogLoginSession');
        localStorage.removeItem('hadithBlogUserInfo');
        navigate('/hadithBlogLogin');        
    }
    
    return (
   
            <nav className="block bg-cyan-900 sticky top-0 z-50 print:hidden">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-2">
                    <Link to="/getHadithBlogs" className="flex shrink-0 items-center gap-2">
                        <span className="text-white self-center text-xl font-semibold whitespace-nowrap">Islamic Library</span>
                    </Link>
                    <div className="absolute right-2 md:right-5">
                        <Dropdown arrowIcon={false} inline
                                label={
                                    <Avatar alt='user' img={hadithBlogUserInfo?.profilePicture} rounded size="sm" />
                                }
                            >
                                <Dropdown.Header>
                                    <span className="block text-sm">{hadithBlogUserInfo?.displayName}</span>
                                    <span className="block truncate text-sm font-medium">{hadithBlogUserInfo?.email}</span>
                                </Dropdown.Header>

                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleSignout}>Logout</Dropdown.Item>
                        </Dropdown> 
                    </div>
                   
                </div>

                <div className="w-full md:block md:w-auto">
                        <ul className="font-medium flex justify-center gap-2 p-2 border-t  border-default bg-neutral-secondary-soft">
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/getHadithBlogs" 
                                    className={`flex text-center rounded-md px-3 py-1 text-sm font-medium ${(location.pathname.includes('getHadithBlogs')) ? 'text-white border border-white' : 'text-gray-300'}`}>Blogs</Link>
                            </li>                            
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/createHadithBlog" 
                                    className={`flex text-center rounded-md px-3 py-1 text-sm font-medium ${( location.pathname.includes('createHadithBlog')) ? 'text-white border border-white' : 'text-gray-300'}`}>Create</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} 
                                    className={`flex text-center rounded-md px-3 py-1 text-sm font-medium ${(location.pathname.includes('updateHadithBlog')) ? 'text-white border border-white' : 'text-gray-300 '}`}>Update</Link>
                            </li>
                        </ul>
                    </div>                
            </nav>
        
      ); 
}