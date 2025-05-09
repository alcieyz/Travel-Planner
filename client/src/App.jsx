import { Fragment, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import MySchedule from "./pages/MySchedule";
import MyMap from "./pages/MyMap";
import MyBudget from "./pages/MyBudget";
import MyNotes from './pages/MyNotes';
import MySuggestions from './pages/MySuggestions';
import LogIn from "./pages/LogIn";
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import NoPage from "./pages/NoPage";

function App() {

  //localStorage.clear();

  const location = useLocation();

  useEffect(() => {
    const pageTitles = {
      "/": "Home - Travel Planner",
      "/MySchedule": "My Schedule - Travel Planner",
      "/MyMap": "My Map - Travel Planner",
      "/MyBudget": "My Budget - Travel Planner",
      "/MyNotes": "My Notes - Travel Planner",
      "/MySuggestions": "My Suggestions - Travel Planner",
      "/LogIn": "Log In - Travel Planner",
      "/SignUp": "Sign Up - Travel Planner",
      "/Dashboard": "Dashboard - Travel Planner",
      "/MyTrips": "My Trips - Travel Planner",
      "/Profile": "Profile - Travel Planner",
      "/Settings": "Settings - Travel Planner",
    };

    document.title = pageTitles[location.pathname] || "Travel Planner";
  }, [location]);
  
return (
    <Fragment>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="MySchedule" element ={<ProtectedRoute><MySchedule/></ProtectedRoute>} />
            <Route path="MyMap" element ={<ProtectedRoute><MyMap/></ProtectedRoute>} />
            <Route path="MyBudget" element ={<ProtectedRoute><MyBudget/></ProtectedRoute>} />
            <Route path="MyNotes" element ={<ProtectedRoute><MyNotes/></ProtectedRoute>} />
            <Route path="MySuggestions" element ={<ProtectedRoute><MySuggestions/></ProtectedRoute>} />
            <Route path="LogIn" element ={<LogIn/>} />
            <Route path="SignUp" element ={<SignUp/>} />

            <Route path="Dashboard" element ={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
            <Route path="MyTrips" element ={<ProtectedRoute><MyTrips/></ProtectedRoute>}/>
            <Route path="Profile" element ={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route path="Settings" element ={<ProtectedRoute><Settings/></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
    </Fragment>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </AuthProvider>  
  );
}

//testing git change
//testing more git changes

/* Things to add:
- password encryption
- change username/password
- use user id instead of username for authentication
- sign on session
- about page
- when note content has a super long word, it extends off the note
- improve icons
- forgot password
- tier list??
- ai travel itinerary
- my map cancel button after marker preview
- my map preview marker different color markers
- include budget in suggestions
- home hero background fit to smaller screens
- highlight all trip days in calendar
- optimize calendar color/qol including show daytime times by default, show event details, etc.
- add img to trip card
- trip card days until
- name error

- dashboard trips: 
  context menu (right click functionality)
*/

