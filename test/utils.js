module.exports = {
  estimateTotalEarnings: (depositedAmount) => {
    let totalEarning = depositedAmount;
    let totalBorrow = 0;
    let collateral = depositedAmount;

    while (collateral > 25) {
      collateral = collateral * 0.75;
      totalEarning += collateral;
      totalBorrow += collateral;
    }
    totalEarning += collateral;

    return { earning: totalEarning, borrow: totalBorrow };
  },
};
