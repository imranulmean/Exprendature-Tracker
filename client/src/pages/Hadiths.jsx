import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderPublic from "../components/HeaderPublic";
import HeaderLibrary from "../components/HeaderLibrary";
import Banner from "../components/Banner";


export default function Hadiths(){
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const [hadiths, setHadiths]= useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
         document.title = 'Islamic Library';
        getSuras();
    },[])

    const getSuras = async(source)=>{
        try {
            setLoading(true); 
        //    const res= await fetch(`${BASE_API}/getHadits`);
        const res= await fetch(`https://library.sysnolodge.com.au/apis/getHadiths.php`);        
           const data= await res.json();
           setHadiths(data.message)
        } catch (error) {
            alert(error)
        }
        finally{
            setLoading(false); 
        }
    }

    return(
        <>
            <HeaderLibrary />
            <Banner/>    
            {
                loading && <p>Fetcing Hadiths</p>
            }
            {
                !loading && 
                <div className="flex flex-col justify-center items-center">
                    <div className="flex gap-2 flex-wrap justify-center p-4">                    
                        {
                            hadiths.map(item=>{
                                return(
                                    <a class="flex flex-col items-center bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs md:flex-row md:max-w-sm md:flex-row md:max-w-sm">
                                        <div class="flex flex-col justify-between md:p-4 leading-normal">
                                            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-heading">{item.name}</h5>
                                            <div>
                                                <Link to ={item.link} class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                                                    Read more
                                                    <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </a>                            
                                )
                            })
                        }
                    </div>                    
                </div>
                

            }

        </>
    )
}