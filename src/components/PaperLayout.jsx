import React from 'react'
import BottomResourceNav from './BottomResourceNav'
import { Outlet } from "react-router-dom";

function PaperLayout(){
  
  
  return(
    <>
      <BottomResourceNav/>
      <Outlet/>
    </>
    
    )
}