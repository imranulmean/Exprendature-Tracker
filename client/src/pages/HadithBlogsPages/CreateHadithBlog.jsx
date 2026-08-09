import { useState } from "react";
import { Card, TextInput, Label, Button } from "flowbite-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useSelector } from "react-redux";


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

export default function CreateHadithBlog() {

  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [tags, setTags] = useState("");
  const [details, setDetails] = useState("");

  const BASE_API=import.meta.env.VITE_API_BASE_URL;
  const { currentUser } = useSelector((state) => state.user);    
  const [loading, setLoading] = useState(false);

  const handleSubmit = async() => {

    if(!title || !shortDesc || !tags || !details){
        alert("Fields cannot be null")
        return;
    }
    const obj={
        userId: currentUser._id,
        title: title.trim(), 
        shortDesc: shortDesc.trim(),
        tags: tags.split(",").map(t => t.trim()), 
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
                        <TextInput type="text" placeholder="e.g. Bukhari, Prayer, Sincerity" required
                                    onChange={(e) => setTags(e.target.value)}
                        />
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
    </>


  );
}