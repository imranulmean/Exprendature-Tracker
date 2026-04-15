import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";


export default function HeaderLibrary(){

    const navigate = useNavigate();
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const location = useLocation();   
    const [menuOpen, setMenuOpen] = useState(false);
           
    return (
        <>
            <nav className="hidden md:block bg-green-900 sticky top-0 z-10 print:hidden">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex shrink-0 items-center gap-2">
                        <span className="text-white self-center text-xl font-semibold whitespace-nowrap">Islamic Library</span>
                    </Link>

                    {/* Menu */}
                    <div className={`w-full md:block md:w-auto`}>
                        <ul className="font-medium flex flex-col gap-2 p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/hadiths" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${(location.pathname === '/hadiths' || location.pathname === '/') ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Hadiths</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/suras" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/suras' ? 'text-white border border-white ' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Surah</Link>
                            </li>                            
                            <li>
                                 <Link onClick={() => setMenuOpen(false)} to="/news" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/news' ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>World News</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mobile Header */}
            
            <nav className="block md:hidden bg-green-900 sticky top-0 z-10 print:hidden">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-2">
                    <Link to="/" className="flex shrink-0 items-center gap-2">
                        <span className="text-white self-center text-xl font-semibold whitespace-nowrap">Islamic Library</span>
                    </Link>
                    {/* Hamburger Button */}
                    {/* <button onClick={() => setMenuOpen(!menuOpen)} type="button"
                        className="bg-white inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-base md:hidden"
                    >
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                        </svg>
                    </button> 
                    <div className={`${menuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}>
                        <ul className="font-medium flex flex-col gap-2 p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/suras" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/suras' ? 'text-white border border-white ' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Surah</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/hadiths" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/hadiths' ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Hadiths</Link>
                            </li>
                            <li>
                                    <Link onClick={() => setMenuOpen(false)} to="/news" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/news' ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>World News</Link>
                            </li>
                        </ul>
                    </div>  */}
                    {/* Hamburger Button End*/}
                </div>

                <div className="w-full md:block md:w-auto">
                        <ul className="font-medium flex justify-center gap-2 p-4 border border-default rounded-base bg-neutral-secondary-soft">
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/hadiths" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/hadiths' ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Hadiths</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/suras" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/suras' ? 'text-white border border-white ' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Surah</Link>
                            </li>
                            <li>
                                 <Link onClick={() => setMenuOpen(false)} to="/news" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/news' ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>World News</Link>
                            </li>
                        </ul>
                    </div>                
            </nav>              
        </>
        
      ); 
}