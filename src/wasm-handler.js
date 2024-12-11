import init, { upscale_image } from '../wasm/pkg/image_upscaler_wasm.js';

export async function initWasm() {
  try {
    await init();
    return true;
  } catch (error) {
    console.error('Failed to initialize WASM module:', error);
    return false;
  }
}

export async function upscaleImage(imageDataUrl, scaleFactor) {
  // Create an Image object to load the data URL
  const img = new Image();
  img.src = imageDataUrl;
  
  // Wait for the image to load
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  // Create a canvas to get the image data
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  // Get the image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = new Uint8Array(imageData.data);

  try {
    // Call the WASM function to upscale the image
    const upscaledPixels = upscale_image(pixels, canvas.width, canvas.height, scaleFactor);
    
    // Create a new canvas for the upscaled image
    const resultCanvas = document.createElement('canvas');
    resultCanvas.width = canvas.width * scaleFactor;
    resultCanvas.height = canvas.height * scaleFactor;
    const resultCtx = resultCanvas.getContext('2d');
    
    // Put the upscaled pixels into the canvas
    const resultImageData = new ImageData(
      new Uint8ClampedArray(upscaledPixels),
      resultCanvas.width,
      resultCanvas.height
    );
    resultCtx.putImageData(resultImageData, 0, 0);
    
    // Return as data URL
    return resultCanvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to upscale image:', error);
    throw error;
  }
}
