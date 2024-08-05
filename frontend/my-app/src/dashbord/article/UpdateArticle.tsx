import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateArticle } from '../../features/article/articleSlice';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';

interface UpdateArticleProps {
  article: Article | null; // Article à éditer
  setOpen: (open: boolean) => void;
  open: boolean; // Ajouter une prop pour la gestion de l'état ouvert du dialogue
}

interface Article {
  id: number;
  name: string;
  content: string;
  brand: string;
  price: number;
  status: boolean;
  stock: number;
  categorie_fk: number;
  photo: string;
}

const UpdateArticle: React.FC<UpdateArticleProps> = ({ article, setOpen, open }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Article>({
    id: 0,
    name: '',
    content: '',
    brand: '',
    price: 0,
    status: false,
    stock: 0,
    categorie_fk: 0,
    photo: ''
  });

  useEffect(() => {
    if (article) {
      setFormData({
        id: article.id,
        name: article.name,
        content: article.content,
        brand: article.brand,
        price: article.price,
        status: article.status,
        stock: article.stock,
        categorie_fk: article.categorie_fk,
        photo: article.photo
      });
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateArticle(formData));
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-hidden={!open}>
      <DialogTitle>Modifier Article</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Contenu"
            name="content"
            value={formData.content}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Marque"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Prix"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Status"
            name="status"
            type="checkbox"
            checked={formData.status}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Catégorie"
            name="categorie_fk"
            type="number"
            value={formData.categorie_fk}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Photo"
            name="photo"
            type="text"
            value={formData.photo}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button type="submit" color="primary">
            Modifier
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateArticle;
