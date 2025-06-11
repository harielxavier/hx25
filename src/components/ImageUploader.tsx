import { Box, Button, FormLabel, Image } from '@chakra-ui/react';
import { useState } from 'react';

export const ImageUploader = ({ label, onUpload, currentImage }: {
  label: string;
  onUpload: (file: File) => Promise<void>;
  currentImage: string;
}) => {
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      await onUpload(file);
    }
  };

  return (
    <Box>
      <FormLabel>{label}</FormLabel>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={`upload-${label}`}
      />
      <Button as="label" htmlFor={`upload-${label}`} mb={2}>
        Upload Image
      </Button>
      {preview && (
        <Image
          src={preview}
          alt="Preview"
          maxH="200px"
          borderRadius="md"
        />
      )}
    </Box>
  );
};
