import { useEffect, useState } from "react";
import Header from "../components/Header";
import Jumbotron from "../components/Jumbotron";
import { Card, TextInput, Button, Timeline  } from "flowbite-react";
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function HadithAppUsers(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const [userList, setUserList]= useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const days=[90, 180, 365, 500, 1000];
    const [extentionDays, setExtentionDays] = useState(90);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(()=>{
        getUsers();
    },[]);   

    const getUsers=async()=>{
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/hadithApp/getAllDevice`,{
              method:"GET",
              headers: {
                "authorization": currentUser.authorization 
                },
            });
            const data= await res.json();
            if(data.success)
            setUserList(data.message);
        }
        catch(e){
            console.log(e);
        }finally{
            setLoading(false);
        }
    }

    const handleSelect=(value,index)=>{
        setExtentionDays(value)
    } 
    
    const extendActivation = async(deviceId)=>{
        // deviceId, extentionDays
        console.log(deviceId, extentionDays)
        setLoading(true);
        try{
            const res= await fetch(`${BASE_API}/hadithApp/extendActivation`,{
                method:"POST",
                headers: {
                    "content-type":'application/json',
                    "authorization": currentUser.authorization,                 
                },
                body:JSON.stringify({deviceId, extentionDays})  
            });
            const data= await res.json();
            alert(JSON.stringify(data.message))
        }catch(err){
            alert(err.message);
        }finally{
            setLoading(false);
        }
    }

    const deleteDevice = async(deviceId)=>{
        console.log(deviceId)
        setLoading(true);
        try{
            const res= await fetch(`${BASE_API}/hadithApp/deleteDevice`,{
                method:"POST",
                headers: {
                    "content-type":'application/json',
                    "authorization": currentUser.authorization,                 
                },
                body:JSON.stringify({deviceId})  
            });
            const data= await res.json();
            alert(data.message)
        }catch(err){
            alert(err.message);
        }finally{
            setLoading(false);
        }
    }

    function trialDuration(trialStart, trialEnd){
        const start= moment(trialStart);
        const end= moment(trialEnd);
        const days = moment.duration(end.diff(start)).asDays();
        return `${days} days`;
    }

    function trialRemaining(trialEnd){

        const duration = moment.duration( moment(trialEnd).diff(moment()) );
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        return (`${days} days ${hours} hr ${minutes} min`)        
    }    

    const filtered = userList.filter((user)=>{
        if(!searchText) return user;
        if(user.deviceId.includes(searchText)) return user;
    })

    return(
        <>
          <Header />
          <Jumbotron />
          <div className="flex flex-col items-center mt-2">
            <input type='text' className="rounded-lg" placeholder="Device Id" onChange={(e)=>setSearchText(e.target.value)}/>
            <p className="text-xs text-gray-600">Showing: {filtered.length}</p>
            <div className="w-full flex flex-wrap px-4 py-2 gap-2 justify-center">
                {
                    filtered.map((e,index)=>{
                        return(
                            <>
                                <div className="w-full max-w-sm flex flex-col border border-gray-400 p-2 rounded-lg">
                                    <p className="text-sm">Deveice ID: {e.deviceId}</p>
                                    <p className="text-sm">firstInstall: {moment(e.firstInstall).format('MMMM Do YYYY, h:mm a')}</p>
                                    <p className="text-sm">Trial Start: {moment(e.trialStart).format('MMMM Do YYYY, h:mm a')}</p>
                                    <p className="text-sm">Trial End: {moment(e.trialEnd).format('MMMM Do YYYY, h:mm a')}</p>
                                    <p className="text-sm">Duration: {trialDuration(e.trialStart,e.trialEnd)}</p>
                                    <p className="text-sm">Remaining: {trialRemaining(e.trialEnd)}</p>
                                    <p className="text-sm">Activated: {e.activated}</p>
                                    <p className="text-sm">Extend Days</p>
                                    <select value={extentionDays} onChange={(e) => handleSelect(e.target.value, index)}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-500"
                                    >
                                        {days.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select> 
                                    <button onClick={()=>extendActivation(e.deviceId)} disabled={loading}
                                        className="bg-green-900 border p-2 text-gray-200 mt-2">Update Trail
                                    </button>
                                    <button onClick={()=>deleteDevice(e.deviceId)} disabled={loading}
                                        className="bg-green-900 border p-2 text-gray-200 mt-2">Delete Device
                                    </button>
                                </div>                                    
                            </>
                        )
                    })
                }    
            </div>
          </div>

 
        </>
    )
}