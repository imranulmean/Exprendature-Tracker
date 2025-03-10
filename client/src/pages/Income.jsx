import Header from "../components/Header";
import { Card, TextInput, Button, Label } from "flowbite-react";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Income(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [incomeData, setincomeData] = useState({incomeName:'', amount:'', totalCashInHand:0, monthlyCashInHand:0});
    const [incomeList, setincomeList] = useState([]);    
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const { currentUser } = useSelector((state) => state.user);
    const [incomeTotal, setincomeTotal]= useState(0);
    let total=0;
    const [loading, setLoading]= useState(false);
    const [showBox, setShowBox]= useState(false);
    const [totalCash, setTotalCash]= useState(0);
    const [currentIncome, setCurrentIncome]= useState({});

    useEffect(()=>{
        total= incomeList.reduce((acc, e) => acc + Number(e.amount), 0);
        setincomeTotal(total);
    },[incomeList]);

    useEffect(()=>{
        getincomeData();
    },[])

    const getincomeData = async()=>{
        setLoading(true);
        const monthName=formatMonth(today);
        const year=formatYear(today);
        const formData={
            userId:currentUser._id,
            year,
            monthName
        };
        try {
            const res= await fetch(`${BASE_API}/api/income/getCurrentMonth`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body:JSON.stringify(formData),
            })
            const data= await res.json();
            if(data.incomeList){
                setincomeList(data.incomeList);
            }
            if(data){
                setCurrentIncome(data)
            }            
            setLoading(false);
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
        if(!incomeData.incomeName || !incomeData.amount){
            alert('insert value');
            return;
        }
        const trimmedincomeName=incomeData.incomeName.trim();

        setincomeList((prev)=>[...prev, { ...incomeData, incomeName:trimmedincomeName }]);
        setincomeData({incomeName:'', amount:''});        
    }

    const handleChange = (e) => {
        setincomeData({ ...incomeData, [e.target.name]: e.target.value });
      };
     
    const handleSubmit= async() =>{
        setLoading(true);
        const monthName=formatMonth(today);
        const year=formatYear(today);
        total= incomeList.reduce((acc, e) => acc + Number(e.amount), 0);
        const formData={
            userId:currentUser._id,
            year,
            monthName,
            incomeList,
            total
        };
        try{
            const res= await fetch(`${BASE_API}/api/income/addIncome`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify(formData),
            })
            if(res.ok){
                setLoading(false);
                // navigate('/')
                await getincomeData();
            }            
        }   
        catch(e){
            console.log(e);
        }
    }  

    const removeItem=(index)=>{
        const newList=[...incomeList];
        newList.splice(index,1);
        setincomeList(newList);
    }

    const openTotalCash = () =>{
        setShowBox((prev)=>!prev);
    }

    const handleTotalCash= (e) =>{
        setTotalCash(e.target.value);
    }

    const addTotalCash = async() =>{
        setLoading(true);
        const formData={
            userId:currentUser._id,
            totalCash
        };
        try{
            const res= await fetch(`${BASE_API}/api/income/addTotalCash`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify(formData),
            })
            if(res.ok){
                setLoading(false);
                setShowBox(false);
                alert("Total Cash in hand Added")                
            }
        }   
        catch(e){
            console.log(e);
        }        
    }

    return (
        <>
            <Header />
            <div className="flex justify-center pt-4 bg-gray-100">
                <Card className="w-full md:w-[500px]">
                    <div className="mb-4 flex-col items-center justify-between gap-2">
                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-2">Income of {formatMonth(today)} {formatYear(today)}</h5>
                        <div>
                            <Button onClick={openTotalCash}>
                                <div className="flex flex-col z-0">
                                {
                                    currentIncome.overAllTotalCash &&
                                    <p>OverAll Total Cash:{currentIncome.overAllTotalCash.totalCash}</p>
                                }                                
                                <p>If You have Previous Total Cash in Hand Click to Add Here</p>
                                </div>
                            </Button>
                            {
                                showBox &&
                                <>
                                    <TextInput value={totalCash} onChange={handleTotalCash} id="totalCashInHand" name="totalCashInHand" type="number" placeholder="Input Total Cash in Hand default 0" required />
                                    <Button onClick={addTotalCash} disabled={loading}>Add Total Cash</Button>
                                </>
                            }                                                        
                        </div>
                        <Label value="Input  Income Below:" />                   
                        <TextInput onChange={handleChange} value={incomeData.incomeName} name="incomeName" type="text" placeholder="Income Name" required /><br/>
                        <TextInput onChange={handleChange} value={incomeData.amount} name="amount" type="number" placeholder="Amount" required /><br/> 
                        <Button onClick={addToList}>Add To List</Button>
                    </div>
                    <div className="flow-root">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {
                                incomeList.map((item,index)=>{
                                    return(
                                        <>
                                            <li className="py-3 sm:py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.incomeName}</p>
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
                        Total: {incomeTotal}
                        <div className="mb-2">
                            <div className="mb-2">
                                <p>Monthly Cash in Hand: {currentIncome.monthlyCashInHand}</p>
                                <p>Total Cash (this month):{currentIncome.totalCashInHand}</p> 
                                {
                                    currentIncome.overAllTotalCash &&
                                    <p>OverAll Total Cash:{currentIncome.overAllTotalCash.totalCash}</p>
                                }                               
                            </div>                            
                        </div>
                    </div>
                    <Button onClick={handleSubmit} disabled={loading}>Final Submit</Button>
                </Card>                
            </div>

        </>
      );
}