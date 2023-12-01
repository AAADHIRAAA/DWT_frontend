
import React from "react";

const UserDashboardContainer = ({ title, count}) => {

  return (
    <>
    <div style={{
      textAlign: 'center',
      display: 'inline-block',
      margin: '10px',
      height:'120px',
      width: '250px', // Set the width of the container
      borderRadius: '8px', // Add border-radius for rounded corners
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)', // Add box shadow
      color:'#075985'
    }}>
      <h3 style={{ fontWeight:'bold',textAlign:'center',color:'#075985',marginBottom:'18px',marginTop:'28px',fontSize:'20px'}}>{title}</h3>
      <p style={{textAlign:"center",fontSize:'23px'}}>{count}</p>

  </div>
    </>
  );
};

export default UserDashboardContainer;
