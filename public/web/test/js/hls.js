// Turn a video tag into a HSL Stream
// <script src="https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js"></script>
// const src = '/stream/output.m3u8';
function hslStream(src, id) {
  const video = document.getElementById(id);
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
    });
  }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
  }
}