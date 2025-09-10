
import React, { useState, useRef } from 'react';
import Button from './Button';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        onRecordingComplete(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      // You might want to show a toast message here
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setAudioURL(null); // Clear previous recording if any
      startRecording();
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-lg">
      <Button
        type="button"
        variant={isRecording ? 'secondary' : 'primary'}
        onClick={handleToggleRecording}
      >
        {isRecording ? 'Stop Recording' : 'Record Audio Note'}
      </Button>
      {audioURL && (
        <audio src={audioURL} controls className="w-full" />
      )}
    </div>
  );
};

export default AudioRecorder;
