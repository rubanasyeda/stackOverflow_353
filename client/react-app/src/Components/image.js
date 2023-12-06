import React, { useState } from 'react';

const MyForm = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:80/postMessage', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Message posted successfully');
      } else {
        console.error('Failed to post message');
      }
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Content:
        <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <label>
        Image:
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
