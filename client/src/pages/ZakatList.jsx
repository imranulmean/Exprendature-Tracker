import { Card, TextInput, Button, Label } from "flowbite-react";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Header from "../components/Header";

export default function ZakatList(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const formatYear = (date) => {        
        const year = date.getFullYear();
        return `${year}`;
    };    

    const [currentYear, setCurrentYear]=useState(formatYear(new Date()));    
    const [total, setTotal]= useState(0);  
    const [loading, setLoading]= useState(false);
    const [zakatList, setZakatList] = useState([]);

    useEffect(()=>{
        alert(JSON.stringify(currentUser))
        if(!currentUser){
            navigate('/login');
            return;
        }
        getZakatList();
    },[]);

    const getZakatList = async() =>{
        const formData={
            userId:currentUser._id
        };        
        try {
            const res= await fetch(`${BASE_API}/api/zakat/getZakatList`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            if(!data.success){
                alert(data.message);
                return;
            }
            setZakatList(data.message)
        }
        catch(e){
            alert(e);
        }finally{
            setLoading(false);
        }        
    }

    const createNew= async() =>{
        if(Number(total) < 2500){
            alert("Can not be less than 1 lac")
            return;
        }
        const formData={
            userId:currentUser._id,
            year:currentYear,
            total
        };   
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/api/zakat/createNew`,{
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
            await getZakatList();
            setLoading(false);            
        }

    }

    return(
        <>
            <Header />
            <div className="flex flex-col gap-2 justify-center items-center p-2">
                <div className="w-full max-w-sm">
                    <Card className="max-w-sm">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="currentYear">Year: {currentYear}</Label>
                            </div>
                        </div>                    
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password1">Total: </Label>
                            </div>
                            <TextInput  onChange={(e)=>setTotal(e.target.value)}
                                id="password1" type="number" required />
                        </div>
                        {
                            loading ? (<p>Processing...</p>):(<Button onClick={createNew}>New / Update</Button>)
                            
                        }                    
                    </Card>
                </div>
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    {
                        zakatList.map( z=> (
                            //////////////////////////
                            <Card className="w-full flex flex-col">
                                <div className="mb-4 flex items-center justify-between">
                                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{z.year}</h5>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{z.total}</div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">Paid: {z.paid}</div>
                                </div>
                                <Link className="text-center px-4 py-2 bg-gray-200 rounded-lg" 
                                    to={`/zakats/addItem/${z.year}/${z._id}`}>Add item</Link>
                            </Card>                          
                            /////////////////////////
                        ) )
                    } 
                </div>
            </div>
        </>
    )
}