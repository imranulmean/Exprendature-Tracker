import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from 'moment';
import { Link, useNavigate } from "react-router-dom";
import HadithBlogHeader from "./HadithBlogHeader";
import HadithBlogProtetion from "./HadithBlogProtetion";
import { useSearchParams } from "react-router-dom";
import PaginationButtons from "../../components/PaginationButtons";

export default function GetHadithBlogs(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [hadithBlogs, setHadithBlogs]= useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const hadithBlogLoginSession= localStorage.getItem('hadithBlogLoginSession')
    const navigate= useNavigate();
    const [selectedTag, setSelectedTag] = useState("");
    const [existingTags, setExistingTags] = useState([]);

    const [limit, setLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);

    const q = searchParams.get("q") || "all";
    const page = parseInt(searchParams.get('page')) || 1;    

    useEffect(() => {

        window.scrollTo(0,0)
        setSelectedTag(q);
        
        getHadithBlogs();

    }, [searchParams]);      

    const  getUniqueHadithBlogTags= async()=>{
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/hadithApp/getUniqueHadithBlogTags`,{
                method:"GET",
                headers: { 
                "authorization": hadithBlogLoginSession,
                "Content-Type": "application/json"
                }
            })
            const data= await res.json();
            if(data.success){
                setExistingTags(data.message);
            }
            
        } catch (error) {
            alert(error)
        }
        finally{
            setLoading(false);
        }     
    }    

    const getHadithBlogs=async()=>{
        setHadithBlogs([]);
        setLoading(true)
        try {

            await getUniqueHadithBlogTags();
            const res= await fetch(`${BASE_API}/hadithApp/getHadithBlogs?q=${q}&page=${page}&limit=${limit}`,{
              method:"GET",
              headers: {
                "authorization": hadithBlogLoginSession
                },
            });

            const data= await res.json();
            if(data.message === 'Unauthorized'){
                localStorage.removeItem('hadithBlogLoginSession');
                localStorage.removeItem('hadithBlogUserInfo');
                navigate('/hadithBlogLogin');
            }              
            setHadithBlogs(data.message);
            setTotalPages(data.totalPages);
            setTotal(data.total);
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
                "authorization": hadithBlogLoginSession,
                "Content-Type": "application/json",
                },
                body: JSON.stringify(obj)                
            });

            const data= await res.json();
            alert(data.message);
            if(data.message === 'Unauthorized'){
                localStorage.removeItem('hadithBlogLoginSession');
                localStorage.removeItem('hadithBlogUserInfo');
                navigate('/hadithBlogLogin');
            }              
        }
        catch(e){
            console.log(e);
        }finally{        
          setLoading(false);
          getHadithBlogs();  
        }        
    }

    const changePage = (newPage) => {
        setSearchParams({ q:q, page: newPage });
    };    

    const handleChange= (selectedValue)=>{
        setSelectedTag(selectedValue);
        setSearchParams({ q:selectedValue });
    }

    if(loading){
        return(
            <>
                <HadithBlogHeader />
                Processing data ....
            </>
        )
    }
    return(
        <>  
            <HadithBlogHeader />
            {/* <HadithBlogProtetion>                 */}
                <div className="flex flex-col items-center">
                    {/* total count */}

                    <div className="flex flex-col gap-2 mt-4 px-4">
                        <select value={selectedTag} onChange={(e)=>handleChange(e.target.value)}
                                className="max-w-sm w-full border rounded-lg px-3 py-2"
                        >
                            <option value="all">All</option>

                            {existingTags.map(tag => (
                                <option key={tag} value={tag}> {tag}</option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-900 ">
                            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} 
                        </p>                            
                    </div>                        
  
                    <div className="w-full flex flex-wrap px-4 py-2 gap-2 justify-center">
                        {
                            hadithBlogs.map((e,index)=>{
                                return(
                                    <>
                                        <div className="w-full max-w-md flex flex-col border border-gray-400 p-2 rounded-lg">
                                            <p className="text-sm">Id: {e._id}</p>
                                            <p className="text-sm">Title: {e.title}</p>
                                            <p className="text-sm">Short Desc: {e.shortDesc}</p>
                                            <p className="text-sm flex flex-wrap gap-2">
                                                Tags:
                                                {
                                                    e.tags.map((tag)=>{
                                                        return <Link to={`/getHadithBlogs/?q=${tag}`} 
                                                                className="border-b border-gray-400 text-sm break-all"
                                                                >{tag}</Link>
                                                    })
                                                }
                                            </p>
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
                    <PaginationButtons page={page} totalPages={totalPages} changePage={changePage} />                   
                </div>                
            {/* </HadithBlogProtetion> */}

        </>
    )
}