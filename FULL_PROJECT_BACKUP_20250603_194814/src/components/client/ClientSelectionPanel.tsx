import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  CircularProgress, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Alert,
  Chip,
  Grid
} from '@mui/material';
import { 
  Check, 
  Send, 
  Clock, 
  AlertTriangle, 
  X 
} from 'lucide-react';
import { 
  submitClientSelections, 
  getClientSelections, 
  hasSelectionDeadlinePassed 
} from '../../services/clientGalleryService';
import { formatDate } from '../../utils/dateUtils';

interface ClientSelectionPanelProps {
  galleryId: string;
  clientId: string;
  selectionRequired: number;
  selectionDeadline: Date | null;
  selections: string[];
  onSelectionsChange: (selections: string[]) => void;
  onSubmitSuccess: () => void;
}

const ClientSelectionPanel: React.FC<ClientSelectionPanelProps> = ({
  galleryId,
  clientId,
  selectionRequired,
  selectionDeadline,
  selections,
  onSelectionsChange,
  onSubmitSuccess
}) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [previouslySubmitted, setPreviouslySubmitted] = useState(false);
  
  useEffect(() => {
    // Check if deadline has passed
    if (selectionDeadline) {
      setDeadlinePassed(hasSelectionDeadlinePassed({ selectionDeadline }));
    }
    
    // Check if client has already submitted selections
    const checkPreviousSelections = async () => {
      try {
        const previousSelections = await getClientSelections(clientId, galleryId);
        setPreviouslySubmitted(previousSelections.length > 0);
        
        // If there are previous selections and the current selections are empty,
        // load the previous selections
        if (previousSelections.length > 0 && selections.length === 0) {
          onSelectionsChange(previousSelections.map(s => s.id));
        }
      } catch (err) {
        console.error('Error checking previous selections:', err);
      }
    };
    
    checkPreviousSelections();
  }, [galleryId, clientId, selectionDeadline, selections.length, onSelectionsChange]);
  
  const handleOpenConfirm = () => {
    if (selections.length < selectionRequired) {
      setError(`Please select at least ${selectionRequired} images before submitting.`);
      return;
    }
    
    setConfirmOpen(true);
  };
  
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await submitClientSelections(clientId, galleryId, selections, comment);
      setSuccess('Your selections have been submitted successfully!');
      setPreviouslySubmitted(true);
      handleCloseConfirm();
      onSubmitSuccess();
    } catch (err: any) {
      console.error('Error submitting selections:', err);
      setError(err.message || 'An error occurred while submitting your selections.');
    } finally {
      setLoading(false);
    }
  };
  
  const getDeadlineStatus = () => {
    if (!selectionDeadline) return null;
    
    if (deadlinePassed) {
      return (
        <Chip 
          icon={<AlertTriangle size={16} />} 
          label="Deadline passed" 
          color="error" 
          size="small" 
        />
      );
    }
    
    // Calculate days remaining
    const now = new Date();
    const deadline = new Date(selectionDeadline);
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 3) {
      return (
        <Chip 
          icon={<Clock size={16} />} 
          label={`${daysRemaining} days left`} 
          color="warning" 
          size="small" 
        />
      );
    }
    
    return (
      <Chip 
        icon={<Clock size={16} />} 
        label={`Deadline: ${formatDate(deadline)}`} 
        color="default" 
        size="small" 
      />
    );
  };
  
  return (
    <Paper elevation={2} className="p-4 md:p-6 rounded-xl">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" component="h3">
          Image Selections
        </Typography>
        {getDeadlineStatus()}
      </Box>
      
      {error && (
        <Alert 
          severity="error" 
          className="mb-4"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          className="mb-4"
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}
      
      <Box className="mb-4">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box className="p-3 bg-blue-50 rounded-lg text-center">
              <Typography variant="h5" color="primary">
                {selections.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Selected
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box className="p-3 bg-indigo-50 rounded-lg text-center">
              <Typography variant="h5" color="primary.dark">
                {selectionRequired}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Required
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {previouslySubmitted && (
        <Alert severity="info" className="mb-4">
          <AlertTriangle size={16} className="mr-2" />
          You have already submitted selections for this gallery. You can modify your selections and submit again if needed.
        </Alert>
      )}
      
      {deadlinePassed ? (
        <Alert severity="warning" className="mb-4">
          <Clock size={16} className="mr-2" />
          The selection deadline has passed. Please contact your photographer if you need to make changes.
        </Alert>
      ) : (
        <>
          <TextField
            label="Add a note to your photographer (optional)"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
            className="mb-4"
            disabled={loading}
          />
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
            onClick={handleOpenConfirm}
            disabled={loading || selections.length < selectionRequired}
          >
            {loading ? 'Submitting...' : 'Submit Selections'}
          </Button>
          
          <Typography variant="body2" color="textSecondary" className="mt-2 text-center">
            {selections.length < selectionRequired ? (
              <span className="text-red-500">
                Please select {selectionRequired - selections.length} more images
              </span>
            ) : (
              <span className="text-green-500">
                Selection complete! You can now submit.
              </span>
            )}
          </Typography>
        </>
      )}
      
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
      >
        <DialogTitle>
          Confirm Selections
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to submit {selections.length} image selections. Your photographer will be notified of your choices.
            {previouslySubmitted && (
              <Box className="mt-2">
                <strong>Note:</strong> This will update your previous selections.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseConfirm} 
            color="inherit"
            startIcon={<X size={18} />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Check size={18} />}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Confirm & Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ClientSelectionPanel;
