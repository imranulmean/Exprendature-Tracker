import { useEffect, useRef } from 'react';

export function GameWave() {
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
                brightness: 0.3,
    
                densityDissipation: 0.999,
                velocityDissipation: 0.999,
    
                splatRadius: 0.1,
                splatForce: 8000,
    
                simResolution: 128,
                dyeResolution: 1024,
                pressureIterations: 20,
                curl: 2,
                shading: false,
                bloom: false,
                sunrays: false,
                hover: false,
            });
    
            fluid.start();
            fluid.multipleSplats(1);

            const dpr = window.devicePixelRatio || 1;

            const onMouseMove = (e) => {                
                if (!fluid || !container) return;
                const rect = container.getBoundingClientRect();
                const x = e.offsetX * dpr;
                const y = e.offsetY * dpr;
            
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
                if (speed < 0.5) return;
            
                fluid.splatAtLocation(x, y, dx * 3, dy * 3);
            };
            
            const onTouchStart = (e) => {
                const t = e.touches[0];
                prevX = t.clientX;
                prevY = t.clientY;
                hasPrev = true;
            };
            const onTouchMove = (e) => {

                if (!fluid || !container) return;
                const t = e.touches[0];
                const rect = container.getBoundingClientRect();
            
                const x = (t.pageX - rect.left) * dpr;  // x needs dpr (divided by canvas.width which is physical)
                const y = (t.pageY - rect.top);          // y NO dpr (divided by canvas.clientHeight which is CSS)
            
                if (!hasPrev) {
                    prevX = t.clientX;
                    prevY = t.clientY;
                    hasPrev = true;
                    return;
                }
            
                const dx = t.clientX - prevX;
                const dy = t.clientY - prevY;
                prevX = t.clientX;
                prevY = t.clientY;
            
                fluid.splatAtLocation(x, y, dx * 3, dy * 3);
            };           
    
            const onVisibility = () => {
                if (!fluid) return;
                if (document.hidden) fluid.stop();
                else fluid.start();
            };
    
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('touchstart', onTouchStart, { passive: true });
            window.addEventListener('touchmove', onTouchMove, { passive: true });
            document.addEventListener('visibilitychange', onVisibility);
    
            cleanupFns = [
                () => window.removeEventListener('mousemove', onMouseMove),
                () => window.removeEventListener('touchstart', onTouchStart),
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

    // useEffect(() => {
    //     const container = containerRef.current;
    //     if (!container) return;

    //     let fluid = null;
    //     let isDestroyed = false;
    //     let prevX = 0;
    //     let prevY = 0;
    //     let hasPrev = false;
    //     let cleanupFns = [];

    //     import('webgl-fluid-enhanced').then(({ default: WebGLFluidEnhanced }) => {
    //         if (isDestroyed) return;

    //         fluid = new WebGLFluidEnhanced(container);

    //         container.style.position = 'absolute';
    //         container.style.inset = '0';
    //         container.style.width = '100%';
    //         container.style.height = '100%';
    //         container.style.display = 'block';
    //         container.style.overflow = 'hidden';

    //         const canvas = container.querySelector('canvas');
    //         if (canvas) canvas.style.pointerEvents = 'none';

    //         fluid.setConfig({
    //             transparent: true,
    //             backgroundColor: '#000000',
    //             colorful: false,
    //             colorPalette: ['ffffff'],
    //             brightness: 0.3,
            
    //             densityDissipation: 0.999,  // ✅ very slow fade
    //             velocityDissipation: 0.999, // ✅ movement stays long
            
    //             splatRadius: 0.1,          // ✅ thin like a pen stroke
    //             splatForce: 8000,           // ✅ strong so it's visible
            
    //             simResolution: 128,
    //             dyeResolution: 1024,        // ✅ sharp trails
    //             pressureIterations: 20,
    //             curl: 2,                    // ✅ very low — keeps letter shape
    //             shading: false,
    //             bloom: false,
    //             sunrays: false,
    //             hover: false,
    //         })

    //         fluid.start();
    //         fluid.multipleSplats(1);

    //         const onMouseMove = (e) => {
    //             if (!fluid || !container) return;
    //             const rect = container.getBoundingClientRect();
    //             const x = e.clientX - rect.left;
    //             console.log(`in pc: ${x}`);
    //             const y = e.clientY - rect.top;
    //             if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
    //                 hasPrev = false;
    //                 return;
    //             }
    //             if (!hasPrev) {
    //                 prevX = e.clientX;
    //                 prevY = e.clientY;
    //                 hasPrev = true;
    //                 return;
    //             }
    //             const dx = e.clientX - prevX;
    //             const dy = e.clientY - prevY;
    //             prevX = e.clientX;
    //             prevY = e.clientY;
            
    //             const speed = Math.sqrt(dx * dx + dy * dy);
    //             if (speed < 0.5) return; // ✅ was 2 — now captures slow writing
            
    //             // ✅ fixed scale — not speed dependent so trail is consistent
    //             fluid.splatAtLocation(x, y, dx * 3, dy * 3);
    //         };
         
    //         const onTouchMove = (e) => {
    //             if (!fluid || !container) return;
    //             const t = e.touches[0];
    //             const rect = container.getBoundingClientRect();
    //             console.log(rect);
    //             const x = t.clientX - rect.left;
    //             console.log(`in mobile: ${x}`);
    //             const y = t.clientY - rect.top;
    //             if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
    //             const dx = t.clientX - prevX;
    //             const dy = t.clientY - prevY;
    //             prevX = t.clientX;
    //             prevY = t.clientY;
    //             fluid.splatAtLocation(x, y, dx * 3, dy * 3); // ✅ consistent force
    //         };

    //         const onVisibility = () => {
    //             if (!fluid) return;
    //             if (document.hidden) fluid.stop();
    //             else fluid.start();
    //         };

    //         window.addEventListener('mousemove', onMouseMove);
    //         window.addEventListener('touchmove', onTouchMove, { passive: true });
    //         document.addEventListener('visibilitychange', onVisibility);

    //         cleanupFns = [
    //             () => window.removeEventListener('mousemove', onMouseMove),
    //             () => window.removeEventListener('touchmove', onTouchMove),
    //             () => document.removeEventListener('visibilitychange', onVisibility),
    //         ];
    //     });

    //     return () => {
    //         isDestroyed = true;
    //         cleanupFns.forEach((fn) => fn());
    //         if (fluid) {
    //             fluid.stop();
    //             fluid = null;
    //         }
    //     };
    // }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none', zIndex: 20 }}
            aria-hidden="true"
        />
    );
}

export default function Game() {
    return (
        <>
            <style>{`
                html, body {
                    overscroll-behavior: none;
                    overflow: hidden;
                    height: 100%;
                }
            `}</style>
            <div
                className="relative w-screen bg-black overflow-hidden"
                style={{
                    height: '100dvh',
                    maxHeight: '100dvh',
                    overscrollBehavior: 'none',
                    touchAction: 'none',
                }}
            >
                <GameWave />
            </div>
        </>
    );
}