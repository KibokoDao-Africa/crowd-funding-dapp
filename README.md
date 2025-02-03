
# Decentralized Crowdfunding DApp on Lisk Blockchain



[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev/)
[![Lisk EVM](https://img.shields.io/badge/Lisk-EVM-3B82F6)](https://lisk.com)

A decentralized crowdfunding platform built on Lisk EVM, enabling users to create campaigns, donate funds, and track progress in real-time.

[![home.png](https://i.postimg.cc/ZRsK74vf/home.png)](https://postimg.cc/vg9sDRz9)

## Features

- 🚀 **Campaign Creation**: Users can create campaigns with goal amounts, deadlines, and descriptions
- 💰 **Secure Donations**: Donate LSK tokens to campaigns with transparent tracking
- 📈 **Real-time Updates**: Live progress tracking with interactive charts
- 🔐 **Fund Management**: Automatic escrow system with withdrawal rules
- 👮 **Admin Dashboard**: Monitor all campaigns and platform statistics
- 🔗 **Wallet Integration**: MetaMask support for Lisk EVM transactions

## Tech Stack

- **Blockchain**: Lisk EVM Testnet
- **Frontend**: React.js + Material-UI
- **Smart Contracts**: Solidity (compiled for Lisk EVM)
- **Wallet**: MetaMask
- **Tools**: ethers.js, react-router-dom

## Installation

1. Clone the repository:
```bash
git clone https://github.com/KibokoDao-Africa/crowd-funding-dapp
cd crowdfunding-dapp/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Update values in `.env`:
```env
REACT_APP_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
REACT_APP_LISK_RPC=https://evm.testnet.lisk.com
```

## Configuration

### MetaMask Setup
1. Add Lisk EVM Testnet to MetaMask:
   - **Network Name**: Lisk EVM Testnet
   - **RPC URL**: `https://evm.testnet.lisk.com`
   - **Chain ID**: `4202`
   - **Block Explorer**: `https://evm.testnet-explorer.lisk.com`

2. Get test LSK tokens from the [Lisk Faucet](https://testnet-faucet.lisk.com/)

## Running the DApp

```bash
npm start
```
The application will run on `http://localhost:3000`

## Smart Contract
- **Contract Address**: `0x22a01749E0C916c859B584528D37e838A8a8eba7`
- **ABI**: Located in `src/contracts/Crowdfund.json`
- Key Functions:
  ```solidity
  function createCampaign(uint256 goal, uint256 deadline, string memory description)
  function donate(uint256 campaignId) external payable
  function withdrawFunds(uint256 campaignId) external
  ```

## Project Structure
```
crowdfunding-dapp/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contracts/      # ABI and contract config
│   │   ├── pages/          # Main application pages
│   │   │   ├── Home.js
│   │   │   ├── Create.js
│   │   │   ├── Campaign.js
│   │   │   └── Admin.js
│   │   ├── App.js          # Root component
│   │   └── index.js
├── contracts/              # Solidity smart contracts
└── README.md
```

## Testing
1. **Create Campaign**
   - Connect wallet
   - Navigate to /create
   - Set goal (in LSK), deadline, and description

2. **Donate to Campaign**
   - Select a campaign from home page
   - Enter donation amount
   - Confirm transaction in MetaMask

3. **Withdraw Funds**
   - After deadline passes (campaign owner only)
   - Click "Withdraw" on campaign page

4. **Admin Dashboard**
   - Connect admin wallet
   - Access /admin for platform statistics

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Transactions failing | Check MetaMask network (Lisk EVM Testnet) |
| Wallet not connecting | Ensure MetaMask extension is installed |
| Contract errors | Verify contract address in .env |
| Loading issues | Clear browser cache & restart dev server |

## Contributing
1. Fork the repository
2. Create feature branch:
```bash
git checkout -b feature/new-feature
```
3. Commit changes
4. Push to branch
5. Open pull request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments
- Lisk EVM documentation
- ethers.js library
- Material-UI components
- React community

---

**Developer**: Gethsun Misesi  
**Contact**: gethsun09@gmail.com
**Project Link**: https://kibokodao-africa.github.io/crowd-funding-dapp/
