import { useEffect, useState } from "react"
import { deleteUser, getUsers as getUserAPI } from "../api/messages"
import "./Users.css";
import useAuth from "../hooks/useAuth";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const { auth } = useAuth();
    const isAdmin = auth.role === 0;
  
    useEffect(() => {
      getUserAPI()
        .then((response) => {
            console.log(response);
          setUsers(response);
        })
        .catch((error) => {
          console.error("Could not get users");
        });
    }, []);

    const handleDelete = (username) => {
        if(window.confirm(`Are you sure you want to delete thsi user: ${username}`)){
        deleteUser(username)
            .then((response)=>{
                console.log("User deleted: ",response);
            })
            .catch((err)=>{
                console.error("User not deleted: ",err);
            })
        }
    }
  
    return (
      <>
        <div className="user-container">
          {users && users.map((user) => (
            <div className="user" key={user.username}>
              <p>Name: {user.name}</p>
              <p>Username: {user.username}</p>
              {isAdmin && user.username !== "admin" && <button onClick={() => handleDelete(user.username)}>Delete</button>}
            </div>
          ))}
        </div>
      </>
    );
  };
  