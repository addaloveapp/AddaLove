const playSound = (soundSrc) => {
  if (!soundSrc || typeof Audio === 'undefined') return;

  const audio = new Audio(soundSrc);
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

export default playSound;
