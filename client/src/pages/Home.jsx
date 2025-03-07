import { Card, TextInput, Button, Timeline  } from "flowbite-react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiArrowNarrowRight, HiCalendar } from "react-icons/hi";
import Jumbotron from "../components/Jumbotron";
import ExpCard from "../components/ExpCard";
// import ExpSlider from "../components/ExpSlider";

import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import IncomeCard from "../components/IncomeCard";

export default function Home(){

    const navigate=useNavigate();
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const [expList, setExpList] = useState([]);
    const [incomeList, setIncomeList] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(()=>{
        getExpData();
        getIncomeData();
    },[])

    const getExpData = async()=>{
        try {
            const res= await fetch(`${BASE_API}/api/expenses/getExpenses/${currentUser._id}`,{
              method:"GET",
              credentials: "include"
            });

            if(!res.ok){
              const failed= await res.json();
              if(failed.statusCode===401){
                navigate('/login');
              }
            }
            else{
              const data= await res.json();
              setExpList(data);
            }
        }
        catch(e){
            console.log(e);
        }
    }

    const getIncomeData = async()=>{
      try {
          const res= await fetch(`${BASE_API}/api/income/getIncome/${currentUser._id}`,{
            method:"GET",
            credentials: "include"
          });

          if(!res.ok){
            const failed= await res.json();
            if(failed.statusCode===401){
              navigate('/login');
            }
          }
          else{
            const data= await res.json();
            setIncomeList(data);
          }
      }
      catch(e){
          console.log(e);
      }
  }    
    return (
        <>
          <Header />
          <Jumbotron />          
          <div className="w-full flex-col pt-4">   
            <div className="w-full flex flex-col justify-center items-center mb-3">
              <a href='https://drive.google.com/file/d/1KY7v3Z77lRBWYVNYwo2OerlZku8L0-s7/view' className="truncate text-md font-medium text-blue-900 dark:text-white">{'How to Add Data >>'}</a>
              <Link  to='/insertion' className="truncate text-md font-medium text-blue-900 dark:text-white">{'Click to Add Your Data Here >>'}</Link>              
            </div>
            {/* {
                expList.length>0 &&
                <ExpSlider expList={expList} currentUser={currentUser} />
            } */}
            <div className="overflow-x-auto">
              <Tabs aria-label="Full width tabs" variant="fullWidth">
                <Tabs.Item active title="Expense" icon={HiUserCircle}>
                    <div className="w-full flex flex-col justify-center md:flex-row flex-wrap gap-2 bg-gray-100 p-2">
                      { 
                        expList.map((item,index)=>{
                          return(
                            <>
                                <ExpCard item={item} currentUser={currentUser} />                  
                            </>
                          )
                        
                        })
                      }              
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Income" icon={MdDashboard}>
                <div className="w-full flex flex-col justify-center md:flex-row flex-wrap gap-2 bg-gray-100 p-2">
                      { 
                        incomeList.map((item,index)=>{
                          return(
                            <>
                                <IncomeCard item={item} currentUser={currentUser} />                  
                            </>
                          )
                        
                        })
                      }              
                    </div>
                </Tabs.Item>
              </Tabs>
            </div>            
          </div>  
        </>

      );
}


