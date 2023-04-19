const startButtonEl = document.getElementById('start-button');
const stopButtonEl = document.getElementById('stop-button');
const appStartEl = document.getElementById('app-button');
const pitchSliderEl = document.getElementById('pitch-slider');
const pitchDisplayEl = document.getElementById('pitch-display');
const attackSliderEl = document.getElementById('attack-slider');
const decaySliderEl = document.getElementById('decay-slider');
const sustainSliderEl = document.getElementById('sustain-slider');
const releaseSliderEl = document.getElementById('release-slider');
const attackValue = document.getElementById('attack-display');
const decayValue = document.getElementById('decay-display');
const sustainValue = document.getElementById('sustain-display');
const releaseValue = document.getElementById('release-display');
const waveFormSelector = document.getElementById('waveform-dropdown');


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

    // change the waveform depending on dropdown box selection
    waveFormSelector.addEventListener('change', (e) => {
        osc.type = e.target.value;
    })
    

    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.start();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    const min = 0.000001; // gain reset value
    
    function ADSR(){
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.9, audioCtx.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
    };
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const startOsc = function (e) {
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

    
    // Log pitch slider into text box
    function handlePitchChange(e) {
        console.log(e.target.value);
        var pitchChange = e.target.value
        // Perform any other actions based on the new value of the slider
        osc.frequency.setValueAtTime(e.target.value, 1);
        // Log pitch slider into text box
        pitchDisplayEl.textContent = e.target.value;
    };

    // Attack slider 
    attackSliderEl.addEventListener('change', (e) => {
        gainNode.gain.linearRampToValueAtTime(e.target.value / 100, audioCtx.currentTime + 0.1);
        attackValue.textContent = e.target.value;
    })
    // Decay slider
    decaySliderEl.addEventListener('change', (e) => {
        gainNode.gain.exponentialRampToValueAtTime(e.target.value / 100, audioCtx.currentTime + 0.2);
        decayValue.textContent = e.target.value;
    })
    // Sustain slider
    sustainSliderEl.addEventListener('change', (e) => {
        gainNode.gain.exponentialRampToValueAtTime(e.target.value / 100, audioCtx.currentTime + 0.4);
        sustainValue.textContent = e.target.value;
    })
    // Release slider
    releaseSliderEl.addEventListener('change', (e) => {
        gainNode.gain.exponentialRampToValueAtTime(e.target.value / 100, audioCtx.currentTime + 1);
        releaseValue.textContent = e.target.value;
    })

    pitchSliderEl.addEventListener('change', handlePitchChange);
    

    // EFFECT PROCESSING SECTION:


    // Delay Effect
    const delayNode = new DelayNode(audioCtx, {
        delayTime: 0.5,
        maxDelayTime: 2,
      });

};



// Event to execute main AudioContext wrapped function.
appStartEl.addEventListener('click', AudioContextFunc);






