import { Card, TextInput, Button, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import Header from "../components/Header";

export default function Tasks(){

    const [tasks, setTasks] = useState([]);    
    const [loading, setLoading]= useState(false);
    const [purpose, setPurpose]= useState('');  

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const { currentUser } = useSelector((state) => state.user);    

    useEffect(()=>{
        getTasks();
    },[])

    const getTasks = async() =>{
        const formData={
            userId:currentUser._id
        };        
        try {
            const res= await fetch(`${BASE_API}/api/tasks/getTasks`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
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
            setTasks(data.message)
        }
        catch(e){
            alert(e);
        }finally{
            setLoading(false);            
        }        
    }

    const addTask= async() =>{
   
        if(!purpose ){
            alert("Can not be Null")
            return;
        }
        const formData={
            userId:currentUser._id,
            purpose:purpose.trim()
        };
        
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/api/tasks/addTask`,{
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
            await getTasks();
        }

    }

    const deleteTask= async(taskId) =>{
        const formData={
            userId:currentUser._id,
            taskId
        };        
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/api/tasks/deleteTask`,{
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
            await getTasks();
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
                                <Label htmlFor="password1">Purpose: </Label>
                            </div>
                            <TextInput  onChange={(e)=>setPurpose(e.target.value)}
                                type="text" required />
                        </div>
                        {
                            loading ? (<p>Processing...</p>):(<Button onClick={addTask}>Add Task</Button>)
                            
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
                                    tasks.map((item, index)=>(
                                        <li className="pb-0 pt-3 sm:pt-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="min-w-0 flex-1">                                            
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{index+1}.{' '}{item.purpose}</p>
                                                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item.createdAt}</p>
                                                </div>
                                                <button onClick={()=>deleteTask(item._id)}>
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