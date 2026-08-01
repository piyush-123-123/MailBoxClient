import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const Home=()=>{
    const navigate=useNavigate();

    const sendMailHandler=()=>{
         navigate("/composeMail");
     
    }

    return (
        <div>
            <Button onClick={sendMailHandler}>Click to send mail</Button>
            
        </div>
    )

}
export default Home;