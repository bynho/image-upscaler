import init, { upscale_image } from '../wasm/pkg/image_upscaler_wasm.js';

let wasmModule;

async function initWasm() {
    try {
        await init();
    } catch (error) {
        console.error('Failed to initialize WASM module:', error);
    }
}

function setupUI() {
    console.log('UI setup complete');
    debugger;
    const imageInput = document.getElementById('image-input');
    const upscaleButton = document.getElementById('upscale-button');
    const originalCanvas = document.getElementById('original-canvas');
    const resultCanvas = document.getElementById('result-canvas');
    const originalContainer = document.getElementById('original-container');
    const resultContainer = document.getElementById('result-container');
    const downloadLink = document.getElementById('download-link');
    
    let originalImage = null;

    imageInput.addEventListener('change', async (e) => {
        console.warn('File selected:', e.target.files[0]);

        const file = e.target.files[0];
        if (file) {
            originalImage = await createImageBitmap(file);
            displayOriginalImage(originalImage);
            upscaleButton.disabled = false;
            resultContainer.classList.add('hidden');
        }
    });

    upscaleButton.addEventListener('click', () => {
        if (originalImage) {
            const scaleFactor = parseInt(document.getElementById('scale-factor').value);
            upscaleImage(originalImage, scaleFactor);
        }
    });

    function displayOriginalImage(image) {
        originalContainer.classList.remove('hidden');
        originalCanvas.width = image.width;
        originalCanvas.height = image.height;
        const ctx = originalCanvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
    }

    async function upscaleImage(image, scaleFactor) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = new Uint8Array(imageData.data);

        try {
            const upscaledPixels = upscale_image(pixels, canvas.width, canvas.height, scaleFactor);
            displayUpscaledImage(upscaledPixels, canvas.width * scaleFactor, canvas.height * scaleFactor);
        } catch (error) {
            console.error('Failed to upscale image:', error);
        }
    }

    function displayUpscaledImage(pixels, width, height) {
        resultContainer.classList.remove('hidden');
        resultCanvas.width = width;
        resultCanvas.height = height;
        
        const ctx = resultCanvas.getContext('2d');
        const imageData = new ImageData(
            new Uint8ClampedArray(pixels),
            width,
            height
        );
        ctx.putImageData(imageData, 0, 0);

        // Update download link
        downloadLink.href = resultCanvas.toDataURL('image/png');
    }
}



console.warn('test');

initWasm().then(() => {
    setupUI();
});