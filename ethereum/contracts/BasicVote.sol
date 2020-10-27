// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./SafeMath.sol";
import "./IVote.sol";

contract BasicVote is IVote {

    // Name of the contract
    string internal constant contractName = "EESTEC LC Zagreb Basic Voting Contract";

    // Total propositions
    uint256 internal totalPropositions;

    // List of propositions
    mapping(uint256 => Proposition) internal propositionsList;

    /**
     * @dev Initialize contract on deployment.
     */
    constructor() {
        totalPropositions = 0;
    }

    /**
     * @dev
     */
    function getName() external pure returns (string memory) {
        return contractName;
    }

    /**
     * @dev
     */
    function getNumberOfPropositions() external view override
        returns (uint256)
    {
        return totalPropositions;
    }

    /**
     * @dev
     */
    function getActivePropositions()
        external
        view
        override
        returns (uint[10] memory)
    {
        uint[10] memory activeIds;
        uint activeCount = 0;

        for (uint p = 0; p < totalPropositions && activeCount < 10; p++) {
            if (
                propositionsList[p].startBlock <= block.number &&
                    propositionsList[p].endBlock >= block.number
            ) {
                activeIds[activeCount] = p;
                activeCount++;
            }
        }

        return activeIds;
    }

    /**
     * @dev
     */
    function createProposition(
            string memory title,
            string memory description,
            uint256 startBlock,
            uint256 endBlock
        )
        external
        override
        validStartBlock(startBlock)
        validEndBlock(startBlock, endBlock)
        returns (uint256)
    {
        Proposition storage p = propositionsList[totalPropositions];

        totalPropositions = SafeMath.add(totalPropositions, 1);

        p.id = totalPropositions;
        p.title = title;
        p.description = description;
        p.proposedBy = msg.sender;
        p.totalVotes = 0;
        p.totalVotesAccept = 0;
        p.totalVotesDeny = 0;
        p.totalVotesReserved = 0;
        p.startBlock = startBlock;
        p.endBlock = endBlock;

        return p.id;
    }

    /**
     * @dev
     */
    function getPropositionInfo(uint256 propositionId)
        external
        view
        override
        validPropositionId(propositionId)
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address proposedBy,
            uint256 startBlock,
            uint256 endBlock
        )
    {
        return (
            propositionsList[propositionId].id,
            propositionsList[propositionId].title,
            propositionsList[propositionId].description,
            propositionsList[propositionId].proposedBy,
            propositionsList[propositionId].startBlock,
            propositionsList[propositionId].endBlock
        );
    }

    /**
     * @dev
     */
    function getPropositionVotes(uint256 propositionId)
        external
        view
        override
        validPropositionId(propositionId)
        returns (
            uint256 totalVotes,
            uint256 totalVotesAccept,
            uint256 totalVotesDeny,
            uint256 totalVotesReserved
        )
    {
        return (
            propositionsList[propositionId].totalVotes,
            propositionsList[propositionId].totalVotesAccept,
            propositionsList[propositionId].totalVotesDeny,
            propositionsList[propositionId].totalVotesReserved
        );
    }

    /**
     * @dev
     */
    function getPropositionStatus(uint256 propositionId)
        external
        view
        override
        validPropositionId(propositionId)
        returns (PropositionStatus)
    {
        if (propositionsList[propositionId].startBlock > block.number) {
            return PropositionStatus.PENDING;
        }
        else if (propositionsList[propositionId].endBlock >= block.number) {
            return PropositionStatus.ACTIVE;
        }
        else {
            // TODO calculate treshold
            return PropositionStatus.SUCCEEDED;
        }
    }

    /**
     * @dev
     */
    function vote(
        uint256 propositionId,
        VotingOptions votingOption
        )
        external
        override
        validPropositionId(propositionId)
        propositionIsActive(propositionId)
        haventVoted(propositionId)
    {
        Proposition storage p = propositionsList[propositionId];

        if (votingOption == VotingOptions.ACCEPT) {
            p.votersAccept[msg.sender] = true;
            p.totalVotesAccept = SafeMath.add(p.totalVotesAccept, 1);
        }
        else if (votingOption == VotingOptions.DENY) {
            p.votersDeny[msg.sender] = true;
            p.totalVotesDeny = SafeMath.add(p.totalVotesDeny, 1);
        }
        else if (votingOption == VotingOptions.RESERVED) {
            p.votersReserved[msg.sender] = true;
            p.totalVotesReserved = SafeMath.add(p.totalVotesReserved, 1);
        } else {
            revert("Invalid voting option!");
        }

        p.totalVotes = SafeMath.add(p.totalVotes, 1);
    }

    /**
     * @dev
     */
    modifier validPropositionId(uint256 propositionId) {
        require(
            propositionId >= 0 && propositionId < totalPropositions,
            "Invalid proposition ID!"
        );

        _;
    }

    /**
     * @dev
     */
    modifier validStartBlock(uint256 startBlock) {
        require(
            startBlock >= block.number,
            "Block number can't be greater than the start block!"
        );

        _;
    }

    /**
     * @dev
     */
    modifier validEndBlock(uint256 startBlock, uint256 endBlock) {
        require(
            startBlock < endBlock,
            "End block must be greater than start block!"
        );
        require(
            endBlock > block.number,
            "Block number can't be greater than the end block!"
        );

        _;
    }

    /**
     * @dev
     */
    modifier haventVoted(uint256 propositionId) {
        require(
            !(propositionsList[propositionId].votersAccept[msg.sender]),
            "You already voted!"
        );
        require(
            !(propositionsList[propositionId].votersDeny[msg.sender]),
            "You already voted!"
        );
        require(
            !(propositionsList[propositionId].votersReserved[msg.sender]),
            "You already voted!"
        );

        _;
    }

    /**
     * @dev
     */
    modifier propositionIsActive(uint256 propositionId) {
        require(
            propositionsList[propositionId].startBlock <= block.number &&
            propositionsList[propositionId].endBlock >= block.number,
            "Proposition is not active for voting!"
        );

        _;
    }
}

