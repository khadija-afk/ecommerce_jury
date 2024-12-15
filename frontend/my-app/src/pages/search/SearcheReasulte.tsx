import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../../utils/axiosConfig';

interface SearchResult {
  id: number;
  name: string;
  photo: string;
  content: string;
  price: number;
}

const SearchResults: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]); // Typage explicite
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Extraire le terme de recherche depuis l'URL
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Requête API
        const response = await apiClient.get(`/api/search/search?query=${query}`);
        
        // Vérifier si la réponse est un tableau
        if (Array.isArray(response.data)) {
          setResults(response.data);
        } else {
          throw new Error("Les données reçues ne sont pas valides.");
        }
      } catch (err) {
        setError("Une erreur s'est produite lors de la recherche.");
        console.error('Erreur lors de la recherche :', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div>
      <h1>Résultats pour "{query}"</h1>

      {loading && <p>Chargement...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p>Aucun résultat trouvé pour votre recherche.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map((item) => (
            <li
              key={item.id}
              style={{ borderBottom: '1px solid #ddd', padding: '20px' }}
            >
              <h2>{item.name}</h2>
              <img
                src={item.photo}
                alt={item.name}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                }}
              />
              <p>{item.content}</p>
              <p>Prix : {item.price} €</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
