import { useEffect, useState } from "react";
import { Card, TextInput, Label, Button } from "flowbite-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { quillModules } from "./UpdateHadithBlog";
import HadithBlogHeader from "./HadithBlogHeader";
import HadithBlogProtetion from "./HadithBlogProtetion";
import { useNavigate } from "react-router-dom";


export default function CreateHadithBlog() {

  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [tags, setTags] = useState([]);
  const [details, setDetails] = useState("");

  const BASE_API=import.meta.env.VITE_API_BASE_URL;
  const { currentUser } = useSelector((state) => state.user);    
  const [loading, setLoading] = useState(false);
  const [existingTags, setExistingTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [manualTag, setManualTag] = useState("");
  const navigate= useNavigate();

  useEffect(()=>{
    getUniqueHadithBlogTags();
  },[])  

  const  getUniqueHadithBlogTags= async()=>{
    setLoading(true);
    try {
        const res= await fetch(`${BASE_API}/hadithApp/getUniqueHadithBlogTags`,{
            method:"GET",
            headers: { 
              "authorization": currentUser.authorization,
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

    const addTag = (tagName) => {

        const newTag = tagName.toLowerCase().trim();

        if (!newTag) {
            return;
        }
        const alreadyExists = tags.some(
            tag => tag.trim().toLowerCase() === newTag
        );

        if (alreadyExists) {
            alert(`Tag "${newTag}" already exists`);
            return;
        }        
        setTags(prev => [ ...prev, newTag]);
        setManualTag(''); 
        setSelectedTag('');        
    };

  const handleSubmit = async() => {
    
    if(!title || !shortDesc || tags.length<1 || !details){
        alert("Fields cannot be null")
        return;
    }
    const obj={
        userId: currentUser._id,
        title: title.trim(), 
        shortDesc: shortDesc.trim(),
        tags: tags, 
        details: details.trim()
    };
    setLoading(true);

    try {
        const res= await fetch(`${BASE_API}/hadithApp/createHadithBlog`,{
            method:"POST",
            headers: { 
              "authorization": currentUser.authorization,
              "Content-Type": "application/json"
             },
            body: JSON.stringify(obj)
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
    }    
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
                            <TextInput type="text" placeholder="Title" required
                                        onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="shortDesc">Short Description</Label>
                            </div>
                            <TextInput type="text" placeholder="Short Description" required  
                                        onChange={(e) => setShortDesc(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="tags">Tags:</Label>
                            </div>
                            <div className="flex gap-2">
                                <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}
                                        className="border rounded-lg px-3 py-2"
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

                            <p className="flex flex-wrap gap-2">
                                {
                                    tags.map((t, index)=>{
                                        return(
                                            <>
                                                <p>{t}</p>
                                                <button type="button"
                                                    onClick={() => {
                                                        setTags(prev =>
                                                            prev.filter((_, i) => i !== index)
                                                        );
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

                        </div>

                        <div>
                        <div className="mb-2 block">
                            <Label htmlFor="details">Details:</Label>
                        </div>
                            <ReactQuill
                                theme="snow"
                                value={details}
                                onChange={setDetails}
                                modules={quillModules}
                                placeholder="Start Writing"
                            />
                        </div>

                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'loading...' : 'Publish Post'}
                        </Button>
                    </div>
                </Card>
            </div>             
        </HadithBlogProtetion>
   
    </>


  );
}