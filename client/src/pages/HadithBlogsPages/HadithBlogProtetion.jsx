import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HadithBlogProtetion({children}){
    
    const navigate= useNavigate();
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const hadithBlogLoginSession= localStorage.getItem('hadithBlogLoginSession');
    const [loading, setLoading]= useState(false);
    const [validated, setValidated]= useState(false);

    useEffect(()=>{
        hadithBlogValidateUser();
    },[])

    const hadithBlogValidateUser= async() =>{
        if(!hadithBlogLoginSession){
            navigate('/hadithBlogLogin');            
        }
        else{
            setLoading(true);
            try {
                const res= await fetch(`${BASE_API}/api/auth/hadithBlogValidateUser`,{
                    method:"GET",
                    headers: {
                        "authorization": hadithBlogLoginSession, 
                        "Content-Type": "application/json"
                    },
                })
                const data= await res.json();
                if(!data.success){                    
                    localStorage.removeItem('hadithBlogLoginSession');
                    localStorage.removeItem('hadithBlogUserInfo');
                    navigate('/hadithBlogLogin');
                }
                setValidated(true);

            } catch (error) {
                alert(error)
            }
            finally{
                setLoading(false);
            }
        }

    }
    
     if(validated) return children
}