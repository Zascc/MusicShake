import { ReactP5Wrapper } from "@p5-wrapper/react";
import React, { useEffect, useState } from "react";

import "./index.css"
import AudioPlayer from "../../components/audioPlayer";
import { Button } from "@mui/material";

function sketch(p5) {
  
    p5.setup = () => {
      p5.createCanvas(window.innerWidth * 0.8, window.innerHeight/2);
      p5.background(51, 0.4);
    }
  
    
    p5.draw = () => {
      p5.background(100);

      p5.noStroke();
      p5.push();

 
      p5.pop();
    };
  }


export default function Shake (){
    const [audioSrc, setAudioSrc] = useState("http://42.194.224.20:8001/output.wav")
    const [visibilityBool, setVisibilityBool] = useState(false)

    const generateAudio = async () => {
      const response = await fetch('http://42.194.224.20:8000/voiceStorage/generateAudio')
      if (response.ok){
        const data = await response.json();
        if (data.filename) {
          setAudioSrc(`http://42.194.224.20:8001/${data.filename}`);
          setVisibilityBool(true)
        }
        
      }
    }


    function handleDeviceMotion (event) {
        const x = event.accelerationIncludingGravity.x;
        const y = event.accelerationIncludingGravity.y;
        const z = event.accelerationIncludingGravity.z;
        console.log(x)
        if (x > 30){
            console.log("ded")
        }
    }

  useEffect(() => {
    window.addEventListener("devicemotion", handleDeviceMotion)
  }, []);
  // return (<div>Shake</div>)
  return (
  <div>
    <ReactP5Wrapper sketch={sketch}/>
    <Button onClick={generateAudio}>SHAKE</Button>
    <AudioPlayer id={"audio-player"} audioSrc={audioSrc} visibility={visibilityBool}/>
  </div>
  );
}