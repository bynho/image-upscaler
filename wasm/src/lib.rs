use wasm_bindgen::prelude::*;
use fast_image_resize as fr;
use image::{ImageBuffer, Rgba};
use std::num::NonZeroU32;

#[wasm_bindgen(start)]
pub fn init() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn upscale_image(data: Vec<u8>, width: u32, height: u32, scale_factor: u32) -> Vec<u8> {
    // Convert dimensions to non-zero u32
    let width_nz = NonZeroU32::new(width).expect("Width must be non-zero");
    let height_nz = NonZeroU32::new(height).expect("Height must be non-zero");
    let new_width_nz = NonZeroU32::new(width * scale_factor).expect("New width must be non-zero");
    let new_height_nz = NonZeroU32::new(height * scale_factor).expect("New height must be non-zero");

    // Create source image buffer
    let img = ImageBuffer::<Rgba<u8>, _>::from_raw(width, height, data)
        .expect("Failed to create image buffer");

    // Create source image
    let src_image = fr::Image::from_vec_u8(
        width_nz,
        height_nz,
        img.into_raw(),
        fr::PixelType::U8x4,
    ).expect("Failed to create source image");

    // Create destination image buffer
    let mut dst_image = fr::Image::new(
        new_width_nz,
        new_height_nz,
        fr::PixelType::U8x4,
    );

    // Create resizer with Lanczos algorithm
    let mut resizer = fr::Resizer::new(
        fr::ResizeAlg::Convolution(fr::FilterType::Lanczos3)
    );

    // Create views for resizing
    let src_view = src_image.view();
    let mut dst_view = dst_image.view_mut();
    
    // Perform resize operation
    resizer.resize(&src_view, &mut dst_view)
        .expect("Failed to resize image");

    // Return the raw bytes
    dst_image.into_vec()
}