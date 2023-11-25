import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Received POST request');
    try {
      // Extracting image and prompt from the request body
      const { image, prompt } = req.body;
      console.log('Request body:', { image, prompt });

      // Logging the API key usage
      console.log('Using Gooey API Key:', process.env.GOOEY_API_KEY);

      // Sending a request to the Gooey AI API
      const gooeyResponse = await axios.post('https://api.gooey.ai/v2/Img2Img/', {
        input_image: image,
        prompt: prompt,
      }, {
        headers: { 'Authorization': `Bearer ${process.env.GOOEY_API_KEY}` }
      });

      console.log('Gooey AI API response:', gooeyResponse.data);

      // Responding with the data received from the Gooey AI API
      res.status(200).json(gooeyResponse.data);
    } catch (error) {
      // Catching and logging any errors that occur during the process
      console.error('Error in processing:', error);
      // Responding with an error message if something goes wrong
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handling any non-POST requests to this endpoint
    console.log(`Received a non-POST request: ${req.method}`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
