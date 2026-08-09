import { useEffect, useState } from "react";
import { Card, TextInput, Label, Button } from "flowbite-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";


const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    ["blockquote", "link"],
    [{ list: "ordered" }, { list: "bullet" }],
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
  
  const {id} = useParams();

  useEffect(()=>{
    getSingleHadithBlog();
},[])

    const getSingleHadithBlog=async()=>{
        setLoading(true)
        try {
            const res= await fetch(`${BASE_API}/hadithApp/getSingleHadithBlog/${id}`,{
            method:"GET",
            headers: {
                "authorization": currentUser.authorization 
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

  const handleSubmit = async() => {

    // if(!title || !shortDesc || !tags || !details){
    //     alert("Fields cannot be null")
    //     return;
    // }
    // const obj={
    //     userId: currentUser._id,
    //     title: title.trim(), 
    //     shortDesc: shortDesc.trim(),
    //     tags: tags.split(",").map(t => t.trim()), 
    //     details: details.trim()
    // };
    console.log(hadithBlog)
    return;
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
    } catch (error) {
        alert(error)
    }
    finally{
        setLoading(false);
    }    
  }
  return (
    <>
        <div className="p-4">
            <Card className="max-w-2xl mx-auto">
                <div className="space-y-5">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="title">Title:</Label>
                        </div>
                        <TextInput value={hadithBlog.title} type="text" placeholder="Title" required
                                onChange={(e)=>{ 
                                    setHadithBlog((prev) => ({...prev, title: e.target.value.trim()})) 
                                }}
                        />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="shortDesc">Short Description</Label>
                        </div>
                        <TextInput value={hadithBlog.shortDesc} type="text" placeholder="Short Description" required  
                                onChange={(e)=>{ 
                                    setHadithBlog((prev) => ({...prev, shortDesc: e.target.value.trim()})) 
                                }}
                        />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="tags">Tags:</Label>
                        </div>
                        <TextInput value={hadithBlog.tags} type="text" placeholder="e.g. Bukhari, Prayer, Sincerity" required
                                    onChange={(e)=>{ 
                                        setHadithBlog((prev) => ({...prev, tags: (e.target.value).split(' ,').map( t=> t.trim())})) 
                                    }}                                    
                        />
                    </div>

                    <div>
                    <div className="mb-2 block">
                        <Label htmlFor="details">Details:</Label>
                    </div>
                        <ReactQuill
                            theme="snow"
                            value={hadithBlog.details}
                            onChange={(e)=>{ 
                                setHadithBlog((prev) => ({...prev, details: e.target.value.trim()})) 
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
    </>


  );
}