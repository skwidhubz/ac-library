const startButtonEl = document.getElementById('start-button');
const stopButtonEl = document.getElementById('stop-button');
const appStartEl = document.getElementById('app-button');

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
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const startOsc = function () {
        gainNode.gain.setValueAtTime(2, audioCtx.currentTime);
        console.log('start osc exec');
    };
    
    const stopOsc = function () {
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        console.log('stop osc exec');
    };
    
    startButtonEl.addEventListener('click', startOsc); // set gainNode to 2
    stopButtonEl.addEventListener('click', stopOsc);   // set gainNode to 0

    // Envelope function. Attack/Decay/Sustain.
    function ADS(node, max, a, d, s, start, duration, cutoff_time) {
        // console.log("attack at",start);
        if (cutoff_time) {
            // console.log('is cutoff from',duration);
            // console.log('start',start);
            // console.log('cutoff',cutoff_time);
            duration = Math.max(0,Math.min(duration, cutoff_time - start));
            // console.log('to duration',duration);
        }
        if (duration === 0) {
            node.gain.setValueAtTime(
                s,
                start
            );
            return;
        }

        if (a === 0) {
            if (d === 0) {
                node.gain.setValueAtTime(
                    s,
                    start
                );
            } else {
                node.gain.setValueAtTime(
                    max,
                    start
                );
            }

        } else {
            node.gain.setValueAtTime(
                min,
                start
            );
        }

        if (duration <= a) {
            // console.log("lt a",duration,a);
            // console.log(max,duration,a,start);
            node.gain.exponentialRampToValueAtTime(
                max * duration / a,
                // max,
                start + duration
            );
        } else if (duration <= a + d) {
            // console.log("lt a + d",duration,a,d);
            if (a > 0) {
                node.gain.exponentialRampToValueAtTime(
                    max,
                    start + a
                );
            }
            node.gain.exponentialRampToValueAtTime(
                s,
                start + duration
            );
        } else {
            // console.log("normal ADS",duration,a,d);
            if (a > 0) {
                node.gain.exponentialRampToValueAtTime(
                    max,
                    start + a
                );
            }
            if (d > 0) {
                node.gain.exponentialRampToValueAtTime(
                    s,
                    start + a + d
                );
            }
            node.gain.setValueAtTime(s,
                start + duration
            )
        }
    }

    // Release function
    function R(node, s, r, end, cutoff_time) {
        if (cutoff_time < end) {
            r = 0;
        }
        if (r === 0) {
            // console.log('no r');
            node.gain.setValueAtTime(
                min,
                end
            );
        } else {
            // console.log('normal r')
            if (cutoff_time && (cutoff_time - end) < r) {
                node.gain.exponentialRampToValueAtTime(
                    s + (min - s) * (cutoff_time - end) / r,
                    cutoff_time
                );
            } else {
                node.gain.exponentialRampToValueAtTime(
                    min,
                    end + r
                );
            }

        }
    }

    // ADSR function combining ADS & R funcs.
    function ADSR(node, max, a, d, s, r, start, duration, cutoff_time) {
        // console.log("== ADSR");
        // console.log(max, a, d, s, r, start, duration, cutoff_time);
        if (duration === 0 && r === 0) return;
        ADS(node, max, a, d, s, start, duration, cutoff_time);
        R(node, s, r, start + duration, cutoff_time);
    }



};




// Event to execute main AudioContext wrapped function.
appStartEl.addEventListener('click', AudioContextFunc);






