import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export function HeroWave() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let fluid = null;
        let isDestroyed = false;
        let prevX = 0;
        let prevY = 0;
        let hasPrev = false;
        let cleanupFns = [];

        import('webgl-fluid-enhanced').then(({ default: WebGLFluidEnhanced }) => {
            if (isDestroyed) return;

            fluid = new WebGLFluidEnhanced(container);

            container.style.position = 'absolute';
            container.style.inset = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.display = 'block';
            container.style.overflow = 'hidden';

            const canvas = container.querySelector('canvas');
            if (canvas) canvas.style.pointerEvents = 'none';

            fluid.setConfig({
                transparent: true,
                backgroundColor: '#000000',
                colorful: false,
                colorPalette: ['ffffff'],
                brightness: 0.15,
                densityDissipation: 0.94,
                velocityDissipation: 0.95,
                splatRadius: 0.1,
                splatForce: 3000,
                simResolution: 128,
                dyeResolution: 512,
                pressureIterations: 20,
                curl: 12,
                shading: false,
                bloom: false,
                sunrays: false,
                hover: false,
            });

            fluid.start();
            fluid.multipleSplats(1);

            const onMouseMove = (e) => {
                if (!fluid || !container) return;
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
                    hasPrev = false;
                    return;
                }

                if (!hasPrev) {
                    prevX = e.clientX;
                    prevY = e.clientY;
                    hasPrev = true;
                    return;
                }

                const dx = e.clientX - prevX;
                const dy = e.clientY - prevY;
                prevX = e.clientX;
                prevY = e.clientY;

                const speed = Math.sqrt(dx * dx + dy * dy);
                if (speed < 2) return;

                const scale = Math.min(speed * 0.15, 4);
                fluid.splatAtLocation(x, y, dx * scale, dy * scale);
            };

            const onTouchMove = (e) => {
                if (!fluid || !container) return;
                const t = e.touches[0];
                const rect = container.getBoundingClientRect();
                const x = t.clientX - rect.left;
                const y = t.clientY - rect.top;
                if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

                const dx = t.clientX - prevX;
                const dy = t.clientY - prevY;
                prevX = t.clientX;
                prevY = t.clientY;
                fluid.splatAtLocation(x, y, dx * 8, dy * 8);
            };

            const onVisibility = () => {
                if (!fluid) return;
                if (document.hidden) fluid.stop();
                else fluid.start();
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('touchmove', onTouchMove, { passive: true });
            document.addEventListener('visibilitychange', onVisibility);

            cleanupFns = [
                () => window.removeEventListener('mousemove', onMouseMove),
                () => window.removeEventListener('touchmove', onTouchMove),
                () => document.removeEventListener('visibilitychange', onVisibility),
            ];
        });

        return () => {
            isDestroyed = true;
            cleanupFns.forEach((fn) => fn());
            if (fluid) {
                fluid.stop();
                fluid = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none', zIndex: 20 }}
            aria-hidden="true"
        />
    );
}

export default function Banner(){
    return(
        <>
            <div className="w-full">
                {/* Container with relative positioning to hold the text overlay */}
                <div className="flex flex-col relative z-1 h-[50vh] md:h-[70vh] bg-[url('/islamic-logo.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
                    
                    {/* Dark Overlay - ensures text is readable regardless of the image brightness */}
                    <div className="absolute inset-0 bg-[#00000080]"></div>
                    {/* <HeroWave/>  */}
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