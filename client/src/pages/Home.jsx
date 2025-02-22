import { Card, TextInput, Button, Timeline  } from "flowbite-react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiArrowNarrowRight, HiCalendar } from "react-icons/hi";

export default function Home(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const [expList, setExpList] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(()=>{
        getExpData();
    },[])

    const getExpData = async()=>{

        try {
            const res= await fetch(`${BASE_API}/api/expenses/getExpenses/${currentUser._id}`);
            const data= await res.json();
            setExpList(data);

        }
        catch(e){
            console.log(e);
        }
    }
    return (
        <>
          <Header />
          
          <div className="w-full flex-col">   
            <div className="w-full flex justify-center items-center mb-3">
              <Link  to='/insertion' className="truncate text-md font-medium text-blue-900 dark:text-white">{'Click to Add Your Data Here >>'}</Link>         
            </div>            
            <div className="w-full flex flex-col justify-center md:flex-row flex-wrap gap-2">
              { 
                expList.map((item,index)=>{
                  return(
                    <>
                      <Card className="w-full md:w-[350px]">
                          <div className="mb-4 flex items-center justify-between">
                            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{item.monthName} {item.year}</h5>
                          </div>
                          <div className='same_height'>
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {
                                        item.expList.map((e,index)=>{
                                            return(
                                                <>
                                                    <li className="py-3 sm:py-4">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{e.expName}</p>
                                                            </div>
                                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{e.amount}</div>
                                                        </div>
                                                    </li>                                    
                                                </>
                                            )
                                        })
                                    }                        
                                </ul>
    
                            </div>
                            
                            <div>
                              <ul className="divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-900">
                                <li className="py-3 sm:py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Total</p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{item.total}</div>
                                    </div>
                                </li>                                   
                              </ul>                                                 
                              <Button color="light">
                                <Link to={`/updateExp/${currentUser._id}/${item.monthName}/${item.year}`}>Update</Link>
                              </Button>  
                            </div>                        
                          </div>                      

                          
                      </Card>                    
                    </>
                  )
                
                })
              } 
             
            </div>                     
          </div>  
        </>

      );
}


