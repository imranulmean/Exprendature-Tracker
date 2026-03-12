import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";


export default function HeaderNews(){

    const navigate = useNavigate();
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const location = useLocation();   
    const [menuOpen, setMenuOpen] = useState(false);
           
    return (
        <>
            {/* <nav class="relative bg-black sticky top-0 z-10 print:hidden">
                <div class="w-full px-2 sm:px-6 lg:px-8">
                    <div class="relative flex h-16 items-center justify-between">
                        <div class="flex flex-1 items-center justify-between sm:items-stretch">
                            <div class="flex shrink-0 items-center gap-2">
                                <Link to="/news" class="flex shrink-0 items-center gap-2">
                                    <span class="text-white self-center text-xl text-heading font-semibold whitespace-nowrap">The Newser</span>
                                </Link>
                                
                            </div>
                            <div class="sm:ml-6 sm:block">
                                <div class="flex space-x-4">
                                    <Link to="/news/aljazeera" class={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname==='/news/aljazeera'|| location.pathname==='/' ? 'text-white bg-white/5' : 'text-gray-300 hover:bg-white/5 hover:text-white'} `}>Al Jajera</Link>
                                    <Link to="/news/bbc" class={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname==='/news/bbc'? 'text-white bg-white/5' : 'text-gray-300 hover:bg-white/5 hover:text-white'} `}>BBC</Link>
                                    <Link to="/news/cnn" class={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname==='/news/cnn'? 'text-white bg-white/5' : 'text-gray-300 hover:bg-white/5 hover:text-white'} `}>CNN</Link>
                                    <Link to="/news/guardian" class={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname==='/news/guardian'? 'text-white bg-white/5' : 'text-gray-300 hover:bg-white/5 hover:text-white'} `}>The Guardian</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav> */}
            <nav className="relative bg-black sticky top-0 z-10 print:hidden">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/news" className="flex shrink-0 items-center gap-2">
                        <span className="text-white self-center text-xl font-semibold whitespace-nowrap">The Newser</span>
                    </Link>

                    {/* Hamburger Button */}
                    <button onClick={() => setMenuOpen(!menuOpen)} type="button"
                        className="bg-white inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-base md:hidden"
                    >
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                        </svg>
                    </button>

                    {/* Menu */}
                    <div className={`${menuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}>
                        <ul className="font-medium flex flex-col gap-2 p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/news/aljazeera" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/news/aljazeera' ? 'text-white border border-white ' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Al Jazeera</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/news/bbc" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/news/bbc' ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>BBC</Link>
                            </li>
                            <li>
                                 <Link onClick={() => setMenuOpen(false)} to="/news/cnn" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/news/cnn' ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>CNN</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/news/guardian" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname === '/news/guardian' ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>The Guardian</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
        
      ); 
}