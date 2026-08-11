import { useEffect, useState } from "react";
import { Card, TextInput, Label, Button } from "flowbite-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import HadithBlogHeader from "./HadithBlogHeader";
import HadithBlogProtetion from "./HadithBlogProtetion";
import { useNavigate } from "react-router-dom";

export const quillModules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

export default function UpdateHadithBlog() {

    const [title, setTitle] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [tags, setTags] = useState("");
    const [details, setDetails] = useState("");

    const [hadithBlog, setHadithBlog] = useState({}); 
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const { currentUser } = useSelector((state) => state.user);    
    const [loading, setLoading] = useState(false);

    const [existingTags, setExistingTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [manualTag, setManualTag] = useState("");
    const navigate= useNavigate();
    const hadithBlogLoginSession= localStorage.getItem('hadithBlogLoginSession')

  const {id} = useParams();

  useEffect(()=>{
    getSingleHadithBlog();
    getUniqueHadithBlogTags();
},[])

    const getSingleHadithBlog=async()=>{
        setLoading(true)
        try {
            const res= await fetch(`${BASE_API}/hadithApp/getSingleHadithBlog/${id}`,{
            method:"GET",
            headers: {
                "authorization": hadithBlogLoginSession
                },
            });

            const data= await res.json();            
            setHadithBlog(data.message);
        }
        catch(e){
            console.log(e);
        }finally{
        setLoading(false);
        }
    }  

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
    
  const handleSubmit = async() => {
    
    if(hadithBlog.tags.length<1){
        alert("Filed not empty")
        return;
    }
    setLoading(true);

    try {
        const res= await fetch(`${BASE_API}/hadithApp/updateHadithBlog`,{
            method:"POST",
            headers: { 
              "authorization": hadithBlogLoginSession,
              "Content-Type": "application/json"
             },
            body: JSON.stringify(hadithBlog)
        })
        const data= await res.json();
        alert(data.message);
        if(data.message === 'Unauthorized'){
            localStorage.removeItem('hadithBlogLoginSession');
            localStorage.removeItem('hadithBlogUserInfo');
            navigate('/hadithBlogLogin');
        }        
    } catch (error) {
        alert(error)
    }
    finally{
        setLoading(false);
        getSingleHadithBlog();
    }    
  }

    const addTag = (tagName) => {

        const newTag = tagName.toLowerCase().trim();

        if (!newTag) {
            return;
        }
        const alreadyExists = hadithBlog.tags.some(
            tag => tag.trim().toLowerCase() === newTag
        );

        if (alreadyExists) {
            alert(`Tag "${newTag}" already exists`);
            return;
        }
        let blogTags= hadithBlog.tags;
        blogTags.push(newTag);
        setHadithBlog(prev=>({...prev, tags:blogTags}))
        setManualTag(''); 
        setSelectedTag('');        
    };  

    if(loading){
        return(
            <>
                <HadithBlogHeader />
                Processing data ....
            </>
        )
    }    
    
  return (
    <>
        <HadithBlogHeader />
        <HadithBlogProtetion>            
            <div className="p-4">
                <Card className="max-w-2xl mx-auto">
                    <div className="space-y-5">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="title">Title:</Label>
                            </div>
                            <TextInput value={hadithBlog.title} type="text" placeholder="Title" required
                                    onChange={(e)=>{ 
                                        setHadithBlog((prev) => ({...prev, title: e.target.value})) 
                                    }}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="shortDesc">Short Description</Label>
                            </div>
                            <TextInput value={hadithBlog.shortDesc} type="text" placeholder="Short Description" required  
                                    onChange={(e)=>{ 
                                        setHadithBlog((prev) => ({...prev, shortDesc: e.target.value})) 
                                    }}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="tags">Tags:</Label>
                            </div>

                            {/* ////////////////////////// */}
                            <div className="flex gap-2">
                                <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}
                                        className="max-w-sm w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="">Select existing tag</option>

                                    {existingTags.map(tag => (
                                        <option key={tag} value={tag}> {tag}</option>
                                    ))}
                                </select>
                                <Button  type="button" onClick={()=>addTag(selectedTag)} disabled={!selectedTag}>
                                    Add
                                </Button>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <TextInput value={manualTag} type="text" placeholder="Type Single Manual Tag" onChange={(e) => setManualTag(e.target.value)} />
                                <Button  type="button" onClick={()=> addTag(manualTag) } disabled={!manualTag}>
                                    Add
                                </Button>                                
                            </div>
                            <p className="flex flex-wrap gap-2 mt-2">
                                {
                                    (hadithBlog && hadithBlog?.tags?.length>0) &&
                                    hadithBlog.tags.map((t, index)=>{
                                        return(
                                            <>
                                                <p className="border-b border-gray-400 text-sm break-all">{t}</p>
                                                <button type="button"
                                                    onClick={() => {
                                                        setHadithBlog(prev => ({
                                                            ...prev,
                                                            tags: prev.tags.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                    className="ml-1 font-bold text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </>
                                        )
                                    })
                                }
                            </p>                                                         
                            {/* ///////////////////// */}
                        </div>

                        <div>
                        <div className="mb-2 block">
                            <Label htmlFor="details">Details:</Label>
                        </div>
                            <ReactQuill
                                theme="snow"
                                value={hadithBlog.details}
                                onChange={(content)=>{ 
                                    setHadithBlog((prev) => ({...prev, details: content})) 
                                }}
                                modules={quillModules}
                                placeholder="Start Writing"
                            />
                        </div>

                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'loading...' : 'Update Post'}
                        </Button>
                    </div>
                </Card>
            </div>
        </HadithBlogProtetion>
    
    </>


  );
}