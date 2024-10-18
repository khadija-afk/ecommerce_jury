import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button
} from '@mui/material';

interface AddUserProps {
  slug: string;
  setOpen: (open: boolean) => void;
  addUser: (user: User) => void;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const AddUser: React.FC<AddUserProps> = ({ slug, setOpen, addUser }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/user/add`, formData); // Modification de l'URL
      addUser(response.data); // Ajoutez le nouvel utilisateur à la liste
      setOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Dialog open onClose={() => setOpen(false)}>
      <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Rôle"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button type="submit" color="primary">
            Ajouter un utilisateur
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUser;
