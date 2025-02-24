import { useEffect, useState } from "react";
import Header from "../components/Header";
import Jumbotron from "../components/Jumbotron";
import { Card, TextInput, Button, Timeline  } from "flowbite-react";

export default function Users(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const [userList, setUserList]= useState([]);

    useEffect(()=>{
        getUsers();
    },[]);

    const getUsers=async()=>{

        try {
            const res= await fetch(`${BASE_API}/api/adminApi/getUsers`,{
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
              setUserList(data);
            }


        }
        catch(e){
            console.log(e);
        }
    }

    return(
        <>
          <Header />
          <Jumbotron />
          <div className="w-full flex-col p-4">
            <Card className="w-full md:w-[350px]">
              <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Users</h5>
              </div>
                
              <div className="flow-root ">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto h-[300px] ">
                      {
                          userList.map((e,index)=>{
                              return(
                                  <>
                                      <li className="py-3 sm:py-4">
                                          <div className="flex items-center space-x-4">
                                              <div className="shrink-0">
                                                <img alt="Neil image" height="32" src={e.profilePicture} width="32" className="rounded-full"
                                                />
                                              </div>                                              
                                              <div className="min-w-0 flex-1">
                                                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{e.displayName}</p>
                                                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{e.email}</p>
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