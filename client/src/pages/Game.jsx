import { HeroWave } from "../components/Banner";

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
                <HeroWave />
            </div>
        </>
    );
}