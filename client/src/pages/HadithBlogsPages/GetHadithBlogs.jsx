import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from 'moment';
import { Link } from "react-router-dom";

export default function GetHadithBlogs(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const { currentUser } = useSelector((state) => state.user);    
    const [loading, setLoading] = useState(false);
    const [hadithBlogs, setHadithBlogs]= useState([]);

    useEffect(()=>{
        getHadithBlogs();
    },[])

    const getHadithBlogs=async()=>{
        setLoading(true)
        try {
            const res= await fetch(`${BASE_API}/hadithApp/getHadithBlogs`,{
              method:"GET",
              headers: {
                "authorization": currentUser.authorization 
                },
            });

            const data= await res.json();
            setHadithBlogs(data.message);
        }
        catch(e){
            console.log(e);
        }finally{
          setLoading(false);
        }
    }

    const deleteHadithBlog = async(blogId)=>{
        setLoading(true)
        const obj={blogId}
        try {
            const res= await fetch(`${BASE_API}/hadithApp/deleteHadithBlog`,{
                method:"POST",
                headers: {
                "authorization": currentUser.authorization,
                "Content-Type": "application/json",
                },
                body: JSON.stringify(obj)                
            });

            const data= await res.json();
            alert(data.message);
        }
        catch(e){
            console.log(e);
        }finally{        
          setLoading(false);
          getHadithBlogs();  
        }        
    }

    return(
        <>
            <div>
                <div className="w-full flex flex-wrap px-4 py-2 gap-2 justify-center">
                    {
                        hadithBlogs.map((e,index)=>{
                            return(
                                <>
                                    <div className="w-full max-w-md flex flex-col border border-gray-400 p-2 rounded-lg">
                                    <p className="text-sm">Id: {e._id}</p>
                                        <p className="text-sm">Title: {e.title}</p>
                                        <p className="text-sm">Short Desc: {e.shortDesc}</p>
                                        <p className="text-sm">Tags: { e.tags.map(t => t.trim()).join(' ,') }</p>
                                        <p className="text-sm">Created At: {moment(e.createdAt).format('MMMM Do YYYY, h:mm a')}</p>
                                        <p className="text-sm">Updated At: {moment(e.updatedAt).format('MMMM Do YYYY, h:mm a')}</p>
                                        <div className="flex gap-2">
                                            <Link to={`/updateHadithBlog/${e._id}`} disabled={loading}
                                                className="w-[50%] bg-gray-900 border p-2 text-gray-200 mt-2 rounded-lg text-center">Update Blog
                                            </Link>
                                            <button onClick={()=>deleteHadithBlog(e._id)} disabled={loading}
                                                className="w-[50%] bg-gray-900 border p-2 text-gray-200 mt-2 rounded-lg">
                                                {loading ? 'Loading...' : 'Delete'}    
                                            </button>
                                        </div>

                                    </div>                                    
                                </>
                            )
                        })
                    }    
                </div>                
            </div>
        </>
    )
}