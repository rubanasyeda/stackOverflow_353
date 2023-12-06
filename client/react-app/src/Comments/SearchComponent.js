import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./SearchComponent.css";

const SearchComponent = () => {
  const [searchType, setSearchType] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = async () => {
    try {
      await handleSearch(searchType, searchQuery);
      setSearchQuery('');
    } catch (error) {
        setSearchResults([]);
        console.log("Error in handleSearchClick", error);
    }
  };

  useEffect(() => {
    console.log('Search results changed:', searchResults);
  }, [searchResults]);

  const getLevel = (numPosts) => {
    if (numPosts < 10) {
      return "Beginner";
    } else if (numPosts < 50) {
      return "Intermediate";
    } else {
      return "Expert";
    }
  };

  const handleSearch = async (searchType, searchQuery) => {
    try {
      let response;

      if (searchType === 'content' && searchQuery !== "") {
        response = await axios.get(`http://localhost:80/search/content?query=${searchQuery}`);
      } else if (searchType === 'user' && searchQuery !== "") {
        response = await axios.get(`http://localhost:80/search/user?query=${searchQuery}`);
      } else if (searchType === 'mostPosts') {
        response = await axios.get('http://localhost:80/search/user/most-posts');
      } else if (searchType === 'leastPosts') {
        response = await axios.get('http://localhost:80/search/user/least-posts');
      } else if (searchType === 'highestRanking') {
        response = await axios.get('http://localhost:80/search/user/most-posts');
      } else if (searchType === 'lowestRanking') {
        response = await axios.get('http://localhost:80/search/user/least-posts');
      }
        console.log("Response data: ",response.data);
      setSearchResults(response.data);
    } catch (error) {
        setSearchResults([]);
        console.error('Error performing search:', error);
      // Handle errors as needed
        throw error;
    }
  };

  return (
    <div>
      <label>
        Search Type:
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="content">Content</option>
          <option value="user">User</option>
          <option value="mostPosts">User with Most Posts</option>
          <option value="leastPosts">User with Least Posts</option>
          <option value="highestRanking">User with Highest Ranking</option>
          <option value="lowestRanking">User with Lowest Ranking</option>
        </select>
      </label>
      <br />
      <label>
        Search Query:
        <input type="text" value={searchQuery} onChange={handleInputChange} />
      </label>
      <br />
      <button onClick={handleSearchClick}>Search</button>

      <div className='results'>
  {(searchType === "content" || searchType === "user") && searchResults.length > 0 ? (
    searchResults.map((result, index) => (
      <div className='searchResult' key={index}>
        <div className='resultBox'>
          <p>{result.user}</p>
          <p>Channel id: {result.channel_id}</p>
          <p>{result.content}</p>
        </div>
      </div>
    ))
  ) : searchResults.length > 0 ?(
    <div className='resultBox'>
      <h2></h2>
      <p>{`"Username: " ${searchResults[0].username}`}</p>
      <p>{`"Name: " ${searchResults[0].name}`}</p>
      <p>{`Ranking: ${getLevel(searchResults[0].num_posts)}`}</p>
    </div>
  ) : (
    <div></div>
  )}
</div>
    </div>
  );
};

export default SearchComponent;
