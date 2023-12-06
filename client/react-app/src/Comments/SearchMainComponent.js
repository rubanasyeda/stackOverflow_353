import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Don't forget to import axios

import SearchComponent from './SearchComponent';

const SearchMainComponent = () => {
  const [searchResults, setSearchResults] = useState([]);

  // Use an empty dependency array if you don't need to run logic on mount
//   useEffect(() => {
//     // Optional: Run logic when searchResults changes
//     console.log('Search results changed:', searchResults);
//   }, [searchResults]);

  const handleSearch = async (searchType, searchQuery) => {
    try {
      let response;

      if (searchType === 'content') {
        response = await axios.get(`/search/content?query=${searchQuery}`);
      } else if (searchType === 'user') {
        response = await axios.get(`/search/user?query=${searchQuery}`);
      } else if (searchType === 'User with Most Posts') {
        response = await axios.get('/search/user/most-posts');
      } else if (searchType === 'User with Least Posts') {
        response = await axios.get('/search/user/least-posts');
      } else if (searchType === 'User with Highest Ranking') {
        response = await axios.get('/search/user/highest-ranking');
      } else if (searchType === 'User with Lowest Ranking') {
        response = await axios.get('/search/user/lowest-ranking');
      }

      // Assuming your backend returns the search results in the response data
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error performing search:', error);
      // Handle errors as needed
    }
  };

  return (
    <div>
      {/* Other content in your parent component */}
      <SearchComponent handleSearch={handleSearch} />
      {/* Display search results or other UI based on searchResults */}
      {searchResults.map((result) => (
        <div className='searchResult' key={result}></div>
      ))}
    </div>
  );
};

export default SearchMainComponent;
