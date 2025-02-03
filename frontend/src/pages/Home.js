import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button,
  Card,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';


function Home({ contract, account, connectWallet }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  // Initialize contract and check wallet connection


  // Load campaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const count = await contract.campaignCount();
        const campaigns = [];
        
        for (let i = 0; i < count; i++) {
          const c = await contract.campaigns(i);
          campaigns.push({
            id: i,
            owner: c.owner,
            goal: ethers.utils.formatEther(c.goal),
            raised: ethers.utils.formatEther(c.raised),
            deadline: new Date(c.deadline * 1000),
            description: c.description
          });
        }
        
        setCampaigns(campaigns);
        setLoading(false);
      } catch (err) {
        setError('Failed to load campaigns');
        setLoading(false);
      }
    };

    if (contract) loadCampaigns();
  }, [contract]);


  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Active Campaigns</Typography>
        {!account ? (
          <Button
            variant="contained"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        ) : (
          <Chip 
            label={`Connected: ${account.slice(0, 6)}...${account.slice(-4)}`} 
            color="success" 
          />
        )}
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => {
          const progress = (campaign.raised / campaign.goal) * 100;
          const isExpired = new Date() > campaign.deadline;

          return (
            <Grid item xs={12} md={6} key={campaign.id}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {campaign.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip
                    icon={<MonetizationOnIcon />}
                    label={`Goal: ${campaign.goal} LSK`}
                    size="small"
                  />
                  <Chip
                    icon={<EventIcon />}
                    label={`Deadline: ${campaign.deadline.toLocaleDateString()}`}
                    color={isExpired ? 'error' : 'default'}
                    size="small"
                  />
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)}
                  sx={{ height: 8, mb: 1 }}
                />

                <Typography variant="body2" color="text.secondary">
                  Raised: {campaign.raised} LSK ({progress.toFixed(1)}%)
                </Typography>

                <Button
                  component={Link}
                  to={`/campaign/${campaign.id}`}
                  variant="outlined"
                  sx={{ mt: 1.5 }}
                >
                  View Details
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {campaigns.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No active campaigns found
        </Alert>
      )}
    </Box>
  );
}

export default Home;