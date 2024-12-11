use wasm_bindgen::prelude::*;
use image::{ImageBuffer, Rgba};

#[wasm_bindgen(start)]
pub fn init() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn upscale_image(data: Vec<u8>, width: u32, height: u32, scale_factor: u32) -> Vec<u8> {
    let img = ImageBuffer::<Rgba<u8>, _>::from_raw(width, height, data)
        .expect("Failed to create image buffer");

    let new_width = width * scale_factor;
    let new_height = height * scale_factor;
    
    let mut output = ImageBuffer::new(new_width, new_height);

    for (x, y, pixel) in output.enumerate_pixels_mut() {
        let source_x = x / scale_factor;
        let source_y = y / scale_factor;
        *pixel = *img.get_pixel(source_x, source_y);
    }

    output.into_raw()
}
