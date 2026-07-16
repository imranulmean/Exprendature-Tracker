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
    const days=[90, 180, 365];
    const [extentionDays, setExtentionDays] = useState(90);
    const [loading, setLoading] = useState(false);

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

    return(
        <>
          <Header />
          <Jumbotron />
          <div className="w-full flex-col p-4">
            <Card className="w-full ">
              <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Hadih App Users</h5>
                <button onClick={getUsers} disabled={loading}
                    className="bg-green-900 border p-2 text-gray-200 mt-2">Reload
                </button>                  
              </div>
                
              <div className="flow-root ">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 ">
                      {
                          userList.map((e,index)=>{
                              return(
                                  <>
                                      <li className="py-3 sm:py-4">
                                          <div className="flex items-center space-x-4">                                              
                                              <div className="min-w-0 flex-1">
                                                <p>Deveice ID: {e.deviceId}</p>
                                                <p>firstInstall: {e.firstInstall}</p>
                                                <p>Trial Start: {moment(e.trialStart).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                                <p>Trial End: {moment(e.trialEnd).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                                <p>Activated: {e.activated}</p>
                                                <p>Extend Days</p>
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
                                              
                                          </div>
                                      </li>                                    
                                  </>
                              )
                          })
                      }                        
                  </ul>
              </div>                     
            </Card>  
          </div>
 
        </>
    )
}