import { useState, useEffect, useRef } from "react"
import HeaderPublic from "../components/HeaderPublic"
import { useLocation } from "react-router-dom"
import HeaderLibrary from "../components/HeaderLibrary";

export default function SuraAudio(){

    const {pathname} = useLocation();
    const [selected, setSelected] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isLooping, setIsLooping] = useState(false);
    const playerRef = useRef(null);

    const BASE_API = import.meta.env.VITE_API_BASE_URL;
    const [ayats, setAyats] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSuraDetails();
    }, [])

    // auto start playing first ayat when ayats load
    useEffect(() => {
        if (ayats.length > 0) {
            playAyat(ayats[0].ayatNumber, 1, false);
        }
    }, [ayats])

    // scroll to highlighted ayat
    useEffect(() => {
        if (selectedIndex) {
            const el = document.getElementById(`ayat-${selectedIndex}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [selectedIndex])

    const getSuraDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_API}/getSuraDetails${pathname}`);
            const data = await res.json();
            setAyats(data.message);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    function playAyat(item, index, loop = false) {
        setIsLooping(loop);
        setSelected(item);
        setSelectedIndex(index);

        setTimeout(() => {
            const player = playerRef.current;
            if (!player) return;

            // if same ayat clicked and playing → pause
            if (selectedIndex === index && !player.paused) {
                player.pause();
                return;
            }

            player.loop = loop;
            player.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy-2/${item}.mp3`;
            player.load();
            player.play();
        }, 50);
    }

    // when ayat ends — play next ayat automatically (only if not looping)
    function handleAyatEnded() {
        if (isLooping) return;

        const nextIndex = selectedIndex + 1;
        if (nextIndex <= ayats.length) {
            const nextAyat = ayats[nextIndex - 1];
            playAyat(nextAyat.ayatNumber, nextIndex, false);
        }
    }

    function closePlayer() {
        const player = playerRef.current;
        if (player) {
            player.pause();
            player.currentTime = 0;
        }
        setSelected(null);
        setSelectedIndex(null);
        setIsLooping(false);
    }

    return (
        <>
            <HeaderLibrary />
            <div>
                {/* Fixed audio player at bottom */}
                {selected && (
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg px-4 py-3 flex items-center gap-4">
                        <div className="flex flex-col min-w-fit">
                            <span className="text-xs text-slate-400">Now Playing</span>
                            <span className="text-sm font-medium text-blue-700">
                                Ayat {selectedIndex} {isLooping ? '🔁 Loop' : '▶ Auto'}
                            </span>
                        </div>
                        <audio
                            ref={playerRef}
                            id="surahPlayer"
                            controls
                            className="flex-1 h-10"
                            onEnded={handleAyatEnded}
                        >
                            <source src={`https://cdn.islamic.network/quran/audio/128/ar.alafasy-2/${selected}.mp3`} type="audio/mp3" />
                        </audio>
                        <button
                            onClick={closePlayer}
                            className="text-xs text-slate-400 hover:text-red-500 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className={`${selected ? 'pb-20' : ''}`}>
                    {loading && <p className="text-center text-slate-400 p-10">Loading...</p>}
                    <div className="flex flex-wrap gap-2 justify-center items-center p-4">
                        {ayats.map((item, index) => (
                            <a
                                id={`ayat-${index + 1}`}
                                key={index}
                                className={`flex flex-col items-center p-6 border rounded-base shadow-xs md:flex-row md:max-w-xl transition-all duration-300
                                    ${selectedIndex === index + 1
                                        ? 'bg-blue-50 border-blue-400'
                                        : 'bg-neutral-primary-soft border-default'
                                    }`}
                            >
                                <div className="flex flex-col justify-center items-center md:p-4 leading-normal">
                                    <h5 className="arabic-text mb-2 text-4xl font-medium tracking-tight text-heading">
                                        {item.ayat}
                                    </h5>
                                    <div className="flex gap-2">
                                        {/* auto play button */}
                                        <button
                                            onClick={() => playAyat(item.ayatNumber, index + 1, false)}
                                            className={`p-4 flex items-center justify-center rounded-lg border font-medium text-sm transition-all duration-150
                                                ${selectedIndex === index + 1 && !isLooping
                                                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                                                    : 'bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-400 text-blue-700'
                                                }`}
                                        >
                                            Ayat: {index + 1} ▶ Play
                                        </button>

                                        {/* loop button */}
                                        <button
                                            onClick={() => playAyat(item.ayatNumber, index + 1, true)}
                                            className={`p-4 flex items-center justify-center rounded-lg border font-medium text-sm transition-all duration-150
                                                ${selectedIndex === index + 1 && isLooping
                                                    ? 'bg-green-100 border-green-500 text-green-700'
                                                    : 'bg-white border-slate-200 hover:bg-green-50 hover:border-green-400 text-green-700'
                                                }`}
                                        >
                                            🔁 Loop
                                        </button>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}