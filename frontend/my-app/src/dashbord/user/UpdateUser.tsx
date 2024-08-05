import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button
} from '@mui/material';

interface UpdateUserProps {
  user: User | null; // Utilisateur à éditer
  setOpen: (open: boolean) => void;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ user, setOpen }) => {
  const [formData, setFormData] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9090/api/user/update/${formData.id}`, formData);
      setOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Dialog open onClose={() => setOpen(false)}>
      <DialogTitle>Modifier Utilisateur</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            type="firstName"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            type="lastName"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            type="role"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Update User
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateUser;
