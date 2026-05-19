import {
  Modal,
  Box,
  IconButton,
  Typography,
  Stack,
  TextField,
  Button,
  keyframes,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type User } from '@/api/users';
import { userFormSchema, type UserFormData } from '@/components/UserModal.schema';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user: User | null;
  isFormSubmitting: boolean;
}

export default function UserModal({
  open,
  onClose,
  onSubmit,
  user,
  isFormSubmitting,
}: UserModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      city: user?.city || '',
      avatar: user?.avatar || '',
    },
  });

  const onValidSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  return (
    <Modal open={open} onClose={isFormSubmitting ? undefined : onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit(onValidSubmit)}>
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
            label="Full Name"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="City"
            fullWidth
            {...register('city')}
            error={!!errors.city}
            helperText={errors.city?.message}
          />

          <TextField
            label="Avatar URL"
            fullWidth
            {...register('avatar')}
            error={!!errors.avatar}
            helperText={errors.avatar?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFormSubmitting}
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
