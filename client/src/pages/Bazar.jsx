import { Card, TextInput, Button, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import Header from "../components/Header";

export default function Bazar(){

    const [bazarItems, setBazarItems] = useState([]);    
    const [loading, setLoading]= useState(false);
    const [total, setTotal]= useState(0);
    const [purpose, setPurpose]= useState('');  
    const [grandTotal, setGrandTotal]= useState(0);

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const { currentUser } = useSelector((state) => state.user);    
    const navigate = useNavigate();

    useEffect(()=>{
        getBazarItems();
    },[])

    const getBazarItems = async() =>{
        const formData={
            userId:currentUser._id
        };        
        try {
            const res= await fetch(`${BASE_API}/api/bazar/getBazarItems`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json', "authorization": currentUser.authorization },
                // credentials: "include",
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            if(!data.success){                
                alert(data.message);
                if(data.message === 'Unauthorized') {
                    navigate('/login');
                }
                return;
            }            
            if(!data.success){
                alert(data.message);
                return;
            }
            setBazarItems(data.message);
            const t=data.message.reduce((sum, item)=>{
                return sum + item.paid
            },0)
            setGrandTotal(t);
        }
        catch(e){
            alert(e);
        }finally{
            setLoading(false);            
        }        
    }

    const addBazarItem= async() =>{
   
        if(Number(total) < 1 || !purpose ){
            alert("Can not be Null")
            return;
        }
        const formData={
            userId:currentUser._id,
            purpose:purpose.trim(),
            paid:total
        };
        
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/api/bazar/addBazarItem`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json', "authorization": currentUser.authorization },
                // credentials: "include",
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            alert(data.message)
        }
        catch(e){
            alert(e);
        }finally{
            setLoading(false);
            await getBazarItems();
        }

    }

    const deleteBazarItem= async(bazarItemId) =>{
        const formData={
            userId:currentUser._id,
            bazarItemId
        };        
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/api/bazar/deleteBazarItem`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json', "authorization": currentUser.authorization },
                // credentials: "include",
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            alert(data.message)
        }
        catch(e){
            alert(e);
        }finally{
            setLoading(false);
            await getBazarItems();
        }        
    }    

    const formatDate = (dateParam) =>{
        const formatDate= new Date(dateParam);
        const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(formatDate);
        return date;
    }     
    
    return(
        <>
            <Header/>
            <div className="flex flex-col gap-2 justify-center items-center p-2">
                <div className="w-full max-w-sm">
                    <Card>
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
                            loading ? (<p>Processing...</p>):(<Button onClick={addBazarItem}>Add B Item</Button>)
                            
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
                                    bazarItems.map((item, index)=>(
                                        <li className="pb-0 pt-3 sm:pt-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="min-w-0 flex-1">                                            
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{index+1}.{' '}{item.purpose}</p>
                                                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{formatDate(item.createdAt)}</p>
                                                </div>
                                                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                    {item.paid}
                                                </div>
                                                <button onClick={()=>deleteBazarItem(item._id)}>
                                                    Del
                                                </button>                                    
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>

                            <div className="mt-2 flex justify-end">
                                <p className="text-base font-semibold text-gray-900">Total: {grandTotal}</p>
                            </div>                            
                      
                        </div>
                    </Card>                    
                </div>
            </div>
        </>
    )
}