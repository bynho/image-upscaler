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
  SimpleGrid,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import CompareImages from 'react-compare-image';
import { initWasm, upscaleImage } from './wasm-handler';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [scaleFactor, setScaleFactor] = useState('2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWasmReady, setIsWasmReady] = useState(false);

  const appVersion = process.env.PACKAGE_VERSION;

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

          <Group justify="space-between" align='flex-end' mt="xl">
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

        {originalImage && upscaledImage && (
          <Paper radius="md" p="xl" withBorder>
            <Title order={3} mb="md">Compare Images</Title>
            <CompareImages
              leftImage={originalImage}
              rightImage={upscaledImage}
              leftImageLabel='Original'
              rightImageLabel='Upscaled'
              sliderLineWidth={3}
              sliderLineColor="var(--mantine-color-blue-6)"
            />
          </Paper>
        )}

        <div height={60} p="md">
          <Text align="center" size="sm" color="dimmed">
            Image Upscaler v{appVersion}
          </Text>
        </div>
      </Stack>
    </Container>
  );
}

export default App;
