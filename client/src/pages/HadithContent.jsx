import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderPublic from "../components/HeaderPublic";
import { useSearchParams } from 'react-router-dom';
import HeaderLibrary from "../components/HeaderLibrary";

export default function HadithContent() {

    const {pathname} = useLocation();
    console.log(pathname)

    const BASE_API = import.meta.env.VITE_API_BASE_URL;
    const [hadiths, setHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const LIMIT = 20;

        // ✅ get and set page from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        getHadiths();
    }, [page]);

    const getHadiths = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_API}/getHadithContent${pathname}?page=${page}&limit=${LIMIT}`);
            const data = await res.json();
            if(!data.success){
                alert(data.message)
                return
            }
            setHadiths(data.message);
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
                    <p className="text-sm text-gray-400 mt-4">
                        Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} Hadiths
                    </p>

                    {/* hadith cards */}
                    <div className="flex gap-4 flex-wrap justify-center p-4">
                        {hadiths.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs max-w-sm"
                            >
                                {/* title */}
                                <h5 className="mb-3 text-lg font-semibold tracking-tight text-heading">
                                    {item.title}
                                </h5>

                                {/* arabic text */}
                                {item.arabicText?.length > 0 && (
                                    <div className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-lg text-right">
                                        {item.arabicText.map((text, i) => (
                                            <p key={i} className="text-3xl leading-loose arabic-text" dir="rtl" lang="ar">
                                                {text}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* bangla text */}
                                {item.banglaText?.length > 0 && (
                                    <div className="text-sm text-body leading-relaxed">
                                        {item.banglaText.map((text, i) => (
                                            <p key={i} className="mb-2">{text}</p>
                                        ))}
                                    </div>
                                )}
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