# Image Upscaler

A local-first image upscaling service that uses WebAssembly for optimal performance. This application allows you to upscale images directly in your browser without sending data to external servers.

## Features
- Local-first image processing
- WebAssembly-powered upscaling
- Modern web interface
- Support for common image formats
- Real-time preview

## Tech Stack
- Rust (for WASM module)
- JavaScript/TypeScript
- Vite (for development and building)
- wasm-pack
- TailwindCSS

## Development Setup
1. Install Rust and wasm-pack
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

2. Install Node.js dependencies
```bash
npm install
```

3. Build WASM module
```bash
cd wasm
wasm-pack build
```

4. Start development server
```bash
npm run dev
```
