import { useState, useEffect } from 'react';
import { formatEther, parseEther } from "ethers";
import {
  Box,
  Card,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';



// Add your admin addresses here
const ADMIN_ADDRESSES = ['0x3535448e2AAa9EfB9F575F292C904d383EDa9352', '0xf672e2b5b3072b7ee79e3bddcf5907032c8d0c74'];

function Admin({ contract, account }) {
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalRaised, setTotalRaised] = useState(0);

  useEffect(() => {
    if (account && !ADMIN_ADDRESSES.includes(account.toLowerCase())) {
      setError('Unauthorized access');
    }
  }, [account]);


  // Load campaign data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const count = await contract.campaignCount();
        const campaigns = [];
        let total = 0n;
        
        for (let i = 0; i < count; i++) {
          const c = await contract.campaigns(i);
          campaigns.push({
            id: i,
            owner: c.owner,
            goal: formatEther(c.goal),
            raised: formatEther(c.raised),
            deadline: new Date(c.deadline * 1000),
            description: c.description,
            withdrawn: c.fundsWithdrawn
          });
          total = total.add(c.raised);
        }
        
        setAllCampaigns(campaigns);
        setTotalRaised(formatEther(total));
        setLoading(false);
      } catch (err) {
        setError('Failed to load campaign data');
        setLoading(false);
      }
    };

    if (contract && !error && account && ADMIN_ADDRESSES.includes(account.toLowerCase())) {
        loadData();
      }
    }, [contract, error, account]);
  
    if (error) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }
  
    if (!account || !ADMIN_ADDRESSES.includes(account.toLowerCase())) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">Admin access required</Alert>
        </Box>
      );
    }
  
    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Card sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="h6">Total Campaigns</Typography>
          <Typography variant="h3">{allCampaigns.length}</Typography>
        </Card>
        
        <Card sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="h6">Total Raised</Typography>
          <Typography variant="h3">{totalRaised} LSK</Typography>
        </Card>
      </Box>

      <Typography variant="h5" gutterBottom>
        All Campaigns
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Raised/Goal</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allCampaigns.map((campaign) => {
              const progress = (campaign.raised / campaign.goal) * 100;
              const isExpired = new Date() > campaign.deadline;
              const status = campaign.withdrawn 
                ? 'Funds Withdrawn' 
                : isExpired 
                ? 'Expired' 
                : 'Active';

              return (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.id}</TableCell>
                  <TableCell>{campaign.description}</TableCell>
                  <TableCell>
                    {campaign.raised} / {campaign.goal} LSK
                  </TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ width: 100, height: 8 }}
                    />
                    {progress.toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    {campaign.deadline.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={status}
                      color={
                        status === 'Active' ? 'success' 
                        : status === 'Expired' ? 'warning' 
                        : 'default'
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {allCampaigns.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No campaigns found
        </Alert>
      )}
    </Box>
  );
}

export default Admin;