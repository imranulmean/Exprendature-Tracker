export default function PaginationButtons({page, totalPages, changePage}){
    return(
        <>
            <div className="flex gap-2 items-center pt-2">
                <button
                    onClick={() => changePage(1)}
                    className={`px-2 py-2 text-sm border rounded-base transition-all
                        ${page === 1
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-default hover:bg-neutral-secondary-medium'
                        }`}
                >
                    First Page
                </button>
                <button
                    key={totalPages}
                    onClick={() => changePage(totalPages)}
                    className={`px-2 py-2 text-sm border rounded-base transition-all
                        ${page === totalPages
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-default hover:bg-neutral-secondary-medium'
                        }`}
                >
                    Last Page
                </button>                        
            </div>
            <div className="flex gap-2 items-center p-2">
                <button
                    onClick={() => changePage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-default rounded-base disabled:opacity-40 hover:bg-neutral-secondary-medium transition-all"
                >
                    {'<'}
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {

                    let startPage = Math.max(1, page - 2);

                    // Make sure we show 5 pages when possible
                    if (startPage + 4 > totalPages) {
                        startPage = Math.max(1, totalPages - 4);
                    }

                    const pageNum = startPage + i;

                    if (pageNum > totalPages) {
                        return null;
                    }

                    return (
                        <button
                            key={pageNum}
                            onClick={() => changePage(pageNum)}
                            className={`px-2 py-2 text-sm border rounded-base transition-all
                                ${
                                    page === pageNum
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'border-default hover:bg-neutral-secondary-medium'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                {/* Dots */}
                {totalPages > 5 && page < totalPages - 3 && (
                    <span className="px-2 text-sm text-gray-400">
                        .
                    </span>
                )}

                {/* Last page */}
                {totalPages > 5 && page < totalPages - 2 && (
                    <button
                        onClick={() => changePage(totalPages)}
                        className={`px-2 py-2 text-sm border rounded-base transition-all
                            ${
                                page === totalPages
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
        </>
    )
}