import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom"
import {BottomNavigation, BottomNavigationAction, Box, Container} from '@mui/material';
import HearingIcon from '@mui/icons-material/Hearing';
import MicIcon from '@mui/icons-material/Mic';
import Shake from './pages/shake'
import Record from './pages/record'


import { useEffect, useState } from "react";

import './App.css';


function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    {
      path: "shake",
      icon: <HearingIcon />,
      label: "Hear Voice"
    },
    {
      path: "record",
      icon: <MicIcon />,
      label: "Collect Voice"
    },
    
  ]

  const [currentLocation, setCurrentLocation] = useState()

  useEffect(() => {
    if (location) {
      const currentTab = tabs.find(tab => {
        return location.pathname.includes(tab.path) && location.pathname != "";
      })
      if (currentTab) {
        setCurrentLocation(currentTab.path)
      }
    }
  }, [location])

  const handleChange = (event, newValue) => {
    navigate(newValue)
  }
  return (
    <Box>
      <Routes>
        <Route path = {""} index element={<Navigate to={'shake'} />} />
        <Route path = {"shake"} element={<Shake />} />
        <Route path = {"record"} element={<Record />} />
        
      </Routes>

      <BottomNavigation
      onChange={handleChange}
      value={currentLocation}
      showLabels
      style={{position: "fixed", bottom: 0, width: "100%", zIndex: 1000}}
      >
        {tabs.map(tab => {
          return (
            <BottomNavigationAction
              key={tab.path}
              value={tab.path}
              label={tab.label}
              icon={tab.icon}
            />
          )
        })}
      </BottomNavigation>
    </Box>
  );
}

export default App;
