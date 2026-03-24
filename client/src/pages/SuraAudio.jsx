import { useState } from "react"
import HeaderPublic from "../components/HeaderPublic"

export default function SuraAudio(){
    const [ayats, setAyats]= useState(
        ['5448', '5449', '5450', '5451', '5452', '5453', '5454', '5455', '5456', '5457', '5458', '5459', '5460', '5461', '5462', '5463', '5464', '5465', '5466', '5467', '5468', '5469', '5470', '5471', '5472', '5473', '5474', '5475']        
    )
    // https://alquran.cloud/surah/72
    return(
        <>
            <HeaderPublic />
            <div className="flex flex-wrap gap-2 justify-center items-center p-4">
                {
                    ayats.map((item, index)=>{
                        return(
                            <div class="flex flex-col justify-between md:p-4 leading-normal">
                                <a href={`https://cdn.islamic.network/quran/audio/128/ar.alafasy-2/${item}.mp3`}
                                   rel="noreferrer" 
                                class="w-12 h-12 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-400 text-blue-700 font-medium text-sm transition-all duration-150">
                                    {index+1}                                            
                                </a>
                        </div>
                        )
                    })
                }  
            </div>
          
        </>
    )
}