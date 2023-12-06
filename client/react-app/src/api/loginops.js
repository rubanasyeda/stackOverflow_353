import axios from "axios"


export const SignUpNewUser = async (userData) => {

  try {
    const response = await axios.post("http://localhost:80/registerUser", userData);
    console.log("Axios response: ",response.data);
    return response.data; // Assuming your server sends back relevant data
  } catch (error) {
    throw error; // Re-throw the error so the calling code can handle it
  }
};


export const login = async (userData) => {
    console.log("Axios Login is called: ", userData);
    try {
      const response = await axios.post("http://localhost:80/loginUser", userData);
      return response.data;
    } catch (error) {
      console.error("Could not send login data in axios: ", error);
    }
 };

export default {SignUpNewUser, login};