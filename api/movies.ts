import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';

  if (!API_KEY) {
    res.status(500).json({ error: 'TMDB API key is not defined in environment variables.' });
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching movies:', error.message);
    } else {
      console.error('Error fetching movies:', error);
    }
    res.status(500).json({ error: 'Failed to fetch movies from TMDb API.' });
  }
}