import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  keyframes,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import type { User } from '@/api/users';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => void;
  user?: User | null;
  isFormSubmitting: boolean;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'calc(100% - 32px)',
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: {
    xs: 2,
    sm: 4,
  },
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export default function UserModal({
  open,
  onClose,
  onSubmit,
  user,
  isFormSubmitting,
}: UserModalProps) {
  const [formData, setFormData] = React.useState<Partial<User>>(
    user || { name: '', email: '', city: '', avatar: '' },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal open={open} onClose={isFormSubmitting ? undefined : onClose}>
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={isFormSubmitting}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            opacity: isFormSubmitting ? 0.5 : 1,
          }}>
          <CloseIcon />
        </IconButton>

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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFormSubmitting}
            onClick={() => onSubmit(formData)}
            startIcon={
              isFormSubmitting ? (
                <LanguageIcon
                  sx={{
                    animation: `${spin} 2s linear infinite`,
                    color: '#fff',
                  }}
                />
              ) : null
            }>
            {isFormSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
