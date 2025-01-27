/**
 * Calculate required deposit for data being stored. (~0.00001N per byte) with a bit extra for buffer
 * @param {Object} data
 * @returns {string} The parsed NEAR amount
 */
const calculateDepositByDataSize = (data) => {
    const dataSize = JSON.stringify(data).length;
    const deposit = (dataSize * 0.00001).toFixed(5);
    return deposit.toString();
};

module.exports = calculateDepositByDataSize;
