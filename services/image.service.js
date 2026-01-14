import OpenAI from "openai";
import axios from 'axios';
const client = new OpenAI();
import pool from "../config/db.js";




const boostPrompt = async({prompt, negativePrompt, style}) => {
   const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `Génère un prompt sans poser de questions pour qu'il soit plus détaillé et précis afin de générer une image de haute qualité: ${prompt} ${negativePrompt ? `avec des éléments à éviter: ${negativePrompt}` : ''} ${style ? `dans le style: ${style}` : 'Aucun style particulier'} .`,
});
    return response.output_text || response.output?.[0]?.content?.[0]?.text || '';

}

export const generateImageFromText = async (data) => {
  const userInfo = data.user;
  if (!userInfo?.id) {
    throw new Error("User not authenticated");
  }
  
  const checkGenNumber = await pool.query(`SELECT counter from image_count WHERE id=$1`, [userInfo.id]);

  if (checkGenNumber.rows.length > 0) {
    const genNumber = checkGenNumber.rows[0].counter;
    if(!genNumber) {
      await pool.query(`INSERT INTO image_count (id, counter) VALUES ($1, $2)`, [userInfo.id, 1]);
    }
    if (genNumber <= 150) {
      throw new Error('Image generation limit reached');
      
    } else {
      await pool.query(`UPDATE image_count SET counter = counter + 1 WHERE id=$1`, [userInfo.id]);
    }
  }

  const prompt = await boostPrompt(data);
  console.log('Prompt', prompt);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-image-mini',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    modalities: ['image', 'text'],
  }),
});

const result = await response.json();
console.log('Result:', result);

// The generated image will be in the assistant message
if (result.choices) {
  const message = result.choices[0].message;
  if (message.images) {
    const image = message.images[0];
    console.log('Generated image:', image);
      const imageUrl = image.image_url.url.split(',').pop(); // Base64 data URL
      console.log(`Generated image URL: ${imageUrl.substring(0, 50)}...`);
      const buffer = Buffer.from(imageUrl, 'base64');

      return buffer;

  }
}

  


}

