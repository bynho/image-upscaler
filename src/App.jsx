import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Select,
  Button,
  Group,
  Text,
  Image,
  Stack,
  LoadingOverlay,
  rem,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { initWasm, upscaleImage } from './wasm-handler';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [scaleFactor, setScaleFactor] = useState('2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWasmReady, setIsWasmReady] = useState(false);

  useEffect(() => {
    initWasm().then(() => setIsWasmReady(true));
  }, []);

  const handleDrop = async (files) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setOriginalImage(e.target.result);
        setUpscaledImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpscale = async () => {
    if (!originalImage || !isWasmReady) return;

    setIsProcessing(true);
    try {
      const result = await upscaleImage(originalImage, parseInt(scaleFactor));
      setUpscaledImage(result);
    } catch (error) {
      console.error('Failed to upscale image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack spacing="xl">
        <Title order={1} align="center" mb="xl">
          Image Upscaler
        </Title>

        <Paper radius="md" p="xl" withBorder>
          <Dropzone
            onDrop={handleDrop}
            accept={IMAGE_MIME_TYPE}
            maxSize={30 * 1024 ** 2}
          >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag an image here or click to select
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  File should not exceed 30MB
                </Text>
              </div>
            </Group>
          </Dropzone>

          <Group justify="center" mt="xl">
            <Select
              label="Scale Factor"
              value={scaleFactor}
              onChange={setScaleFactor}
              data={[
                { value: '2', label: '2x' },
                { value: '3', label: '3x' },
                { value: '4', label: '4x' },
              ]}
              style={{ width: '100px' }}
            />
            <Button
              onClick={handleUpscale}
              disabled={!originalImage || !isWasmReady || isProcessing}
              loading={isProcessing}
            >
              Upscale Image
            </Button>
          </Group>
        </Paper>

        {originalImage && (
          <Paper radius="md" p="xl" withBorder>
            <Title order={3} mb="md">Original Image</Title>
            <Image src={originalImage} fit="contain" />
          </Paper>
        )}

        {upscaledImage && (
          <Paper radius="md" p="xl" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Upscaled Image ({scaleFactor}x)</Title>
              <Button
                component="a"
                href={upscaledImage}
                download={`upscaled-${scaleFactor}x.png`}
                variant="light"
              >
                Download
              </Button>
            </Group>
            <Image src={upscaledImage} fit="contain" />
          </Paper>
        )}
      </Stack>
    </Container>
  );
}

export default App;
