import Header from "../components/Header";
import { Card, TextInput, Button } from "flowbite-react";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencilAlt, HiX  } from "react-icons/hi";

export default function UpdateExp(){
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { userId, monthName, year } = useParams();
    const [expData, setExpData] = useState({expName:'', amount:''});
    const [expList, setExpList] = useState([]);    
    const { currentUser } = useSelector((state) => state.user);
    const [expTotal, setExpTotal]= useState(0);
    let total=0;
    const [loading, setLoading]= useState(false);
    const [openExpEditIndex, setOpenExpEditIndex] = useState(-1);
    const [updateExpData, setUpdateExpData]= useState({});

    useEffect(()=>{
        total= expList.reduce((acc, e) => acc + Number(e.amount), 0);
        setExpTotal(total);
    },[expList]);

    useEffect(()=>{
        getExpData();
    },[])

    const getExpData = async()=>{

        setLoading(true);
        const formData={
            userId,
            year,
            monthName
        };
        try {
            const res= await fetch(`${BASE_API}/api/expenses/getCurrentMonth`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            setExpList(data[0].expList);
            setLoading(false);

        }
        catch(e){
            console.log(e);
        }
    }

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
    const handleUpdate = (e) =>{
        setUpdateExpData({...updateExpData, [e.target.name]:e.target.value});
    }
    const handleSubmit= async() =>{
        
        setLoading(true);
        total= expList.reduce((acc, e) => acc + Number(e.amount), 0);
        const formData={
            userId,
            year,
            monthName,
            expList,
            total
        };
        try{
            const res= await fetch(`${BASE_API}/api/expenses/addExpenses`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify(formData),
            })
            // await getExpData();
            setLoading(false);
            navigate('/')
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

    const openEditExp= (index, item) => {
        setUpdateExpData(item);
        setOpenExpEditIndex(index);
    }

    const handleUpdateExp=(index)=>{
        if(!updateExpData.expName || !updateExpData.amount){
            alert("input data to update")
            return;
        }
        
        const updatedExpList=[...expList];
        updatedExpList[index]['expName']=updateExpData.expName;
        updatedExpList[index]['amount']=updateExpData.amount;
        setExpList(updatedExpList);
    }
    return (
        <>
            <Header />
            <div className="flex justify-center pt-4 bg-gray-100">
                <Card className="w-full md:w-[500px]">
                    <div className="mb-4 flex-col items-center justify-between gap-2">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-2">Expense of {monthName} {year}</h5>
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
                                            <li className="py-3 sm:py-4 flex flex-col gap-2">
                                                <div className="flex items-center space-x-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.expName}</p>
                                                    </div>
                                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{item.amount}</div>
                                                    <div className="flex gap-2">
                                                            <HiOutlinePencilAlt className="cursor-pointer" onClick={()=>openEditExp(index, item)}/>
                                                            <HiX className="cursor-pointer" onClick={()=>removeItem(index)}/>
                                                    </div>
                                                </div>
                                                {
                                                    openExpEditIndex == index &&
                                                        <div className="flex flex-row gap-2">
                                                            <TextInput onChange={handleUpdate} value={updateExpData.expName} name="expName" type="text" placeholder="Exp Name" required /><br/>
                                                            <TextInput onChange={handleUpdate} value={updateExpData.amount} name="amount" type="number" placeholder="Amount" required /><br/> 
                                                            <Button onClick={()=>handleUpdateExp(index)}>Update</Button>
                                                        </div>                                                    
                                                }                      
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