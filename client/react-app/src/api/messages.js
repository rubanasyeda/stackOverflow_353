

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
