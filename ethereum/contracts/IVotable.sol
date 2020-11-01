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

    function getPropositionStatus(uint256 propositionId)
        external
        view
        returns (PropositionStatus);

    function vote(uint256 propositionId, VotingOptions votingOption) external;
}
