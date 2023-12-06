import React from "react";
import "./Landing.css";

export const Landing = () => {
  return (
    <>
      <div className="landing-container">
        Welcome to the Channel-Based Tool for Programming Issues
      </div>
      <div className="desc">
        <div className="main-desc">
          <p >This tool allows you to post programming questions so you can get help from other programmers and also answer other's questions</p>
          </div>
        <p>Once you are logged in, you can easily navigate the tool using the navbar at the top</p>
        <p>1. You can create channels or view all the channels available</p>
        <p>2. When viewing channels, click the channel to view all messages</p>
        <p>3. You can post nested replies and screenshot to help you find answers</p>
        <p>4. You can show approval or disapproval of a post using thumbs up/down</p>
      </div>
    </>
  );
};
