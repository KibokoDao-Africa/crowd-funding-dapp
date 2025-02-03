import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Button, 
  Card, 
  TextField, 
  LinearProgress,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress
} from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';


function Campaign({ contract, account }) {
  const { id: campaignId } = useParams();
  const [amount, setAmount] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donationLoading, setDonationLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  


  // Load campaign data
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const campaignData = await contract.campaigns(campaignId);
        setCampaign({
          id: campaignId,
          owner: campaignData.owner,
          goal: ethers.utils.formatEther(campaignData.goal),
          raised: ethers.utils.formatEther(campaignData.raised),
          deadline: new Date(campaignData.deadline * 1000),
          description: campaignData.description,
          fundsWithdrawn: campaignData.fundsWithdrawn
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load campaign data');
        setLoading(false);
      }
    };

    if (contract) loadCampaign();
  }, [contract, campaignId]);

  // Event listeners for real-time updates
  useEffect(() => {
    if (!contract) return;

    const donationHandler = (id, donor, amount) => {
      if (id.toString() === campaignId) {
        setCampaign(prev => ({
          ...prev,
          raised: ethers.utils.formatEther(
            ethers.BigNumber.from(ethers.utils.parseEther(prev.raised)).add(amount)
          )
        }));
      }
    };

    contract.on('DonationMade', donationHandler);

    return () => {
      contract.off('DonationMade', donationHandler);
    };
  }, [contract, campaignId]);

  const handleDonate = async () => {
    try {
      setDonationLoading(true);
      setError('');
      const tx = await contract.donate(campaignId, {
        value: ethers.utils.parseEther(amount)
      });
      await tx.wait();
      setAmount('');
    } catch (err) {
      setError(err.message || 'Donation failed');
    } finally {
      setDonationLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      setError('');
      const tx = await contract.withdrawFunds(campaignId);
      await tx.wait();
      setCampaign(prev => ({ ...prev, fundsWithdrawn: true }));
    } catch (err) {
      setError(err.message || 'Withdrawal failed');
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!campaign) return <Alert severity="error">Campaign not found</Alert>;

  const progress = (campaign.raised / campaign.goal) * 100;
  const isExpired = new Date() > campaign.deadline;
  const isOwner = account.toLowerCase() === campaign.owner.toLowerCase();

  return (
    <Card sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {campaign.description}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Chip 
          icon={<MonetizationOnIcon />}
          label={`Goal: ${campaign.goal} LSK`}
          color="primary"
        />
        <Chip
          icon={<EventIcon />}
          label={`Deadline: ${campaign.deadline.toLocaleDateString()}`}
          color={isExpired ? 'error' : 'default'}
        />
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={Math.min(progress, 100)} 
        sx={{ height: 10, mb: 2 }}
      />

      <Typography variant="h6" gutterBottom>
        Raised: {campaign.raised} / {campaign.goal} LSK
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!isExpired && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Amount (LSK)"
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={donationLoading}
          />
          <Button 
            variant="contained" 
            onClick={handleDonate}
            disabled={!amount || donationLoading}
          >
            {donationLoading ? <CircularProgress size={24} /> : 'Donate'}
          </Button>
        </Box>
      )}

      {isOwner && isExpired && !campaign.fundsWithdrawn && (
        <Button
          variant="contained"
          color="success"
          onClick={handleWithdraw}
          disabled={withdrawLoading || campaign.raised < campaign.goal}
          sx={{ mt: 2 }}
        >
          {withdrawLoading ? (
            <CircularProgress size={24} />
          ) : (
            `Withdraw ${campaign.raised} LSK`
          )}
        </Button>
      )}

      {campaign.fundsWithdrawn && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Funds have been successfully withdrawn
        </Alert>
      )}
    </Card>
  );
}

export default Campaign;