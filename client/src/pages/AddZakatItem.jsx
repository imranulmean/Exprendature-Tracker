import { Card, TextInput, Button, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import Header from "../components/Header";

export default function AddZakatItem(){

    const { year, yearlyZakatId } = useParams();
    const [zakatYear, setZakatYear]= useState(0);
    const [zakatItems, setZakatItems] = useState([]);    
    const [loading, setLoading]= useState(false);
    const [total, setTotal]= useState(0);
    const [purpose, setPurpose]= useState('');  

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const { currentUser } = useSelector((state) => state.user);    
    const navigate = useNavigate();

    useEffect(()=>{
        getZakatItems();
    },[])

    const getZakatItems = async() =>{
        const formData={
            yearlyZakatId,
            userId:currentUser._id
        };        
        try {
            const res= await fetch(`${BASE_API}/api/zakat/getZakatItems`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            if(!data.success){                
                alert(data.message);
                if(data.message === 'Unauthorised') {
                    navigate('/login');
                }
                return;
            }            
            if(!data.success){
                alert(data.message);
                return;
            }
            setZakatItems(data.message)
        }
        catch(e){
            alert(e);
        }finally{
            setLoading(false);            
        }        
    }

    const addZakatItem= async() =>{
   
        if(Number(total) < 100 || !purpose ){
            alert("Can not be Null")
            return;
        }
        const formData={
            userId:currentUser._id,
            yearlyZakatId,
            purpose:purpose.trim(),
            paid:total
        };
        
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/api/zakat/addZakatItem`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            console.log(data);
            alert(data.message)
        }
        catch(e){
            alert(e);
        }finally{
            setLoading(false);
            await getZakatItems();
        }

    }

    const deleteZakatItem= async(zakatItemId) =>{
        const formData={
            userId:currentUser._id,
            zakatItemId,
            yearlyZakatId

        };        
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/api/zakat/deleteZakatItem`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            alert(data.message)
        }
        catch(e){
            alert(e);
        }finally{
            setLoading(false);
            await getZakatItems();
        }        
    }    
    
    return(
        <>
            <Header/>
            <div className="flex flex-col gap-2 justify-center items-center p-2">
                <div className="w-full max-w-sm">
                    <Card>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="currentYear">Year: {year}</Label>
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password1">Purpose: </Label>
                            </div>
                            <TextInput  onChange={(e)=>setPurpose(e.target.value)}
                                type="text" required />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password1">Total: </Label>
                            </div>
                            <TextInput  onChange={(e)=>setTotal(e.target.value)}
                                id="password1" type="number" required />
                        </div>
                        {
                            loading ? (<p>Processing...</p>):(<Button onClick={addZakatItem}>Add Zakat Item</Button>)
                            
                        }                    
                    </Card>                    
                </div>
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <Card className="w-full">
                        <div className="mb-4 flex items-center justify-between">
                            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">List</h5>
                        </div>
                        <div className="flow-root">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {
                                    zakatItems.map((item, index)=>(
                                        <li className="pb-0 pt-3 sm:pt-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="min-w-0 flex-1">                                            
                                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{index+1}.{' '}{item.purpose}</p>
                                                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item.createdAt}</p>
                                                </div>
                                                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                    {item.paid}
                                                </div>
                                                <button onClick={()=>deleteZakatItem(item._id)}>
                                                    Del
                                                </button>                                    
                                            </div>
                                        </li>
                                    ))
                                }

                            </ul>
                        </div>
                    </Card>                    
                </div>
            </div>
        </>
    )
}