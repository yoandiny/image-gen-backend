import { generateImageFromImage, generateImageFromText } from "../services/image.service.js";


export const ImageToTextController = async (req, res) => {
  const { prompt, negativePrompt, style } = req.body;

  try {
    const response = await generateImageFromText({ prompt, negativePrompt, style, user: req.user });
    res.status(200);
    res.send(response);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const ImageToImageController = async (req, res) => {
  const { prompt, negativePrompt, style, image } = req.body;

  try {
    const response = await generateImageFromImage({ prompt, negativePrompt, style, image, user: req.user });
    res.status(200);
    res.send(response);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};