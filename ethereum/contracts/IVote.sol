// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface IVote {
    /**
     * @dev Possible states of one proposition.
     */
    enum PropositionStatus {QUEUED, ACTIVE, SUCCEEDED, FAILED}

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
        mapping(address => bool) votersAccept;
        mapping(address => bool) votersDeny;
        mapping(address => bool) votersReserved;
        PropositionStatus status;
    }

    function getNumberOfPropositions() external view returns (uint256);

    function getActivePropositions() external view returns (uint256[] memory);

    function createProposition(string memory title, string memory description)
        external
        returns (uint256);

    function getPropositionInfo(uint256 propositionId)
        external
        view
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address proposedBy,
            uint256 totalVotes,
            PropositionStatus status
        );

    function getPropositionAcceptList(uint256 propositionId)
        external
        view
        returns (address[] memory);

    function getPropositionDenyList(uint256 propositionId)
        external
        view
        returns (address[] memory);

    function getPropositionReservedList(uint256 propositionId)
        external
        view
        returns (address[] memory);

    function vote(uint256 propositionId, VotingOptions votingOption) external;
}
