import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderPublic from "../components/HeaderPublic";
import { useSearchParams } from 'react-router-dom';
import HeaderLibrary from "../components/HeaderLibrary";

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
        console.log('')
        if (hadiths.length > 0 && location.hash) {
            const el = document.getElementById(location.hash.replace('#', ''));
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [hadiths]);    

    const getHadiths = async () => {
        try {
            setLoading(true);
            // const res = await fetch(`${BASE_API}/getHadithContent${pathname}?page=${page}&limit=${LIMIT}`);
            const res = await fetch(`https://pink-coyote-271434.hostingersite.com/apis/getHadithContent.php?bookName=${book_name}&page=${page}&limit=${LIMIT}`);
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
        const path = page && page > 1 ? `${pathname}?page=${page}#hadith-${index}` : `${pathname}#hadith-${index}`;
        localStorage.setItem('lastHadith', path);
        alert("Bookmarked Saved");
    }    

    function copyLink(index) {
        console.log(index)
        const page = searchParams.get('page');
        const path = page && page > 1 ? `${pathname}?page=${page}#hadith-${index}` : `${pathname}#hadith-${index}`;
        const fullUrl = `${window.location.origin}${path}`;

        navigator.clipboard.writeText(fullUrl).then(() => {
            alert("Link Copied!");
        });        
        
    }    

    return (
        <>
            <HeaderLibrary />

            {loading && (
                <div className="flex justify-center items-center p-10">
                    <p className="text-gray-500 text-sm">Fetching Hadiths...</p>
                </div>
            )}

            {!loading && (
                <div className="flex flex-col justify-center items-center">

                    {/* total count */}
                    <div className="w-full flex justify-around md:justify-center gap-2 mt-4 mb-4">
                        <p className="text-sm text-gray-900 ">
                            {contentName}
                        </p>
                        <p className="text-sm text-gray-900 ">
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
                    <div className="flex gap-2 items-center p-6">
                        <button
                            onClick={() => changePage(Math.max(page - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm border border-default rounded-base disabled:opacity-40 hover:bg-neutral-secondary-medium transition-all"
                        >
                            {'<'}
                        </button>

                        {/* page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, page - 2) + i;
                            if (pageNum > totalPages) return null;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => changePage(pageNum)}
                                    className={`px-2 py-2 text-sm border rounded-base transition-all
                                        ${page === pageNum
                                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                                            : 'border-default hover:bg-neutral-secondary-medium'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {/* ... separator — only show if last page is far away */}
                        {page + 3 < totalPages && (
                            <span className="px-2 text-sm text-gray-400">.</span>
                        )}

                        {/* last page button — only show if not already visible in the 5 buttons */}
                        {page + 2 < totalPages && (
                            <button
                                onClick={() => changePage(totalPages)}
                                className={`px-1 py-2 text-sm border rounded-base transition-all
                                    ${page === totalPages
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'border-default hover:bg-neutral-secondary-medium'
                                    }`}
                            >
                                {totalPages}
                            </button>
                        )}

                        {/* Next */}

                        <button
                            onClick={() => changePage(Math.min(page + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm border border-default rounded-base disabled:opacity-40 hover:bg-neutral-secondary-medium transition-all"
                        >
                            {'>'}
                        </button>
                    </div>                    
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
                                        <div className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-lg text-right md:max-w-md">
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
                    <div className="flex gap-2 items-center p-6">
                        <button
                            onClick={() => changePage(Math.max(page - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm border border-default rounded-base disabled:opacity-40 hover:bg-neutral-secondary-medium transition-all"
                        >
                            {'<'}
                        </button>

                        {/* page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, page - 2) + i;
                            if (pageNum > totalPages) return null;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => changePage(pageNum)}
                                    className={`px-2 py-2 text-sm border rounded-base transition-all
                                        ${page === pageNum
                                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                                            : 'border-default hover:bg-neutral-secondary-medium'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {/* ... separator — only show if last page is far away */}
                        {page + 3 < totalPages && (
                            <span className="px-2 text-sm text-gray-400">.</span>
                        )}

                        {/* last page button — only show if not already visible in the 5 buttons */}
                        {page + 2 < totalPages && (
                            <button
                                onClick={() => changePage(totalPages)}
                                className={`px-1 py-2 text-sm border rounded-base transition-all
                                    ${page === totalPages
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'border-default hover:bg-neutral-secondary-medium'
                                    }`}
                            >
                                {totalPages}
                            </button>
                        )}

                        {/* Next */}

                        <button
                            onClick={() => changePage(Math.min(page + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm border border-default rounded-base disabled:opacity-40 hover:bg-neutral-secondary-medium transition-all"
                        >
                            {'>'}
                        </button>
                    </div>

                </div>
            )}
        </>
    );
}