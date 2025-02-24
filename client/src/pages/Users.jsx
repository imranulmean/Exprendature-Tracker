import { useEffect } from "react";

export default function Users(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;

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
              console.log(data);
            }


        }
        catch(e){
            console.log(e);
        }
    }

    return(
        <>
            Showing Users
        </>
    )
}