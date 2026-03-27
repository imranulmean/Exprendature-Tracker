import { useState, useEffect } from "react"
import HeaderPublic from "../components/HeaderPublic"
import { useLocation } from "react-router-dom"

export default function SuraAudio(){

    const {pathname}= useLocation();
    // const [ayats, setAyats]= useState(
    //     ['5448', '5449', '5450', '5451', '5452', '5453', '5454', '5455', '5456', '5457', '5458', '5459', '5460', '5461', '5462', '5463', '5464', '5465', '5466', '5467', '5468', '5469', '5470', '5471', '5472', '5473', '5474', '5475']        
    // )
    // const verses = ['قُلۡ أُوحِیَ إِلَیَّ أَنَّهُ ٱسۡتَمَعَ نَفَرࣱ مِّن…قَالُوۤا۟ إِنَّا سَمِعۡنَا قُرۡءَانًا عَجَبࣰا ١\n ', 'یَهۡدِیۤ إِلَى ٱلرُّشۡدِ فَـَٔامَنَّا بِهِۦۖ وَلَن نُّشۡرِكَ بِرَبِّنَاۤ أَحَدࣰا ٢\n ', 'وَأَنَّهُۥ تَعَـٰلَىٰ جَدُّ رَبِّنَا مَا ٱتَّخَذَ صَـٰحِبَةࣰ وَلَا وَلَدࣰا ٣\n ', 'وَأَنَّهُۥ كَانَ یَقُولُ سَفِیهُنَا عَلَى ٱللَّهِ شَطَطࣰا ٤\n ', 'وَأَنَّا ظَنَنَّاۤ أَن لَّن تَقُولَ ٱلۡإِنسُ وَٱلۡجِنُّ عَلَى ٱللَّهِ كَذِبࣰا ٥\n ', 'وَأَنَّهُۥ كَانَ رِجَالࣱ مِّنَ ٱلۡإِنسِ یَعُوذُونَ بِرِجَالࣲ مِّنَ ٱلۡجِنِّ فَزَادُوهُمۡ رَهَقࣰا ٦\n ', 'وَأَنَّهُمۡ ظَنُّوا۟ كَمَا ظَنَنتُمۡ أَن لَّن یَبۡعَثَ ٱللَّهُ أَحَدࣰا ٧\n ', 'وَأَنَّا لَمَسۡنَا ٱلسَّمَاۤءَ فَوَجَدۡنَـٰهَا مُلِئَتۡ حَرَسࣰا شَدِیدࣰا وَشُهُبࣰا ٨\n ', 'وَأَنَّا كُنَّا نَقۡعُدُ مِنۡهَا مَقَـٰعِدَ لِلسَّ…مِعِ ٱلۡـَٔانَ یَجِدۡ لَهُۥ شِهَابࣰا رَّصَدࣰا ٩\n ', 'وَأَنَّا لَا نَدۡرِیۤ أَشَرٌّ أُرِیدَ بِمَن فِی ٱلۡأَرۡضِ أَمۡ أَرَادَ بِهِمۡ رَبُّهُمۡ رَشَدࣰا ١٠\n ', 'وَأَنَّا مِنَّا ٱلصَّـٰلِحُونَ وَمِنَّا دُونَ ذَ ٰ⁠لِكَۖ كُنَّا طَرَاۤىِٕقَ قِدَدࣰا ١١\n ', 'وَأَنَّا ظَنَنَّاۤ أَن لَّن نُّعۡجِزَ ٱللَّهَ فِی ٱلۡأَرۡضِ وَلَن نُّعۡجِزَهُۥ هَرَبࣰا ١٢\n ', 'وَأَنَّا لَمَّا سَمِعۡنَا ٱلۡهُدَىٰۤ ءَامَنَّا بِه…رَبِّهِۦ فَلَا یَخَافُ بَخۡسࣰا وَلَا رَهَقࣰا ١٣\n ', 'وَأَنَّا مِنَّا ٱلۡمُسۡلِمُونَ وَمِنَّا ٱلۡقَـٰسِط…َسۡلَمَ فَأُو۟لَـٰۤىِٕكَ تَحَرَّوۡا۟ رَشَدࣰا ١٤\n ', 'وَأَمَّا ٱلۡقَـٰسِطُونَ فَكَانُوا۟ لِجَهَنَّمَ حَطَبࣰا ١٥\n ', 'وَأَلَّوِ ٱسۡتَقَـٰمُوا۟ عَلَى ٱلطَّرِیقَةِ لَأَسۡقَیۡنَـٰهُم مَّاۤءً غَدَقࣰا ١٦\n ', 'لِّنَفۡتِنَهُمۡ فِیهِۚ وَمَن یُعۡرِضۡ عَن ذِكۡرِ رَبِّهِۦ یَسۡلُكۡهُ عَذَابࣰا صَعَدࣰا ١٧\n ', 'وَأَنَّ ٱلۡمَسَـٰجِدَ لِلَّهِ فَلَا تَدۡعُوا۟ مَعَ ٱللَّهِ أَحَدࣰا ١٨\n ', 'وَأَنَّهُۥ لَمَّا قَامَ عَبۡدُ ٱللَّهِ یَدۡعُوهُ كَادُوا۟ یَكُونُونَ عَلَیۡهِ لِبَدࣰا ١٩\n ', 'قُلۡ إِنَّمَاۤ أَدۡعُوا۟ رَبِّی وَلَاۤ أُشۡرِكُ بِهِۦۤ أَحَدࣰا ٢٠\n ', 'قُلۡ إِنِّی لَاۤ أَمۡلِكُ لَكُمۡ ضَرࣰّا وَلَا رَشَدࣰا ٢١\n ', 'قُلۡ إِنِّی لَن یُجِیرَنِی مِنَ ٱللَّهِ أَحَدࣱ وَلَنۡ أَجِدَ مِن دُونِهِۦ مُلۡتَحَدًا ٢٢\n ', 'إِلَّا بَلَـٰغࣰا مِّنَ ٱللَّهِ وَرِسَـٰلَـٰتِهِۦۚ … نَارَ جَهَنَّمَ خَـٰلِدِینَ فِیهَاۤ أَبَدًا ٢٣\n ', 'حَتَّىٰۤ إِذَا رَأَوۡا۟ مَا یُوعَدُونَ فَسَیَعۡلَمُونَ مَنۡ أَضۡعَفُ نَاصِرࣰا وَأَقَلُّ عَدَدࣰا ٢٤\n ', 'قُلۡ إِنۡ أَدۡرِیۤ أَقَرِیبࣱ مَّا تُوعَدُونَ أَمۡ یَجۡعَلُ لَهُۥ رَبِّیۤ أَمَدًا ٢٥\n ', 'عَـٰلِمُ ٱلۡغَیۡبِ فَلَا یُظۡهِرُ عَلَىٰ غَیۡبِهِۦۤ أَحَدًا ٢٦\n ', 'إِلَّا مَنِ ٱرۡتَضَىٰ مِن رَّسُولࣲ فَإِنَّهُۥ یَسۡ…ِنۢ بَیۡنِ یَدَیۡهِ وَمِنۡ خَلۡفِهِۦ رَصَدࣰا ٢٧\n ', 'لِّیَعۡلَمَ أَن قَدۡ أَبۡلَغُوا۟ رِسَـٰلَـٰتِ رَبّ… لَدَیۡهِمۡ وَأَحۡصَىٰ كُلَّ شَیۡءٍ عَدَدَۢا ٢٨\n ']
    const [selected, setSelected]=useState();
    const [selectedIndex, setSelectedIndex]=useState();

    //////////////////////////////

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const [ayats, setAyats]= useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getSuraDetails();
    },[])

    const getSuraDetails = async()=>{
        try {
            setLoading(true); 
           const res= await fetch(`${BASE_API}/getSuraDetails${pathname}`);
           const data= await res.json();
           setAyats(data.message)
        } catch (error) {
            alert(error)
        }
        finally{
            setLoading(false); 
        }
    }    
    ///////////////////////////////

    function playAyat(item, index) {
        setSelected(item);
        setSelectedIndex(index);
        setTimeout(() => {
            const player = document.getElementById('surahPlayer');
            if(!player.paused){
                player.pause();
                player.currentTime = 0; // resets to beginning      
            }
            else {
                player.load();
                player.play();
                player.loop = true;
            }
        }, 50);
    }
    // function stopAyat(){
    //     const player = document.getElementById('surahPlayer');
    //     player.pause();
    //     player.currentTime = 0; // resets to beginning        
    // }    
    // https://alquran.cloud/surah/72
    
    return(
        <>
            <HeaderPublic />
            <audio id="surahPlayer" controls="controls" class="">
                <source  src={`https://cdn.islamic.network/quran/audio/128/ar.alafasy-2/${selected}.mp3`} type="audio/mp3" />
            </audio>
            <div className="flex flex-wrap gap-2 justify-center items-center p-4">
                {
                    ayats.map((item, index)=>{
                        return(
                            <a class="flex flex-col items-center bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs md:flex-row md:max-w-xl md:flex-row md:max-w-xl">
                                <div class="flex flex-col justify-center items-center md:p-4 leading-normal">
                                    <h5 class="arabic-text mb-2 text-4xl font-medium tracking-tight text-heading">{item.ayat}</h5>
                                    <div className="flex gap-2">
                                        <button  onClick={()=>playAyat(item.ayatNumber, index+1)}                                    
                                                className={`p-4 flex items-center justify-center rounded-lg border font-medium text-sm transition-all duration-150
                                                    ${selectedIndex === index + 1
                                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                                        : 'bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-400 text-blue-700'
                                                    }`}
                                        >
                                            Ayat: {index+1} Play / OFF
                                        </button>                                        
                                    </div>
                                </div>
                            </a>                             
                        )
                    })
                }  
            </div>          
        </>
    )
}