import {BrowserRouter,Route,Routes} from "react-router-dom"
import UserLogin from "./User/Login/Login";
import UserRegister from "./User/Register/Register";
import EventsView from "./Event/EventsView/EventsView";
function RoutingPage(){
    function EventsPrivateRoute({ children }){
        const token=localStorage.getItem("token");
        if(token){
            return children;
        }
        else{
            return <UserLogin/>
        }
    }
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/user/login" element={<UserLogin/>}/>
                <Route path="/user/register" element={<UserRegister/>}/>
                <Route path="/events/view" element={<EventsPrivateRoute> <EventsView/> </EventsPrivateRoute> }/>
                <Route path="*" element={<UserLogin/>}/>
            </Routes>
        </BrowserRouter>
        </>
    )
}


export default RoutingPage;