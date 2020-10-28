// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface IVotable {
    /**
     * @dev Possible states of one proposition.
     */
    enum PropositionStatus {PENDING, ACTIVE, SUCCEEDED, FAILED}

    /**
     * @dev Options that represent valid vote.
     */
    enum VotingOptions {ACCEPT, DENY, RESERVED}

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

    function getNumberOfPropositions() external view returns (uint256);

    function getActivePropositions() external view returns (uint256[10] memory);

    function createProposition(
        string memory title,
        string memory description,
        uint256 startBlock,
        uint256 endBlock
    ) external returns (uint256);

    function getPropositionInfo(uint256 propositionId)
        external
        view
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address proposedBy,
            uint256 startBlock,
            uint256 endBlock
        );

    function getPropositionVotes(uint256 propositionId)
        external
        view
        returns (
            uint256 totalVotes,
            uint256 totalVotesAccept,
            uint256 totalVotesDeny,
            uint256 totalVotesReserved
        );

    function getPropositionStatus(uint256 propositionId)
        external
        view
        returns (PropositionStatus);

    function vote(uint256 propositionId, VotingOptions votingOption) external;
}
