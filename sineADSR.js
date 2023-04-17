const audioCtx = new AudioContext();
const osc = audioCtx.createOscillator();
const gainNode = audioCtx.createGain();
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

// TODO: fix console error preventing osc from playing. 


function mainOsc(){
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
};



const startOsc = () => {
    osc.start();
    console.log('start osc exec');
};
const stopOsc = () => {
    osc.stop(audioCtx.currentTime + 1);
    console.log('stop osc exec');
};

startButton.addEventListener('click', startOsc());
stopButton.addEventListener('click', stopOsc());


