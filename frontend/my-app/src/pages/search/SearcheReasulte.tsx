import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchResults: React.FC = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Extraire le terme de recherche depuis l'URL
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`api/api/search/search?query=${query}`);
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la recherche :', error);
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
      {loading ? (
        <p>Chargement...</p>
      ) : results.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map((item) => (
            <li key={item.id} style={{ borderBottom: '1px solid #ddd', padding: '20px' }}>
              <h2>{item.name}</h2>
              <img src={item.photo} alt={item.name} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
              <p>{item.content}</p>
              <p>Prix : {item.price} €</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun résultat trouvé</p>
      )}
    </div>
  );
};

export default SearchResults;
