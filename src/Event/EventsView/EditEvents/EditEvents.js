import  Axios  from "axios";
import { useState } from "react";
import "./EditEvents.css";

function EditEvents(props){
    const [eventDetails,setEventDetails]=useState({
        title: props.details.title,
        description: props.details.description,
        date: props.details.date,
        day: props.details.day,
        time: props.details.time
    }) 
    const [created,setCreated]=useState(true);
    const [fillDetails,setFillDetails]=useState(true);
    const updateEventUrl=process.env.REACT_APP_DIARY_UPDATE_EVENT;
    const deleteEventUrl=process.env.REACT_APP_DIARY_DELETE_EVENT;
    const token=localStorage.getItem("token");
    const handleChange=({target:{name,value}})=>{
        setCreated(true);
        setFillDetails(true);
        setEventDetails(prevState=>({...prevState,[name]:value}))
    }
    const handleModal=(userId)=>{
        console.log(userId);
        var open=document.getElementById(userId);
        open.style.display="block";
    }
    const handleClose=(userId)=>{
        console.log("close",userId);
        var close=document.getElementById(userId);
        close.style.display="none";
    }
    const handleSubmit=(event)=>{
        event.preventDefault();
        console.log(eventDetails);
        if(eventDetails.title!=="" && eventDetails.description!=="" && eventDetails.time!==""){
            Axios.post(updateEventUrl,{
            eventDetails,
            _id:props.details._id
        },{
            headers:{
                "auth-token":token
            }
        }).then((response)=>{
            if(response.status===200){
                setCreated(false)
            }
        }).catch((err)=>{
            console.log(err);
        })
        }
        else
        {
            setFillDetails(false);
        }
    }
    const deleteEvent=()=>{
        Axios.delete(deleteEventUrl,{
            headers:{
                "auth-token":token
            },
            data:{_id: props.details._id}
        })
        .then((response)=>{
            console.log(response);
            if(response.status===200){
               handleClose(props.details._id);
               window.location.reload();
            }
        })
    }
    return(
        <>
            <div className="events-container" onClick={()=>handleModal(props.details._id)}>
                <h4 className="events-container-title">Title:</h4>
                <h4 className="events-container-title">{eventDetails.title}</h4>
                <h4 className="events-container-title">Time:</h4>
                <h4 className="events-container-title">{eventDetails.time}</h4>
            </div>
            <div className="events-container-modal" id={props.details._id}>
                <div className='add-event-modal-inner'>
                    <span className="close" onClick={()=>handleClose(props.details._id)}>&times;</span>
                    <h2 className='add-event-modal-label' >Event</h2>
                    <div className='add-event-modal-content1'>
                        <h4 className='add-event-label'>Event Title</h4>
                        <input type="text" name="title"  onChange={handleChange} className='add-event-modal-text-editor' value={eventDetails.title}   />
                    </div>
                    <div className='add-event-modal-content1'>
                        <div className="add-event-modal-innercontent2">
                            <div className="add-event-modal-innercontent1">
                                <h4 className='add-event-label'>Event Date</h4>
                                <input type="text" name="date"  className='add-event-modal-date' value={eventDetails.date} readOnly/>
                            </div>
                            <div className="add-event-modal-innercontent1">
                                <h4 className='add-event-label'>Event Day</h4>
                                <input type="text" name="day"  className='add-event-modal-day' value={eventDetails.day} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className='add-event-modal-content1'>
                        <h4 className='add-event-label'>Event Time</h4>
                        <input type="time" name="time" onChange={handleChange} className='add-event-modal-time' value={eventDetails.time} />
                    </div>
                    <div className='add-event-modal-content2'>
                        <h4 className='add-event-label'>Event Description</h4>
                        <textarea rows="5" cols="90" name="description" onChange={handleChange} className='add-event-modal-desc' value={eventDetails.description}  />
                    </div>
                    <div className='add-event-modal-content3'>
                        <h4 className="update-details" disabled={fillDetails}>Please Fill Details</h4>
                        <button className="update-button" onClick={handleSubmit}>Update</button>
                        <button className="update-button" onClick={deleteEvent}>Delete</button>
                        <h4 className="succ-details" disabled={created}>Updated</h4>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditEvents;