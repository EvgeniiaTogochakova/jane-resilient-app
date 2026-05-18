import LanguageIcon from '@mui/icons-material/Language';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  keyframes,
} from '@mui/material';

interface UserDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isDeleting: boolean;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default function UserDeleteModal({
  open,
  onClose,
  onConfirm,
  userName,
  isDeleting,
}: UserDeleteModalProps) {
  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description">
      <DialogTitle id="delete-dialog-title">Delete User Profile?</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          autoFocus
          disabled={isDeleting}
          startIcon={
            isDeleting ? (
              <LanguageIcon
                sx={{
                  animation: `${spin} 2s linear infinite`,
                  color: '#fff',
                }}
              />
            ) : null
          }>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
