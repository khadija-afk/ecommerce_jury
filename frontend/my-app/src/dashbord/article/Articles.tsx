import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../../features/article/articleSlice';
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddArticle from './AddArticle'; // Import du formulaire d'ajout d'article
import UpdateArticle from './UpdateArticle'; // Import du formulaire de mise à jour d'article
import axios from 'axios';

const Articles = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles.articles);
  const articleStatus = useSelector((state) => state.articles.status);
  const error = useSelector((state) => state.articles.error);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  useEffect(() => {
    if (articleStatus === 'idle') {
      dispatch(fetchArticles());
    }
  }, [articleStatus, dispatch]);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (article) => {
    setCurrentArticle(article);
    setOpenUpdate(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le jeton depuis le stockage local ou autre source
      await axios.delete(`http://localhost:9090/api/article/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      dispatch(fetchArticles()); // Assurez-vous que la mise à jour de la liste des articles est effectuée
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Articles
      </Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
        Ajouter Article
      </Button>
      {error && <div>{error}</div>}
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Contenu</TableCell>
              <TableCell>Marque</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.name}</TableCell>
                <TableCell>{article.content}</TableCell>
                <TableCell>{article.brand}</TableCell>
                <TableCell>{article.price}</TableCell>
                <TableCell>{article.status ? 'Disponible' : 'Indisponible'}</TableCell>
                <TableCell>{article.stock}</TableCell>
                <TableCell>{article.user_fk}</TableCell>
                <TableCell>{article.categorie_fk}</TableCell>
                <TableCell>{article.photo}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(article)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(article.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddArticle setOpen={setOpenAdd} open={openAdd} />
      {currentArticle && <UpdateArticle article={currentArticle} setOpen={setOpenUpdate} open={openUpdate} />}
    </Container>
  );
};

export default Articles;
