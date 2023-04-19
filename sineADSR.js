const startButtonEl = document.getElementById('start-button');
const stopButtonEl = document.getElementById('stop-button');
const appStartEl = document.getElementById('app-button');
const pitchSliderEl = document.getElementById('pitch-slider');
const pitchDisplayEl = document.getElementById('pitch-display');


// Main function to wrap all AudioContext events & functions.
// Wrapped to prevent Chrome error of blocking auto-play.
function AudioContextFunc(){ 

    const audioCtx = new AudioContext({
        latencyHint: 'playback',
        // sampleRate: 44100
        sampleRate: 32000
    });
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(3500, audioCtx.currentTime);
    osc.start();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    const min = 0.000001; // gain reset value
    
    function ADSR(){
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
    };
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const startOsc = function () {
        // gainNode.gain.setValueAtTime(2, audioCtx.currentTime);
        ADSR();
        console.log('start osc exec');
    };
    
    const stopOsc = function () {
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        console.log('stop osc exec');
    };
    
    startButtonEl.addEventListener('click', startOsc); // set gainNode to 2
    stopButtonEl.addEventListener('click', stopOsc);   // set gainNode to 0

};


// Log pitch slider into text box
pitchDisplayEl.textContent = pitchSliderEl.value;

// Event to execute main AudioContext wrapped function.
appStartEl.addEventListener('click', AudioContextFunc);






