import { Button } from '@mui/material';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from "@ffmpeg/util";


export default function Record() {
  const [blob, setBlob] = useState();
  
  const recorder = useAudioRecorder();


  const ffmpegRef = useRef(new FFmpeg());

  const load = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
      const ffmpeg = ffmpegRef.current;

      // toBlobURL is used to bypass CORS issue, urls with the same
      // domain can be used directly.
      await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
  }

  useEffect(() => {
    load();
  }, []);


  const transcode = async (blobData) => {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.webm', new Uint8Array(await blobData.arrayBuffer()));
      await ffmpeg.exec(['-i', 'input.webm', 'output.wav']);
      const data = await ffmpeg.readFile('output.wav');
      setBlob(new Blob([data.buffer], {type: 'audio/wav'}));
  }


//   const handleRecordComplete = async (blobData) => {
    
// };
  
  const sendAudioData = async () => {
    try {
        const formData = new FormData();
        formData.append('audio', blob, 'recorded_audio.wav');

        const response = await fetch('http://42.194.224.20:8000/voiceStorage/saveAudio', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Audio uploaded successfully!');
        } else {
            console.error('Error uploading audio:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
  }
  return (
    <div>
        <div>
            <AudioRecorder
                onRecordingComplete={transcode}
                recorderControls={recorder}
                classes={"recorder-container"}
            />
            
            {recorder.mediaRecorder && (
                <LiveAudioVisualizer
                mediaRecorder={recorder.mediaRecorder}
                width={200}
                height={75}
                />
            )}
        </div>


        <div className='visualizer-container'>
        {blob && (
            <AudioVisualizer
            blob={blob}
            width={window.innerWidth}
            height={75}
            barWidth={3}
            gap={2}
            barColor={'lightblue'}
            />
        )}
        </div>
        <div className='button-container'>
            <Button variant='contained' onClick={sendAudioData}>Submit</Button>
        </div>
    </div>
  );
}
