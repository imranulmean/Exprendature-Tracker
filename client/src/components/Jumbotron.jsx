import { useEffect, useState } from "react"
import { Card } from "flowbite-react";


export default function Jumbotron(){

    let time  = new Date().toLocaleTimeString()
    const [ctime,setTime] = useState(time)
    const now = new Date();
    const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);
    
    
    useEffect(()=>{
        const UpdateTime=()=>{
            time =  new Date().toLocaleTimeString()
            setTime(time)
        }
        setInterval(UpdateTime)
    },[]);

    return(
        <>
            <div className="w-full flex flex-col bg-gray-900 p-2">
                <div className="w-full flex flex-col justify-center items-center">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 text-white">
                        {ctime}
                    </h5>
                    <p className="font-normal text-white">
                        {date}
                    </p>
                </div>
            </div>            
        </>
    )
}