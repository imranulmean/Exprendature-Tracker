import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Megamenu from './components/Megamenu';
import Leftbar from './components/Leftbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

export default function App(){

  return(
    <BrowserRouter>      
      {/* <Megamenu /> */}
      {/* <Leftbar /> */}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
        </Route>        
      </Routes>
    </BrowserRouter>    
  )
}