import Header from "../components/Header";
import { Card, TextInput, Button } from "flowbite-react";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Insertion(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [expData, setExpData] = useState({expName:'', amount:''});
    const [expList, setExpList] = useState([]);    
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const { currentUser } = useSelector((state) => state.user);
    const [expTotal, setExpTotal]= useState(0);
    let total=0;
    const [loading, setLoading]= useState(false);
    useEffect(()=>{
        total= expList.reduce((acc, e) => acc + Number(e.amount), 0);
        setExpTotal(total);
    },[expList]);

    useEffect(()=>{
        getExpData();
    },[])

    const getExpData = async()=>{
        const monthName=formatMonth(today);
        const year=formatYear(today);
        const formData={
            userId:currentUser._id,
            year,
            monthName
        };
        try {
            const res= await fetch(`${BASE_API}/api/expenses/getCurrentMonth`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            setExpList(data[0].expList);

        }
        catch(e){
            console.log(e);
        }
    }

    const formatYear = (date) => {        
        // const day = String(date.getDate()).padStart(2, '0');
        // const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${year}`;
    };

    const formatMonth = (date) => {        
        // const day = String(date.getDate()).padStart(2, '0');
        const month = monthNames[date.getMonth()];
        // const year = date.getFullYear();
        return `${month}`;
    };

    const addToList=()=>{
        if(!expData.expName || !expData.amount){
            alert('insert value');
            return;
        }
        const trimmedExpName=expData.expName.trim();

        setExpList((prev)=>[...prev, { ...expData, expName:trimmedExpName }]);
        setExpData({expName:'', amount:''});        
    }

    const handleChange = (e) => {
        setExpData({ ...expData, [e.target.name]: e.target.value });
      };
     
    const handleSubmit= async() =>{

        setLoading(true);
        const monthName=formatMonth(today);
        const year=formatYear(today);
        total= expList.reduce((acc, e) => acc + Number(e.amount), 0);
        const formData={
            userId:currentUser._id,
            year,
            monthName,
            expList,
            total
        };
        try{
            const res= await fetch(`${BASE_API}/api/expenses/addExpenses`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            setLoading(false);
            navigate('/')
            // await getExpData();
        }   
        catch(e){
            console.log(e);
        }
    }  

    const removeItem=(index)=>{
        const newList=[...expList];
        newList.splice(index,1);
        setExpList(newList);
    }

    return (
        <>
            <Header />
            <div className="flex justify-center">
                <Card className="w-full md:w-[500px]">
                    <div className="mb-4 flex-col items-center justify-between gap-2">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-2">{formatMonth(today)} {formatYear(today)}</h5>
                        <TextInput onChange={handleChange} value={expData.expName} name="expName" type="text" placeholder="Exp Name" required /><br/>
                        <TextInput onChange={handleChange} value={expData.amount} name="amount" type="number" placeholder="Amount" required /><br/> 
                        <Button onClick={addToList}>Add To List</Button>
                    </div>
                    <div className="flow-root">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {
                                expList.map((item,index)=>{
                                    return(
                                        <>
                                            <li className="py-3 sm:py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.expName}</p>
                                                    </div>
                                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{item.amount}</div>
                                                    <div className="flex gap-2">
                                                        <Button onClick={()=>removeItem(index)}>X</Button>
                                                    </div>
                                                </div>
                                            </li>                                    
                                        </>
                                    )
                                })
                            }                        
                        </ul>
                        Total: {expTotal}
                    </div>
                    <Button onClick={handleSubmit} disabled={loading}>Final Submit</Button>
                </Card>                
            </div>

        </>
      );
}