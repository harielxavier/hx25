import express from 'express';
import { uploadSliderImagesWithAdmin } from '../services/adminSliderService';

const router = express.Router();

/**
 * API endpoint to upload slider images using the admin SDK
 * POST /api/upload-slider-images
 */
router.post('/upload-slider-images', async (req, res) => {
  try {
    const { sliderId } = req.body;
    
    if (!sliderId) {
      return res.status(400).json({ error: 'Slider ID is required' });
    }
    
    const imageUrls = await uploadSliderImagesWithAdmin(sliderId);
    
    return res.status(200).json({
      success: true,
      data: imageUrls
    });
  } catch (error) {
    console.error('Error uploading slider images:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload slider images'
    });
  }
});

export default router;
