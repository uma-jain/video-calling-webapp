import React,{useState,useEffect} from 'react'
import "./Homepage.css"
import {Link} from "react-router-dom"

import  {v4 as uuidv4}   from "uuid";

import im from "../../images/7248.png"


function Homepage(props) {
    useEffect(() => {
        localStorage.removeItem("username")
    }, [])
    const [meetId,setMeetId]=useState(null)
    const [error,setError]=useState({Linkmsg:"",isLinkError:false,isUserNameError:false,Usernamemsg:""})

    const joinMeeting=()=>{
        
       // alert(`username : ${localStorage.getItem("username")} meet id : ${meetId}`)
        if( localStorage.getItem("username")==null ||  localStorage.getItem("username")==undefined || localStorage.getItem("username")==" "){
            setError({Usernamemsg:"UserName Can't Be Empty",isUserNameError:true})
            setTimeout(function(){
              setError({Usernamemsg:"",isUserNameError:false})         
             }, 1000);
         }     
    
      else if(meetId==null || meetId==undefined || meetId==""){
          setError({Linkmsg:"Link Can't Be Empty",isLinkError:true})
          setTimeout(function(){
            setError({Linkmsg:"",isLinkError:false})         
           }, 1000);
       }
       
       else{
           //alert(meetId)
           //check if this room Exist
           //if exists
           //redirect to
           props.history.push(`/instantMeeting/${meetId}`)
          
       }       
    }
    const handleStartInstantMeeting=()=>{
        if( localStorage.getItem("username")==null ||  localStorage.getItem("username")==undefined || localStorage.getItem("username")==" "){
            setError({Usernamemsg:"UserName Can't Be Empty",isUserNameError:true})
            setTimeout(function(){
              setError({Usernamemsg:"",isUserNameError:false})         
             }, 1000);
         } else
        props.history.push(`/instantMeeting/${uuidv4()}`);
    }
    const handlePaste=(event)=>{
        
        event.preventDefault();
        const target = document.getElementById('roomId');
        console.log(target);
        target.addEventListener('paste', (event) => {
            let paste = (event.clipboardData || window.clipboardData).getData('text');
            console.log(paste);
            target.value=paste
            setMeetId(paste)
    });
}

    return (
        <div className="main-c">
            <div className="content">
                <h1>UNITE</h1>                                     
                          
                <div class="join-form">
                    <input type="string" 
                            placeholder="Enter UserName" 
                             onChange={(e)=>(localStorage.setItem("username",e.target.value) )}></input>
                  
                            <button class="btn" onClick={(e)=>{handleStartInstantMeeting()}}>Start An Instant Meeting</button>
                        {error.isUserNameError && <h5>{error.Usernamemsg}</h5>}
                        </div>

                    <div class="join-form">
                    <h4>Join A Meeting</h4>  
                             <input 
                            id="roomId"
                             placeholder="Enter Link" 
                             value={meetId} 
                             onChange={(e)=>{setMeetId(e.target.value)}}
                             onPaste={(e)=>{handlePaste(e)}}
                             ></input>
                            <button class="btn" onClick={(e)=>{joinMeeting(e)}}>Join</button>
                        {error.isLinkError && <h5>{error.Linkmsg}</h5>}
                        </div>
             </div>
                
        </div>
    )
}

export default Homepage
