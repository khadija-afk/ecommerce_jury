import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUser from './AddUser'; 
import UpdateUser from './UpdateUser'; 
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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const Users: React.FC = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/api/user/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setOpenUpdate(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/user/delete/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const addUser = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Utilisateurs
      </Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
        Ajouter Utilisateur
      </Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prenom</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openAdd && <AddUser slug="user" setOpen={setOpenAdd} addUser={addUser} />}
      {openUpdate && currentUser && <UpdateUser user={currentUser} setOpen={setOpenUpdate} />}
    </Container>
  );
};

export default Users;