import { Link } from "react-router-dom";

export default function Banner(){
    return(
        <>
            <div className="w-full">
                {/* Container with relative positioning to hold the text overlay */}
                <div className="flex flex-col relative z-1 h-[50vh] md:h-[70vh] bg-[url('/islamic-logo.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
                    
                    {/* Dark Overlay - ensures text is readable regardless of the image brightness */}
                    <div className="absolute inset-0 bg-[#00000080]"></div>

                    {/* Text Content */}
                    <div className="relative z-10 text-center px-4">
                        <h1 className="mb-4 text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                            Explore the Beauty of the Quran
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 font-medium max-w-2xl mx-auto">
                            Discover profound wisdom and guidance through authentic narrations and verses.
                        </p>
                    </div>

                    <div className="flex p-4 z-10 gap-2">
                        <Link to ="/" class="inline-flex items-center w-auto text-gray-100 bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                            Hadiths 
                            <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                        </Link>
                        <Link to ="/suras" class="inline-flex items-center w-auto text-gray-100 bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                            Suras 
                            <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                        </Link>
                        {localStorage.getItem('lastHadith') && (
                            <a
                                href={localStorage.getItem('lastHadith')}
                                className="inline-flex items-center w-auto text-gray-100 bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                            >
                                Go to Last Read
                            </a>
                        )}                                                 
                    </div>                    

                </div>
            </div>      
        </>
    )
}