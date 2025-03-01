import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Megamenu from './components/Megamenu';
import Leftbar from './components/Leftbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Insertion from './pages/Insertion';
import UpdateExp from './pages/UpdateExp';
import { Navigate } from "react-router-dom";
import AdminPrivateRoute from './components/AdminPrivateRoute';
import Users from './pages/Users';
import Income from './pages/Income';

export default function App(){

  return(
    <BrowserRouter>      
      {/* <Megamenu /> */}
      {/* <Leftbar /> */}
      <Routes>        
        <Route path='/login' element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/insertion' element={<Insertion />} />
          <Route path='/income' element={<Income />} />
          <Route path='/updateExp/:userId/:monthName/:year' element={<UpdateExp />} />
        </Route>

        <Route element= {<AdminPrivateRoute/>} >
          <Route path='/users' element={<Users />} />
        </Route> 

        <Route path="*" element={<Navigate to="/" />} />   
      </Routes>
    </BrowserRouter>    
  )
}