// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Crowdfunding {
    struct Campaign {
        address owner;
        uint256 goal;
        uint256 deadline;
        string description;
        uint256 raised;
        bool fundsWithdrawn;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(uint256 indexed id, address owner, uint256 goal, uint256 deadline);
    event DonationMade(uint256 indexed id, address donor, uint256 amount);
    event FundsWithdrawn(uint256 indexed id, uint256 amount);

    function createCampaign(uint256 _goal, uint256 _deadline, string memory _description) external {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        campaigns[campaignCount] = Campaign({
            owner: msg.sender,
            goal: _goal,
            deadline: _deadline,
            description: _description,
            raised: 0,
            fundsWithdrawn: false
        });
        emit CampaignCreated(campaignCount, msg.sender, _goal, _deadline);
        campaignCount++;
    }

    function donate(uint256 _id) external payable {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp < campaign.deadline, "Campaign expired");
        campaign.raised += msg.value;
        emit DonationMade(_id, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Not owner");
        require(block.timestamp >= campaign.deadline, "Deadline not met");
        require(campaign.raised >= campaign.goal, "Goal not met");
        require(!campaign.fundsWithdrawn, "Already withdrawn");

        campaign.fundsWithdrawn = true;
        (bool sent, ) = payable(campaign.owner).call{value: campaign.raised}("");
        require(sent, "Withdrawal failed");
        emit FundsWithdrawn(_id, campaign.raised);
    }
}