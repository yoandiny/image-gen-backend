import { generateImageFromText } from "../services/image.service.js";


export const ImageToTextController = async (req, res) => {
  const { prompt, negativePrompt, style } = req.body;

  try {
    const response = await generateImageFromText({ prompt, negativePrompt, style });
    res.status(200).sendFile(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};