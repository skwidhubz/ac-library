const audioCtx = new AudioContext();
const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
const data = buffer.getChannelData(0);

const attackTime = 0.1;
const decayTime = 0.3;
const sustainLevel = 0.5;
const sustainTime = 0.5;
const releaseTime = 0.1;

for (let i = 0; i < audioCtx.sampleRate; i++) {
  const t = i / audioCtx.sampleRate;
  const amplitude = Math.exp(-t / decayTime);
  if (t < attackTime) {
    data[i] = amplitude * t / attackTime;
  } else if (t < attackTime + decayTime) {
    data[i] = amplitude * (1 - (t - attackTime) / decayTime * (1 - sustainLevel));
  } else if (t < attackTime + decayTime + sustainTime) {
    data[i] = amplitude * sustainLevel;
  } else {
    data[i] = amplitude * sustainLevel * Math.exp(-(t - attackTime - decayTime - sustainTime) / releaseTime);
  }
}

const bufferSource = audioCtx.createBufferSource();
bufferSource.buffer = buffer;
bufferSource.connect(audioCtx.destination);
bufferSource.start();
bufferSource.stop(audioCtx.currentTime + 2);
