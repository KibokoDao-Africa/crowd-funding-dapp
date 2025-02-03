import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button,
  TextField,
  Card,
  Typography,
  Container,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/config';
import { useNavigate } from 'react-router-dom';

function CreateCampaign({ contract, account, connectWallet }) {
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!account) {
      setError('Please connect your wallet first');
      connectWallet();
      return;
    }

    try {
      setLoading(true);
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
      
      // Validate inputs
      if (deadlineTimestamp <= Math.floor(Date.now() / 1000)) {
        throw new Error('Deadline must be in the future');
      }
      if (goal <= 0) {
        throw new Error('Goal must be greater than 0');
      }

      const tx = await contract.createCampaign(
        ethers.utils.parseEther(goal.toString()),
        deadlineTimestamp,
        description
      );
      
      await tx.wait();
      navigate('/'); // Redirect to home after creation
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
      if (err.data?.message) {
        setError(err.data.message.replace('execution reverted: ', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please connect your wallet to create a campaign
        </Alert>
        <Button
          variant="contained"
          onClick={connectWallet}  
        >
          Connect Wallet
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Campaign
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Goal Amount (LSK)"
            variant="outlined"
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonetizationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Deadline"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !description || !goal || !deadline}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Launch Campaign'
            )}
          </Button>
        </form>
      </Card>
    </Container>
  );
}

export default CreateCampaign;