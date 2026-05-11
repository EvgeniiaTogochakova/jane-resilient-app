import React from 'react';
import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material';
import type { User } from '@/api/users';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => void;
  user?: User | null;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function UserModal({ open, onClose, onSubmit, user }: UserModalProps) {
  const [formData, setFormData] = React.useState<Partial<User>>(
    user || { name: '', email: '', city: '', avatar: '' },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {user ? 'Edit User' : 'Create New User'}
        </Typography>
        <Stack spacing={2}>
          <TextField
            name="name"
            label="Full Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="city"
            label="City"
            fullWidth
            value={formData.city}
            onChange={handleChange}
          />
          <TextField
            name="avatar"
            label="Avatar URL"
            fullWidth
            value={formData.avatar}
            onChange={handleChange}
          />

          <Button variant="contained" onClick={() => onSubmit(formData)}>
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
