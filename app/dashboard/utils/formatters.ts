// app/dashboard/utils/formatters.ts

// Format large numbers like 1200000 → "12 Lakh"
export const formatIndianNumber = (num: number | string): string => {
    if (!num && num !== 0) return "N/A";
    const n = Number(num);
    if (isNaN(n)) return "N/A";
  
    if (n >= 1_00_00_000) return (n / 1_00_00_000).toFixed(2) + " Cr";
    if (n >= 1_00_000) return (n / 1_00_000).toFixed(2) + " Lakh";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + " K";
    return n.toString();
  };
  
  // Format as currency in Indian Rupees
  export const formatCurrency = (num: number | string): string => {
    if (!num && num !== 0) return "N/A";
    const n = Number(num);
    if (isNaN(n)) return "N/A";
  
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(n);
  };
  
  // Format percentage safely
  export const formatPercentage = (num: number | string, decimals = 1): string => {
    if (!num && num !== 0) return "N/A";
    const n = Number(num);
    if (isNaN(n)) return "N/A";
  
    return n.toFixed(decimals) + "%";
  };
  
  // Shorten text like long district names for cards
  export const truncateText = (text: string, maxLength = 25): string => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };

  // Format number with Indian locale
  export const formatNumber = (num: number | string): string => {
    if (!num && num !== 0) return "N/A";
    const n = Number(num);
    if (isNaN(n)) return "N/A";
    
    return new Intl.NumberFormat("en-IN").format(n);
  };
  