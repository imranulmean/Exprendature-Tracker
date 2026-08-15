import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import HadithBlogProtetion from "./HadithBlogProtetion";


export const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(payload)
        if (!payload.exp) {
            return true;
        }

        return Date.now() >= payload.exp * 1000;
    } catch (error) {
        return true;
    }
};  

export default function HadithBlogHeader(){

    const navigate = useNavigate();
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const location = useLocation();   
    const [menuOpen, setMenuOpen] = useState(false);
    const [hadithBlogUserInfo, setHadithBlogUserInfo]=useState({});
    const hadithBlogLoginSession= localStorage.getItem('hadithBlogLoginSession');
  
    const hadithBlogValidateUser= async() =>{
        try {
            const res= await fetch(`${BASE_API}/api/auth/hadithBlogValidateUser`,{
                method:"GET",
                headers: {
                    "authorization": hadithBlogLoginSession, 
                    "Content-Type": "application/json"
                },
            })
            const data= await res.json();
            if(!data.success){                    
                localStorage.removeItem('hadithBlogLoginSession');
                localStorage.removeItem('hadithBlogUserInfo');
                setHadithBlogUserInfo('');
            }                

        } catch (error) {
            alert(error)
        }
    }    
  

    useState(()=>{

        const hadith_blog_user_info= localStorage.getItem('hadithBlogUserInfo');
        setHadithBlogUserInfo(JSON.parse(hadith_blog_user_info));

        if(isTokenExpired(hadithBlogLoginSession)){
            hadithBlogValidateUser();
        }
     
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
                    {
                        hadithBlogUserInfo ?

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
                        :
                        <Link to='/hadithBlogLogin' className="absolute right-3 text-white text-sm py-1 px-2 rounded-md border border-default">Login</Link>

                    }

                   
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