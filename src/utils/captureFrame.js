// Grab the current video frame, downscale it for speed/cost, and return raw
// base64 JPEG (no data-URL prefix) ready for the Anthropic image content block.
export function captureFrame(video, quality = 0.7, maxWidth = 640) {
  if (!video || !video.videoWidth || !video.videoHeight) return null;

  const scale = Math.min(1, maxWidth / video.videoWidth);
  const width = Math.round(video.videoWidth * scale);
  const height = Math.round(video.videoHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, width, height);

  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const base64 = dataUrl.split(',')[1];
  return base64 || null;
}
