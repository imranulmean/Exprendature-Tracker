import { Button, Card } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export default function OAuth() {
    
    const BASE_API=import.meta.env.VITE_API_BASE_URL
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading]= useState(false);

    const handleGoogleClick = async () =>{
        setLoading(true);
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch(`${BASE_API}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    displayName: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
                })
            const data = await res.json()
            setLoading(false);
            if (res.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    } 
  return (
        <div>
            <Card className="max-w-sm flashing-border">
                <img src="/logo.PNG"/>
                <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick} disabled={loading}>
                    <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
                    Continue with Google
                </Button>
            </Card>
        </div>
  )
}