import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Megamenu from './components/Megamenu';
import Leftbar from './components/Leftbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Insertion from './pages/Insertion';
import UpdateExp from './pages/UpdateExp';

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
          <Route path='/updateExp/:userId/:monthName/:year' element={<UpdateExp />} />
        </Route>        
      </Routes>
    </BrowserRouter>    
  )
}