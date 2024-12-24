
import Image from 'next/image';
import { useState, useEffect } from 'react';



interface ImageLinks {
  thumbnail?: string;
}

interface VolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: ImageLinks;
}

interface Book {
  id: string;
  volumeInfo: VolumeInfo;
}

const BookFinder = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(''); // State to store the search query

  const fetchBooks = async (query: string) => {
    setLoading(true);
    setError('');

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!apiKey) {
        setError('API key is missing.');
        return;
      }

      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      if (data.items) {
        setBooks(data.items);
      } else {
        setError('No books found.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error fetching books. Please try again later.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch books based on the search query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== '') {
      fetchBooks(query);
    }
  };

  // Optionally, you can fetch books when the component loads with an initial query
  useEffect(() => {
    fetchBooks('nextjs'); // Default search query
  }, []);

  return (
    <div className="book-finder-container bg-color" >
      <h1 className="title">Book Finder</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input "
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Book List */}
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <h3 className="book-title">{book.volumeInfo.title}</h3>
            <p className="book-authors">{book.volumeInfo.authors?.join(', ')}</p>
            {book.volumeInfo.imageLinks?.thumbnail && (
              <Image
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                height={100}
                width={200}
                className="book-thumbnail"
              />
            )}
            <p className="book-description">{book.volumeInfo.description}</p>
          </div>
        ))}
      </div>
      <h4 className='author text-center mt-4 font-bold text-gray-400'>Author:Azmat Ali</h4>
    </div>
  );
};

export default BookFinder;





