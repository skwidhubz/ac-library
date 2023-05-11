const oscillatorEvent = () => {
    
    // instance of A.C (vanilla)
    const audioContext = new AudioContext();
  
    const oscType = ["sine", "sawtooth", "square", "triangle"];
  
    // create gain node with ADSR envelope
    const gainNode = audioContext.createGain();
    const attackTime = 0.1; // in seconds
    const decayTime = 0.2; // in seconds
    const sustainLevel = 0.01; // between 0 and 1
    const releaseTime = 0.1; // in seconds
  
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + attackTime); // attack
    gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime); // decay
    gainNode.gain.setValueAtTime(sustainLevel, now + attackTime + decayTime + releaseTime); // sustain
    gainNode.gain.linearRampToValueAtTime(0, now + attackTime + decayTime + releaseTime + 0.1); // release
  
    // oscillator node
    const oscillator = audioContext.createOscillator();
    oscillator.type = oscType[0]; // wavetype: set to SINE (access via oscType array)
    oscillator.frequency.value = 200; // pitch value (hertz)
  
    // connect the oscillator to the gain node with the ADSR envelope
    oscillator.connect(gainNode);
  
    // connect the gain node to the audio context destination
    gainNode.connect(audioContext.destination);
  
    // start osc
    oscillator.start();
  
    // stop osc after ADSR envelope duration
    setTimeout(() => {
      oscillator.stop();
      setIsPlaying(false);
    }, (attackTime + decayTime + releaseTime + 0.1) * 1000);
  
    setIsPlaying(true);
    }; // end of AC func
  

