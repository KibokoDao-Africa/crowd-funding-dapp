import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contracts/config';
import Home from './pages/Home';
import CreateCampaign from './pages/Create';
import Campaign from './pages/Campaign';
import Admin from './pages/Admin';
import { AppBar, Toolbar, Button, Container, CircularProgress } from '@mui/material';

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            provider.getSigner()
          );
          
          // Check if already connected
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) setAccount(accounts[0]);

          setProvider(provider);
          setContract(contract);
          setLoading(false);
        } catch (error) {
          console.error('Error initializing:', error);
          setLoading(false);
        }
      } else {
        console.log('Please install MetaMask!');
        setLoading(false);
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/create">
            Create Campaign
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>
          <div style={{ flexGrow: 1 }} />
          {account ? (
            <Button color="inherit">
              {`${account.slice(0, 6)}...${account.slice(-4)}`}
            </Button>
          ) : (
            <Button color="inherit" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home contract={contract} account={account} connectWallet={connectWallet} />} />
          <Route 
            path="/create" 
            element={<CreateCampaign contract={contract} account={account} connectWallet={connectWallet} />} 
          />
          <Route 
            path="/campaign/:id" 
            element={<Campaign contract={contract} account={account} />} 
          />
          <Route 
            path="/admin" 
            element={<Admin contract={contract} account={account} />} 
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;