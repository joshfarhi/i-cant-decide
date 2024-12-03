'use client';

import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch('/api/movies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching movies:', error.message);
        } else {
          console.error('Error fetching movies:', error);
        }
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleAction('dislike'),
    onSwipedRight: () => handleAction('like'),
    preventScrollOnSwipe: true,
  });

  const handleAction = (action: 'like' | 'dislike') => {
    const currentMovie = movies[currentIndex];
    if (currentMovie) {
      console.log(`${action === 'like' ? 'Liked' : 'Disliked'}: ${currentMovie.title}`);
    }
    goToNextMovie();
  };

  const goToNextMovie = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('No more movies to display.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {loading ? (
        <div className="text-xl text-gray-500">Loading movies...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : movies.length > 0 ? (
        <div
          {...handlers}
          className="relative w-96 h-96 bg-white shadow-lg rounded-lg overflow-hidden flex items-center justify-center"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movies[currentIndex].poster_path}`}
            alt={movies[currentIndex].title}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-70 px-4 py-2 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{movies[currentIndex].title}</h3>
          </div>
        </div>
      ) : (
        <div className="text-xl text-gray-500">No movies available.</div>
      )}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => handleAction('dislike')}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
        >
          Dislike
        </button>
        <button
          onClick={() => handleAction('like')}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
        >
          Like
        </button>
      </div>
    </div>
  );
}
