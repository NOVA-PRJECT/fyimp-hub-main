import React from 'react';
import "../styles/HomeView.css";

function HomeView (){
  
  
  return (
    <div className="home">
     <div className="quotediv">
       <p className="quotetext">Knowledge grows strongest when it is shared, structured, and preserved.</p>
     </div>
     <p class="texthamhome">
  Click <span class="ham">&#9776;</span> on the top left to select your department
    </p>
    <div className="statcard">
       <div className="perstat">
         <h2>180+</h2>
         <p>visitors</p>
       </div>
       <div className="perstat">
         <h2>1328+</h2>
         <p>downloads</p>
       </div>
        <div className="perstat">
         <h2>2785+</h2>
         <p>resources</p>
       </div>
    </div>
    </div>
    )
}

export default HomeView;