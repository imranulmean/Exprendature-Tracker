import { useEffect, useState } from "react";
import Header from "../components/Header";
import Jumbotron from "../components/Jumbotron";
import { Card, TextInput, Label  } from "flowbite-react";
import { useSelector } from 'react-redux';

export default function Users(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const [userList, setUserList]= useState([]);
    const { currentUser } = useSelector((state) => state.user);   

    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [displayName, setDisplayName]=useState('');
    const [loading, setLoading]= useState(false);
    const [updatedPass, setUpdatedPass] = useState();    

    useEffect(()=>{
        getUsers();
    },[]);

    const getUsers=async()=>{
        setLoading(true)
        try {
            const res= await fetch(`${BASE_API}/api/adminApi/getUsers`,{
              method:"GET",
              headers: {
                "authorization": currentUser.authorization 
                },
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
        }finally{
          setLoading(false);
        }
    }


    const handleSubmit = async (e) => {
      e.preventDefault();        
      if(!email || !password || !displayName){
          alert("Fields cannot be null")
          return;
      }
      const obj={email:email.trim(), password:password.trim(), displayName:displayName.trim()};
      setLoading(true);
      try {
          const res= await fetch(`${BASE_API}/api/auth/createHadithBlogUser`,{
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
    };    

    const updateHadithBlogUser= async(userId)=>{
      if(!updatedPass){
          alert("Empty Filed")
          return;
      }
      const obj={userId, updatedPass}
      setLoading(true);
      try {
          const res= await fetch(`${BASE_API}/api/auth/updateHadithBlogUser`,{
              method:"POST",
              headers: { 
                  "Content-Type": "application/json",
                  "authorization": currentUser.authorization,
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
          await getUsers();
          setUpdatedPass('')
      }

  } 

  const deleteHadithBlogUser= async(userId)=>{

    const obj={userId, updatedPass}
    setLoading(true);
    try {
        const res= await fetch(`${BASE_API}/api/auth/deleteHadithBlogUser`,{
            method:"POST",
            headers: { 
                "Content-Type": "application/json",
                "authorization": currentUser.authorization,
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
        await getUsers();
    }

}   

    return(
        <>
          <Header />
          <Jumbotron />
          <div className="w-full flex flex-wrap gap-2 p-4">

            <div className="max-w-md w-full border border-gray-400 rounded-lg p-4 flex flex-col items-center">
              <h3 className="text-lg font-bold">Create User</h3>        

              <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1">Email: </Label>
                    </div>
                    <TextInput onChange={(e)=>setEmail(e.target.value)} id="email1" type="text" placeholder="Email" required 
                    style={{'border':'none', 'border-radius':'0px', 'border-bottom':'1px solid #E5E7EB', 'background':'white', 'box-shadow':'none'}} 
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                    <Label htmlFor="password1">Password</Label>
                    </div>
                    <TextInput onChange={(e)=>setPassword(e.target.value)} id="password1" type="password" placeholder="Password" required 
                    style={{'border':'none', 'border-radius':'0px', 'border-bottom':'1px solid #E5E7EB', 'background':'white', 'box-shadow':'none'}} 
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1">Display Name: </Label>
                    </div>
                    <TextInput onChange={(e)=>setDisplayName(e.target.value)} id="displayName" type="text" placeholder="Display Name" required 
                    style={{'border':'none', 'border-radius':'0px', 'border-bottom':'1px solid #E5E7EB', 'background':'white', 'box-shadow':'none'}} 
                    />
                </div>                                  
                {
                    loading && <h1>Processing ...</h1>
                }
                {
                    !loading &&
                    <button disabled={loading} type="submit" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 text-center text-sm font-medium text-gray-100 hover:bg-cyan-900">Submit</button>
                }
              </form>                
                     
            </div>             

            <Card className="max-w-md w-full">
              <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Users</h5>
                <button onClick={getUsers} disabled={loading}
                      className="bg-gray-900 text-gray-200 text-center text-sm font-medium px-2 py-1 rounded-md">
                      {loading ? 'loading...' : 'Reload'}
                </button>                 
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
                                              <div className="w-full flex flex-col gap-2">
                                                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{e._id}</p>
                                                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{e.displayName}</p>
                                                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{e.email}</p>
                                                  <input type="password"  onChange={(e)=>setUpdatedPass(e.target.value)} placeholder="new password"
                                                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-500"
                                                  />
                                                  <div className="flex gap-2 justify-center">
                                                    <button onClick={() => updateHadithBlogUser(e._id)} disabled={loading}
                                                          className="bg-gray-900 text-gray-200 text-center text-sm font-medium p-2 rounded-md">
                                                          {loading ? 'loading...' : 'Update User'}
                                                    </button>  
                                                    <button onClick={() => deleteHadithBlogUser(e._id)} disabled={loading}
                                                          className="bg-gray-900 text-gray-200 text-center text-sm font-medium p-2 rounded-md">
                                                          {loading ? 'loading...' : 'Delete User'}
                                                    </button> 
                                                  </div>
                                                                                                                                                                                                       
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