import Calendar from 'react-calendar';
import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Header from "../Header/Header";
import "./EventsView.css";
import Axios from 'axios';
import EditEvents from './EditEvents/EditEvents';
function EventsView(){
    const [eventDetails,setEventDetails]= useState({
        title:"",
        description:"",
        time:"",
        date:"",
        day:"",
    })
    const getEventsUrl=process.env.REACT_APP_DIARY_GET_EVENTS;
    const insertEventUrl=process.env.REACT_APP_DIARY_INSERT_EVENT;
    const [created,setCreated]=useState(true);
    const [fillDetails,setFillDetails]=useState(true);
    const token=localStorage.getItem("token");
    const [eventsArr,setEventsArr]=useState([]);
    const userId=localStorage.getItem("userId")

    const [value, onChange] = useState(new Date());
    // console.log(value);
    var dd = String(value.getDate()).padStart(2, '0');
    var mm = String(value.getMonth() + 1).padStart(2, '0'); //January is 0!
    switch(value.getDay()){
        case 0:{
            eventDetails.day="Sun";
            break;
        }
        case 1:{
            eventDetails.day="Mon";
            break;
        }
        case 2:{
            eventDetails.day="Tue";
            break;
        }
        case 3:{
            eventDetails.day="Wed";
            break;
        }
        case 4:{
            eventDetails.day="Thu";
            break;
        }
        case 5:{
            eventDetails.day="Fri";
            break;
        }
        case 6:{
            eventDetails.day="Sat";
            break;
        }
        default:{
            eventDetails.day="Err";
        }
    }
    var yyyy = value.getFullYear();
    eventDetails.date = yyyy + '-' + mm + '-' + dd;

    useEffect(()=>{
        Axios.post(getEventsUrl,{
            userId:userId,
            date: eventDetails.date
        },{
            headers:{
                "auth-token":token
            }
        }).then((response)=>{
            console.log(response.data);
            setEventsArr(response.data);
        }).catch((err)=>{
            console.log(err);
        })
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', function(event) {
        window.history.pushState(null, document.title, window.location.href);});
    },[eventDetails.date]);
    console.log(eventsArr);
    const handleChange=({target:{name,value}})=>{
        setCreated(true);
        setFillDetails(true);
        setEventDetails(prevState=>({...prevState,[name]:value}))
    }
    const handleEventsAddModal=()=>{
        var open=document.getElementsByClassName("add-event-modal-outer")[0];
        open.style.display="block";
    }
    
    const handleEventsAddClose=()=>{
        setCreated(true);
        setFillDetails(true);
        window.location.reload();
        var close=document.getElementsByClassName("add-event-modal-outer")[0];
        close.style.display="none";
        setEventDetails({title:"",description:"",time:""});
    }
    const insertEvent=(event)=>{
        event.preventDefault();
        if(eventDetails.title!=="" && eventDetails.description!=="" && eventDetails.time!==""){
            Axios.post(insertEventUrl,{
                title: eventDetails.title,
                date: eventDetails.date,
                day: eventDetails.day,
                time: eventDetails.time,
                description: eventDetails.description,
                userId:userId
            },{
                headers:{
                    "auth-token":token
                }
            }).then((response)=>{
                if(response.status===200){
                    setCreated(false);
                }
            }).catch((err)=>{
                console.log(err);
            })
        }
        else{
            setFillDetails(false);
        }
    }
    const userName=localStorage.getItem("name");
    return( 
        <>
        <Header/>
        <div className='events-view-outer-container'>
            <h1 className='welcome-label'>Welcome {userName}</h1>
            <div className='events-view-inner-container'>
            <div className='events-view-inner-container2'>
                <div className='events-view-inner-container2-header'>
                    <h2 className='daily-events-label'>Daily Events</h2>
                </div>
                <div className='events-view-inner-container2-events'>
                    {eventsArr.map((details)=>(<EditEvents details={details}/>))}
                </div>
            </div>
            <div className='events-view-inner-container1'>
                <Calendar onChange={onChange} value={value} minDate={new Date()} className="events-calendar" />
                <button className='add-event-btn' onClick={handleEventsAddModal}>Create Event</button>
                <div className='add-event-modal-outer'>
                    <div className='add-event-modal-inner'>
                        <span className="close" onClick={handleEventsAddClose}>&times;</span>
                        <h2 className='add-event-modal-label' >Add Event</h2>
                        <div className='add-event-modal-content1'>
                            <h4 className='add-event-label'>Event Title</h4>
                            <input  name="title" value={eventDetails.title} type="text" className='add-event-modal-text-editor' onChange={handleChange}/>
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
                            <input type="time" className='add-event-modal-time' value={eventDetails.time} name="time" onChange={handleChange}/>
                        </div>
                        <div className='add-event-modal-content2'>
                            <h4 className='add-event-label'>Event Description</h4>
                            <textarea name="description" value={eventDetails.description} rows="5" cols="90" className='add-event-modal-desc' onChange={handleChange}/>
                        </div>
                        <div className='add-event-modal-content3'>
                            <h4 className='update-details'disabled={fillDetails}>Please Fill Details</h4>
                            <button className='add-event-modal-button' onClick={insertEvent}>Add Event</button>
                            <h4 className='succ-details'disabled={created}>Created</h4>
                        </div>
                    </div>
                </div>
            </div>
            </div>

        </div>

        </>
    )
}


export default EventsView;