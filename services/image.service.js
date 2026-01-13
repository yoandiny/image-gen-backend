import OpenAI from "openai";
import axios from 'axios';
const client = new OpenAI();
import fs from 'fs';
import path from 'path';




const boostPrompt = async({prompt, negativePrompt, style}) => {
   const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `Génère un prompt sans poser de questions pour qu'il soit plus détaillé et précis afin de générer une image de haute qualité: ${prompt} ${negativePrompt ? `avec des éléments à éviter: ${negativePrompt}` : ''} ${style ? `dans le style: ${style}` : 'Aucun style particulier'} .`,
});
    return response.output_text || response.output?.[0]?.content?.[0]?.text || '';

}

export const generateImageFromText = async (data) => {

  const prompt = await boostPrompt(data);
  console.log('Prompt', prompt);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash-image-preview',
    messages: [
      {
        role: 'user',
        content: 'Generate a beautiful sunset over mountains',
      },
    ],
    modalities: ['image', 'text'],
  }),
});

const result = await response.json();

// The generated image will be in the assistant message
if (result.choices) {
  const message = result.choices[0].message;
  if (message.images) {
    const image = message.images[0];
      const imageUrl = image.image_url.url.split(',')[1]; // Base64 data URL
      console.log(`Generated image URL: ${imageUrl.substring(0, 50)}...`);
      const filePath = path.join(process.cwd(), 'generated_image.png');
      console.log(`Saving image to: ${filePath}`);
      fs.writeFileSync(filePath, Buffer.from(imageUrl, 'base64'));

      return filePath;

  }
}

  


}

