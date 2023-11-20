import { Button } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

export default function Record() {
  const [blob, setBlob] = useState();
  const recorder = useAudioRecorder();

  const sendAudioData = async () => {
    try {
        const formData = new FormData();
        formData.append('audio', new Blob([blob], { type: 'audio/wav' }), 'recorded_audio.wav');

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
                onRecordingComplete={setBlob}
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
