export const formatCO2 = (kg) => {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t`;
  return `${Math.round(kg)} kg`;
};

export const formatMoney = (rupees) => {
  return `₹${Math.round(rupees).toLocaleString('en-IN')}`;
};

export const formatPercent = (value) => {
  return `${Math.round(value)}%`;
};
