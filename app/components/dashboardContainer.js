// components/Dashboard.js

import React from "react";

const DashboardContainer = ({ title, count}) => {


  return (
    <>
    <div style={{
      textAlign: 'center',
      display: 'inline-block',
      margin: '20px',
      height:'200px',
      width: '300px', // Set the width of the container
      padding: '20px', // Set the padding inside the container
      borderRadius: '8px', // Add border-radius for rounded corners
      boxShadow: '2px 4px 8px 8px  rgba(0, 0, 0, 0.2)', // Add box shadow
      color:'#075985'
    }}>
      <h3 style={{ fontWeight:'bolder',textAlign:'center',color:'#075985',marginBottom:'30px',marginTop:'10px',fontSize:'27px'}}>{title}</h3>
      <p style={{textAlign:"center",fontSize:'30px'}}>{count}</p>

  </div>
    </>
  );
};

export default DashboardContainer;
