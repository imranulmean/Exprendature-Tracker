import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderPublic from "../components/HeaderPublic";
import { useSearchParams } from 'react-router-dom';
import HeaderLibrary from "../components/HeaderLibrary";
import PaginationButtons from "../components/PaginationButtons";

export default function HadithContent() {

    const {pathname} = useLocation();
    const book_name=pathname.split('/')[2];
    const contentName=`hadith/${book_name}`

    const BASE_API = import.meta.env.VITE_API_BASE_URL;
    const [hadiths, setHadiths] = useState([]);
    const [englishHadiths, setEnglishHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lang, setLang]=useState('bn')
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const LIMIT = 20;

    // ✅ get and set page from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        document.title = 'Islamic Library';
    }, []);    

    useEffect(() => {
        getHadiths();
    }, [page]);

    // Go to users tracked hadith    
    useEffect(() => {
        
        // if (hadiths.length > 0 && location.hash) {
        //     const el = document.getElementById(location.hash.replace('#', ''));
        //     if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // }
        const params = new URLSearchParams(location.search);
        const hadithId = params.get('hadithIndex');
    
        if (hadiths.length > 0 && hadithId) {
            const el = document.getElementById(`hadith-${hadithId}`);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }        
    }, [hadiths]);    

    const getHadiths = async () => {
        try {
            setLoading(true);
            // const res = await fetch(`${BASE_API}/getHadithContent${pathname}?page=${page}&limit=${LIMIT}`);
            const res = await fetch(`https://library.sysnolodge.com.au/apis/getHadithContent.php?bookName=${book_name}&page=${page}&limit=${LIMIT}`);
            const data = await res.json();
            if(!data.success){
                alert(data.message)
                return
            }
            setHadiths(data.message);
            setEnglishHadiths(data.englishHadiths)
            setTotalPages(data.totalPages);
            setTotal(data.total);
        } catch (error) {
            alert(error);            
        } finally {
            setLoading(false);
        }
    };

        // ✅ update URL when page changes
    const changePage = (newPage) => {
        setSearchParams({ page: newPage });
    };

    // save bookmark
    function saveBookmark(index) {
        
        const page = searchParams.get('page');
        const path = page && page > 1 ? `${pathname}?page=${page}&hadithIndex=${index}` : `${pathname}?hadithIndex=${index}`;
        localStorage.setItem('lastHadith', path);
        alert("Bookmarked Saved");
    }    

    function copyLink(index) {
        console.log(index)
        const page = searchParams.get('page');
        const path = page && page > 1 ? `${pathname}?page=${page}&hadithIndex=${index}` : `${pathname}?hadithIndex=${index}`;
        console.log(path);
        const fullUrl = `${window.location.origin}${path}`;

        navigator.clipboard.writeText(fullUrl).then(() => {
            alert("Hadith Link Copied!");
        });        
        
    }    

    return (
        <>
            <HeaderLibrary />

            {loading && (
                <div className="h-screen flex justify-center items-center p-10 bg-[#0C171A] text-gray-200">
                    <p className="text-lg">Fetching Hadiths...</p>
                </div>
            )}

            {!loading && (
                <div className="flex flex-col justify-center items-center bg-[#0C171A] text-gray-200">

                    {/* total count */}
                    <div className="w-full flex justify-around md:justify-center gap-2 mt-4 mb-4">
                        <p className="text-sm text-gray-200 ">
                            {contentName}
                        </p>
                        <p className="text-sm text-gray-200 ">
                            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} 
                        </p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={()=>setLang('bn')}
                            class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                            Bangla
                        </button> 
                        <button onClick={()=>setLang('en')}
                            class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                            English
                        </button>
                        {localStorage.getItem('lastHadith') && (
                            <a
                                href={localStorage.getItem('lastHadith')}
                                className="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                            >
                                📖 Go to Last Read
                            </a>
                        )}                        
                    </div>
                    {/* pagination buttons */}
                        <PaginationButtons page={page} totalPages={totalPages} changePage={changePage} />
                    {/* hadith cards */}
                    <div className="flex gap-4 flex-wrap justify-center p-4">
                        {hadiths.map((item, index) => (
                            <div key={index} id={`hadith-${index+1}`}
                                className="flex flex-col bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs"
                            >
                                {/* title */}
                                <h5 className="mb-3 text-lg font-semibold tracking-tight text-heading">
                                    {
                                        lang=='bn' ? item.title : item.englishTitle
                                    }
                                    <br/>page no:{page}, Hadith:{index+1} 
                                </h5>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={()=>saveBookmark(index+1)}
                                        class="bg-green-900 px-4 py-2 text-white mb-2">
                                        Track Record
                                    </button>
                                    <button onClick={()=>copyLink(index+1)}
                                        class="bg-green-900 px-4 py-2 text-white mb-2">
                                        Copy Link
                                    </button>
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    {/* /////////////////////// */}
                                    {/* arabic text */}
                                    {item.arabicText?.length > 0 && (
                                        <div className="mb-3 p-4 border border-gray-200 rounded-lg text-right md:max-w-md">
                                            {item.arabicText.map((text, i) => (
                                                <p key={i} className="text-2xl leading-loose arabic-text" dir="rtl" lang="ar">
                                                    {text}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    {/* bangla text */}
                                    {lang === 'bn' ? (
                                        item.banglaText?.length > 0 && (
                                            <div className="text-sm text-body leading-relaxed md:max-w-md">
                                                {item.banglaText.map((text, i) => (
                                                    <p key={i} className="mb-2 text-xl">{text}</p>
                                                ))}
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-sm text-body leading-relaxed md:max-w-md">
                                            <p className="mb-2 text-xl">{item.englishText}</p>
                                        </div>
                                    )}
                                    {/* ////////////////////// */}
                                </div>

                            </div>
                            
                        ))}
                    </div>

                    {/* pagination buttons */}
                    <PaginationButtons page={page} totalPages={totalPages} changePage={changePage} />

                </div>
            )}
        </>
    );
}