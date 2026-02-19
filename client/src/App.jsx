import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeaderPublic from './components/HeaderPublic';
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
import UpdateIncome from './pages/UpdateIncom';
import QRcodeGenerator from './pages/QRcodeGenerator';
import QrReader from './pages/QrReader';
import StartPractice from './components/StartPractice';
import ReactSpeech from './components/ReactSpeech';
import UploadFile from './pages/UploadFile';
import Postgres from './pages/Postgres';
import OnlineCall from './pages/OnlineCall';
import ZakatList from './pages/ZakatList';
import AddZakatItem from './pages/AddZakatItem';

export default function App(){

  return(
    <BrowserRouter>      
      {/* <Megamenu /> */}
      {/* <Leftbar /> */}
      <Routes>        
        <Route path='/login' element={<Login />} />
        <Route path='/startPractice' element={<StartPractice />} />
        <Route path='/speechTest' element={<ReactSpeech />} />v
        <Route path='/upload' element={<UploadFile />} />
        <Route path='/postgres' element={<Postgres />} />
        <Route path='/call' element={<OnlineCall />} />

        <Route element={<PrivateRoute />}>
          {/* <Route path='/' element={<Home />} /> */}
          <Route path='/' element={<ZakatList />} />
          <Route path='/insertion' element={<Insertion />} />
          <Route path='/income' element={<Income />} />
          <Route path='/updateExp/:userId/:monthName/:year' element={<UpdateExp />} />
          <Route path='/updateIncome/:userId/:monthName/:year' element={<UpdateIncome />} />
          <Route path='/qrCodeGenerator' element={<QRcodeGenerator />} />
          <Route path='/qrCodeReader' element={<QrReader />} />
          <Route path='/zakats' element={<ZakatList />} />
          <Route path='/zakats/addItem/:year/:yearlyZakatId' element={<AddZakatItem />} />
        </Route>

        <Route element= {<AdminPrivateRoute/>} >
          <Route path='/users' element={<Users />} />
        </Route> 

        <Route path="*" element={<Navigate to="/" />} />   
      </Routes>
    </BrowserRouter>    
  )
}