import SignUp from "./pages/Signup";
import {Routes,Route} from "react-router-dom"; 
import Login from "../src/pages/Login";
import Home from "../src/pages/Home";
import ComposeMail from "./pages/ComposeMail"
const App=()=>{


  return (
    <Routes>
     <Route path="/signup" element={<SignUp />}/>
     <Route path="/login" element={<Login />} />
     <Route path="/home" element={<Home />} />
     <Route path="/composeMail" element={<ComposeMail />} />

    </Routes>

  )

}
export default App;

