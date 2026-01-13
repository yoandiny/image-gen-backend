import { generateImageFromText } from "../services/image.service.js";


export const ImageToTextController = async (req, res) => {
  const { prompt, negativePrompt, style } = req.body;

  try {
    const response = await generateImageFromText({ prompt, negativePrompt, style });
    res.set(200, {
      "Content-Type": "image/png",      // type MIME pour le front
      "Content-Length": response.length,
    });
    res.send(response);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};