// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./SafeMath.sol";
import "./IVote.sol";

contract BasicVote is IVote {
    // Name of the contract
    string
        internal constant contractName = "EESTEC LC Zagreb Basic Voting Contract";

    // Total propositions
    uint256 internal totalPropositions;

    // List of propositions
    mapping(uint256 => Proposition) internal propositionsList;

    // Token interface
    DaoToken internal token;

    /**
     * @dev Initialize contract on deployment.
     */
    constructor(address tokenContract) {
        totalPropositions = 0;
        token = DaoToken(tokenContract);
    }

    /**
     * @notice Get the address of token contract.
     * @return the contract address
     */
    function getTokenAddress() external view returns (address) {
        return address(token);
    }

    /**
     * @notice Get the contract name.
     * @return the contract name
     */
    function getName() external pure returns (string memory) {
        return contractName;
    }

    /**
     * @notice Get total number of all propositions in existance.
     * @return number of propositions
     */
    function getNumberOfPropositions()
        external
        view
        override
        returns (uint256)
    {
        return totalPropositions;
    }

    /**
     * @notice Get list of active propositions's ids.
     * @return list of ids
     */
    function getActivePropositions()
        external
        view
        override
        returns (uint256[10] memory)
    {
        uint256[10] memory activeIds;
        uint256 activeCount = 0;

        for (uint256 p = 0; p < totalPropositions && activeCount < 10; p++) {
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
     * @notice Create new proposition for voting.
     * @dev Create new proposition struct and save it to list of propositions.
     * @param title proposition title
     * @param description proposition description
     * @param startBlock block on which proposition is active for voting
     * @param endBlock block on which proposition is no longer active
     * @return proposition id
     */
    function createProposition(
        string memory title,
        string memory description,
        uint256 startBlock,
        uint256 endBlock
    )
        external
        override
        activeMember
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
     * @notice Get basic info of proposition.
     * @dev These do not include votes related data.
     * @param propositionId id of proposition
     * @return id
     * @return title
     * @return description
     * @return proposedBy
     * @return startBlock
     * @return endBlock
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
     * @notice Get voting info of proposition.
     * @dev Voting info includes:
     *      total number of votes,
     *      number of support votes,
     *      number of against votes and
     *      number of reserved votes.
     * @param propositionId id of proposition
     * @return totalVotes
     * @return totalVotesAccept
     * @return totalVotesDeny
     * @return totalVotesReserved
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
     * @notice Get voting status of proposition.
     * @dev Voting status can be:
     *      pending if proposition is not available for voting,
     *      active if proposition is currently available for voting,
     *      succeeded if voters voted for support,
     *      failed if voters voted against.
     * @param propositionId id of proposition
     * @return proposition current status
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
        } else if (propositionsList[propositionId].endBlock >= block.number) {
            return PropositionStatus.ACTIVE;
        } else {
            // TODO calculate treshold
            return PropositionStatus.SUCCEEDED;
        }
    }

    /**
     * @notice Vote on proposition by giving proposition id and your vote.
     * @param propositionId id of proposition
     * @param votingOption accept, deny or reserved
     */
    function vote(uint256 propositionId, VotingOptions votingOption)
        external
        override
        validPropositionId(propositionId)
        propositionIsActive(propositionId)
        activeMember
        haventVoted(propositionId)
    {
        Proposition storage p = propositionsList[propositionId];

        if (votingOption == VotingOptions.ACCEPT) {
            p.votersAccept[msg.sender] = true;
            p.totalVotesAccept = SafeMath.add(p.totalVotesAccept, 1);
        } else if (votingOption == VotingOptions.DENY) {
            p.votersDeny[msg.sender] = true;
            p.totalVotesDeny = SafeMath.add(p.totalVotesDeny, 1);
        } else if (votingOption == VotingOptions.RESERVED) {
            p.votersReserved[msg.sender] = true;
            p.totalVotesReserved = SafeMath.add(p.totalVotesReserved, 1);
        } else {
            revert("Invalid voting option");
        }

        p.totalVotes = SafeMath.add(p.totalVotes, 1);
    }

    /**
     * @dev Validate that proposition id is in range of propositions list.
     * @param propositionId id of proposition
     */
    modifier validPropositionId(uint256 propositionId) {
        require(
            propositionId >= 0 && propositionId < totalPropositions,
            "Invalid proposition ID"
        );

        _;
    }

    /**
     * @dev Validate number of block on which proposition becomes active.
     * @param startBlock block number
     */
    modifier validStartBlock(uint256 startBlock) {
        require(
            startBlock >= block.number,
            "Block number can't be greater than the start block"
        );

        _;
    }

    /**
     * @dev Validate number of block on which proposition will no longer be active.
     * @param startBlock block number
     * @param endBlock block number
     */
    modifier validEndBlock(uint256 startBlock, uint256 endBlock) {
        require(
            startBlock < endBlock,
            "End block must be greater than start block"
        );
        require(
            endBlock > block.number,
            "Block number can't be greater than the end block"
        );

        _;
    }

    /**
     * @dev Verifiy that sender is an active dao member and holds the dao token.
     */
    modifier activeMember() {
        require(
            token.balanceOf(msg.sender) > 0,
            "You are not an active member"
        );

        _;
    }

    /**
     * @dev Verify that voter has not voted yet. Only one vote is possible.
     * @param propositionId id of proposition
     */
    modifier haventVoted(uint256 propositionId) {
        require(
            !(propositionsList[propositionId].votersAccept[msg.sender]),
            "You already voted"
        );
        require(
            !(propositionsList[propositionId].votersDeny[msg.sender]),
            "You already voted"
        );
        require(
            !(propositionsList[propositionId].votersReserved[msg.sender]),
            "You already voted"
        );

        _;
    }

    /**
     * @dev Check if proposition is active for voting.
     *      Proposition is active for voting if current block number is
     *      between proposition's start block and end block.
     * @param propositionId id of proposition
     */
    modifier propositionIsActive(uint256 propositionId) {
        require(
            propositionsList[propositionId].startBlock <= block.number &&
                propositionsList[propositionId].endBlock >= block.number,
            "Proposition is not active for voting"
        );

        _;
    }
}

/**
 * @dev ERC777 interface with methods only used in voting contract.
 */
interface DaoToken {
    function balanceOf(address holder) external view returns (uint256);
}
