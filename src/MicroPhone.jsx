import React from 'react'
import {useState} from "react";
import mic2 from "./assets/microphone-icon-5042.png"
import mic3 from "./assets/ab.jpg"
function MicroPhone() {
    const [show,setShow]=useState(false);
    const Cancel=()=>{
      document.querySelector(".MicroPhone").textContent="";
    }
  return (
    <div className='MicroPhone'>
      <div className='Micro' onClick={()=>{setShow(true)}}><button>🎙️</button>
      </div>
    {show && (
        <div className='Enab'>
        <img src={mic2} alt="" width="100px"/>
        <div className='Wrong' onClick={()=>{Cancel()}}><img src={mic3} alt="Cancel" /></div>
        </div>
    )}
    </div>
  )
}
export default MicroPhone


