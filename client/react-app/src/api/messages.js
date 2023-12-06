import axios from "axios";

export const fetchMessages = async (channelId) => {
    try {
      const response = await fetch(`http://localhost:80/messagesByChannel?channel_id=${channelId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    //   setBackendComments(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  export const postMessage = async (formData) => {
    try {
      const response = await fetch('http://localhost:80/postMessage', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Assuming you want to return some data if the request is successful
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error in postMessage:', error);
      // You might want to throw the error again to let the caller handle it
      throw error;
    }
};

export const deleteComment = async (message_id) => {
  try{
    const response = await axios.delete(`http://localhost:80/deleteMessage/${message_id}`);
    return response.data;
  } catch (error) {
    console.error("Could not send login data in axios: ", error);
  }

}


export const deleteChannel = async (channel_id) => {
  try{
    const response = await axios.delete(`http://localhost:80/deleteChannel/${channel_id}`);
    return response.data;
  } catch (error) {
    console.error("Could not send login data in axios: ", error);
  }
}

export const deleteUser = async (username) => {
  try{
    const response = await axios.delete(`http://localhost:80/deleteUser/${username}`);
    return response.data;
  } catch (error) {
    console.error("Could not send login data in axios: ", error);
  }
} 

export const updateCountsOnBackend = async (message_id,like,dislike) => {
  try {
    // Send a PUT request to update the counts on the backend
    console.log("like: ",like," dislikes: ",dislike);
    const response = await axios.put(`http://localhost:80/updateCounts/${message_id}`, {
      likes: like,
      dislikes: dislike,
    });
    // Handle the response if needed
    console.log('Backend response:', response.data);
  } catch (error) {
    console.error('Error updating counts on the backend:', error);
  }
};


export const getUsers = async () => {
  try{
    const response = await axios.get(`http://localhost:80/getUsers`);
    return response.data;
  } catch (error) {
    console.error("Could not send login data in axios: ", error);
  }
}