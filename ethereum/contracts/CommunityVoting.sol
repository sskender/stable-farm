// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import './SafeMath.sol';
import './IVotable.sol';

contract CommunityVoting is IVotable {
    /**
     * @dev Definition of one proposition.
     */
    struct Proposition {
        uint256 id;
        string title;
        string description;
        address proposedBy;
        uint256 totalVotes;
        uint256 totalVotesAccept;
        uint256 totalVotesDeny;
        uint256 totalVotesReserved;
        mapping(address => bool) votersAccept;
        mapping(address => bool) votersDeny;
        mapping(address => bool) votersReserved;
        uint256 startBlock;
        uint256 endBlock;
    }

    // Name of the contract
    string
        internal constant contractName = 'EESTEC LC Zagreb Basic Voting Contract';

    // Total propositions
    uint256 internal totalPropositions;

    // List of propositions
    mapping(uint256 => Proposition) internal propositionsList;

    // Token interface
    IDaoToken internal token;

    /**
     * @dev Minimum difference between voting start and end block.
     * @return minimum block difference
     */
    function getMinimumVotingBlockDifference() internal pure returns (uint256) {
        return 10;
    }

    /**
     * @dev Initialize contract on deployment.
     */
    constructor(address tokenContract) {
        totalPropositions = 0;
        token = IDaoToken(tokenContract);
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
    function getNumberOfPropositions() external view returns (uint256) {
        return totalPropositions;
    }

    /**
     * @notice Create new proposition for voting.
     * @dev Create new proposition struct and save it to list of propositions.
     * @param title proposition title
     * @param description proposition description
     * @param startBlock block on which proposition is active for voting
     * @param endBlock block on which proposition is no longer active
     */
    function createProposition(
        string memory title,
        string memory description,
        uint256 startBlock,
        uint256 endBlock
    )
        external
        activeMember
        validStartBlock(startBlock)
        validEndBlock(startBlock, endBlock)
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
     * - total number of votes,
     * - number of support votes,
     * - number of against votes and
     * - number of reserved votes.
     * @param propositionId id of proposition
     * @return totalVotes
     * @return totalVotesAccept
     * @return totalVotesDeny
     * @return totalVotesReserved
     */
    function getPropositionVotes(uint256 propositionId)
        external
        view
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
     * - pending if proposition is not available for voting,
     * - active if proposition is currently available for voting,
     * - succeeded if voters voted for support,
     * - failed if voters voted against.
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
            // voting pending
            return PropositionStatus.PENDING;
        } else if (propositionsList[propositionId].endBlock >= block.number) {
            // voting in progress
            return PropositionStatus.ACTIVE;
        } else {
            // voting finished - calculate votes
            uint256 totalMembers = token.totalSupply();
            uint256 votersTreshold = SafeMath.div(totalMembers, 2);

            // voters quorum
            if (propositionsList[propositionId].totalVotes > votersTreshold) {
                uint256 totalVotes = propositionsList[propositionId].totalVotes;
                uint256 votesTreshold = SafeMath.div(totalVotes, 2);

                // votes for accept quorum
                if (
                    propositionsList[propositionId].totalVotesAccept >
                    votesTreshold
                ) {
                    return PropositionStatus.SUCCEEDED;
                }
            }
        }
        return PropositionStatus.FAILED;
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
            revert('Invalid voting option');
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
            'Invalid proposition Id'
        );

        _;
    }

    /**
     * @dev Validate number of block on which proposition becomes active.
     * @param startBlock block number
     */
    modifier validStartBlock(uint256 startBlock) {
        require(startBlock >= block.number, 'Invalid start block number');

        _;
    }

    /**
     * @dev Validate number of block on which proposition will no longer be active.
     * @param startBlock block number
     * @param endBlock block number
     */
    modifier validEndBlock(uint256 startBlock, uint256 endBlock) {
        require(
            SafeMath.add(startBlock, getMinimumVotingBlockDifference()) <=
                endBlock,
            'Invalid end block number'
        );

        _;
    }

    /**
     * @dev Verifiy that sender is an active dao member and holds the dao token.
     */
    modifier activeMember() {
        require(
            token.balanceOf(msg.sender) > 0,
            'You are not an active member'
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
            'You already voted'
        );
        require(
            !(propositionsList[propositionId].votersDeny[msg.sender]),
            'You already voted'
        );
        require(
            !(propositionsList[propositionId].votersReserved[msg.sender]),
            'You already voted'
        );

        _;
    }

    /**
     * @dev Check if proposition is active for voting.
     * Proposition is active for voting if current block number is
     * between proposition's start block and end block.
     * @param propositionId id of proposition
     */
    modifier propositionIsActive(uint256 propositionId) {
        require(
            propositionsList[propositionId].startBlock <= block.number &&
                propositionsList[propositionId].endBlock >= block.number,
            'Proposition is not active for voting'
        );

        _;
    }
}

/**
 * @dev ERC777 interface with methods only used in voting contract.
 */
interface IDaoToken {
    function balanceOf(address holder) external view returns (uint256);

    function totalSupply() external view returns (uint256);
}
