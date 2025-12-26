import { NotebookText } from 'lucide-react';
import React,{useState} from 'react';
import { FileQuestionMark } from 'lucide-react';
import { ListCheck } from 'lucide-react';
import { BookOpenText } from 'lucide-react';
import '../styles/BottomResourceNav.css'
import {BOTTOM_TABS} from '../constants.js'


function BottomResourceNav ({activeTab, setactiveTab}){
  
  
  return(
    <>
 <div className="resourcebottom">
      {BOTTOM_TABS.map((tab) => {
        const IconComponent = tab.icon;
        // Check if this specific tab is the active one
        

        return (
          <div 
            key={tab.id} 
            className={`part ${activeTab === tab.id ? 'active' : ''}`} 
            onClick={() => setactiveTab(tab.id)}>
            <IconComponent className="svg" />
            <p>{tab.label.toLowerCase()}</p>
          </div>
        );
      })}
    </div>
    </>
    )
}


export default BottomResourceNav;