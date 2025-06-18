import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import WavyShader from './components/AltWaveShader';

import './App.css';


const emotionPresets = {
  Joy: { colorA: '#FFFF00', colorB: '#FF69B4', prompt: 'Joy: Show me the happiest Ive felt' },
  Sadness: { colorA: '#808080', colorB: '#4B0082', prompt: 'Sadness: What memory feels heavy, even now?'  },
  Anger: { colorA: '#FF0000', colorB: '#000000', prompt: 'Anger: What will I do differently next time Im disrespected?'  },
};

function App() {

  const materialRef = useRef();

  // State for intensity and color
  const [selectedEmotion, setSelectedEmotion] = useState('Joy');
  const { colorA, colorB } = emotionPresets[selectedEmotion];

  return (
    <div className="App">
      <h1>“Time is out of order"</h1>
      <p>Create an new gen personal diary concept where users can store and navigate personal moments in emotional time rather than chronological order. </p>
      <div className="emotions_section_controller">
        <p className="small_text">Input - For this prototype, emotion is selected, but GenAI can decipher speech and emotional tone.</p>
        <div className="controller_container">
          {Object.entries(emotionPresets).map(([emotion, data]) => (
            <button
              key={emotion}
              onClick={() => setSelectedEmotion(emotion)}
              className='card_emotion'
              style={{
                background: `linear-gradient(45deg, ${data.colorA}, ${data.colorB})`,
                border: selectedEmotion === emotion ? '3px solid white' : '1px solid gray',
              }}
            >
              {data.prompt}
            </button>
          ))}
        </div>
      </div>


 

       {/* R3F Canvas */}
      <Canvas camera={{ position: [0, 0, 1] }}>
        <WavyShader ref={materialRef} color={colorA}         colorA={colorA}
          colorB={colorB} />
      </Canvas>


    </div>
  );
}

export default App;
