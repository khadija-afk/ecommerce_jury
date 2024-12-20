import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import NoResults from './NoResult'; // Import du composant NoResults

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
  const navigate = useNavigate(); // Ajout de `useNavigate`

  // Fonction pour naviguer vers les détails de l'article
  const handleNavigation = (id: number) => {
    navigate(`/detailArticle/${id}`);
  };

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
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError("Aucun résultat trouvé pour votre recherche.");
        } else {
          setError("Une erreur s'est produite lors de la recherche.");
        }
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

      {/* Afficher le composant NoResults si aucun résultat n'est trouvé */}
      {!loading && !error && results.length === 0 && <NoResults />}

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
              <button
                onClick={() => handleNavigation(item.id)} // Passez `item.id`
                className="btn custom-button"
              >
                Voir les détails
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
