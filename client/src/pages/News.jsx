import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderNews from "../components/HeaderNews";



export default function News(){

    const location = useLocation();
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const [news, setNews]= useState([]);
    const [loading, setLoading] = useState(false);
    const [mainSource, setMainSource]= useState('');

    useEffect(()=>{
        const source=location.pathname.split('/')
        if(!source[2]){
            getNews('aljazeera');
        }
        else{
            getNews(source[2]);
        }
    },[location.pathname])

    useEffect(() => {
        document.title = 'World News';
    }, []);       

    const getNews = async(source)=>{
        try {
            setLoading(true); 
           const res= await fetch(`${BASE_API}/getNews/${source}`);
           const data= await res.json();
           setNews(data.message)
           setMainSource(data.mainSource)
        } catch (error) {
            alert(error)
        }
        finally{
            setLoading(false); 
        }
    }

    return(
        <>
            <HeaderNews />
            {
                loading && <p>Fetcing News</p>
            }
            {
                !loading && 
                <div className="flex flex-col justify-center items-center">
                    <h5 class="p-2 text-2xl font-bold tracking-tight text-heading">{mainSource}</h5>
                    <div className="flex gap-2 flex-wrap justify-center p-4">                    
                        {
                            news.map(item=>{
                                return(
                                    <a class="flex flex-col items-center bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs md:flex-row md:max-w-xl md:flex-row md:max-w-xl">
                                        <img class="object-cover w-full rounded-base h-64 md:h-auto md:w-48 mb-4 md:mb-0" src={item.image} alt=""/>
                                        <div class="flex flex-col justify-between md:p-4 leading-normal">
                                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-heading">{item.title}</h5>
                                            <p class="mb-6 text-body">{item.contentSnippet}</p>
                                            <div>
                                                <a href={item.link} class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                                                    Read more
                                                    <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                                                </a>
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