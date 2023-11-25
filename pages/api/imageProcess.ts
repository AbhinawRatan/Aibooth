import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const taskStatusStore = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return handlePostRequest(req, res);
  } else if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { image, prompt } = req.body;
  const taskId = uuidv4(); // Generate a unique task ID

  taskStatusStore.set(taskId, { status: 'processing' });
  processImageAsync(taskId, image, prompt);

  res.status(202).json({ taskId, status: 'processing' });
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  const taskStatus = taskStatusStore.get(taskId);
  if (!taskStatus) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(taskStatus);
}

async function processImageAsync(taskId: string, image: string, prompt: string) {
  try {
    const gooeyResponse = await axios.post('https://api.gooey.ai/v2/Img2Img/', {
      input_image: image,
      prompt: prompt,
    }, {
      headers: { 'Authorization': `Bearer ${process.env.GOOEY_API_KEY}` },
      timeout: 8000
    });

    taskStatusStore.set(taskId, { status: 'completed', data: gooeyResponse.data });
  } catch (error) {
    console.error('Error in processing:', error);
    taskStatusStore.set(taskId, { status: 'failed', error: getErrorMessage(error) });
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
