import { useContext } from "react";
import { Link, useNavigate} from "react-router-dom";
import "./Navbar.css";

import AuthContext from "../Context/AuthProvider";

export const Navbar = ()=>{
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        navigate('/');
    }
    return(

    <div className="navbar">
        {/* <Link to="/Login"> */}
          <button onClick={logout}>Logout</button>
        {/* </Link> */}
        <Link to="/Landing">
          <button>Landing</button>
        </Link>
        <Link to="/createChannel">
          <button>Create New Channel</button>
        </Link>
        <Link to="/showChannels">
          <button>Show all Channels</button>
        </Link>
        <Link to="/search">
          <button>Search</button>
        </Link>
        <Link to="/viewUsers">
          <button>View Users</button>
        </Link>
    </div>


    // <div className="content">{children}</div>
    )
}

export default Navbar;