// app/dashboard/utils/helpers.ts

interface DistrictData {
    district_name: string;
    Approved_Labour_Budget?: number;
    Average_Wage_rate_per_day_per_person?: number;
    Total_Households_Worked?: number;
    Total_Individuals_Worked?: number;
    [key: string]: any;
  }
  
  // Sort district data by a specific field (descending by default)
  export const sortDistricts = (
    data: DistrictData[],
    key: keyof DistrictData,
    ascending = false
  ): DistrictData[] => {
    if (!data || data.length === 0) return [];
    return [...data].sort((a, b) => {
      const aVal = Number(a[key]) || 0;
      const bVal = Number(b[key]) || 0;
      return ascending ? aVal - bVal : bVal - aVal;
    });
  };
  
  // Filter districts by minimum employment threshold
  export const filterByEmployment = (data: DistrictData[], minHouseholds = 0): DistrictData[] => {
    if (!data || data.length === 0) return [];
    return data.filter(
      (d) => (d.Total_Households_Worked || 0) >= minHouseholds
    );
  };
  
  // Aggregate totals for Assam overview cards
  export const aggregateTotals = (data: DistrictData[]) => {
    if (!data || data.length === 0) return {};
  
    const totals: Record<string, number> = {};
    const numericKeys = Object.keys(data[0]).filter((k) => typeof data[0][k] === "number");
  
    numericKeys.forEach((key) => {
      totals[key] = data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
    });
  
    return totals;
  };
  
  // Get top N districts by a specific metric
  export const getTopDistricts = (
    data: DistrictData[],
    key: keyof DistrictData,
    topN = 5
  ): DistrictData[] => {
    return sortDistricts(data, key).slice(0, topN);
  };
  
  // Find a district by name (case-insensitive)
  export const findDistrict = (data: DistrictData[], name: string): DistrictData | undefined => {
    if (!data) return undefined;
    return data.find(
      (d) => d.district_name?.toLowerCase() === name.toLowerCase()
    );
  };

  // Calculate overall performance score (0-10)
  export const calculatePerformanceScore = (data: DistrictData): number => {
    if (!data) return 0;

    const metrics = {
      // Employment coverage (0-3 points)
      employmentCoverage: Math.min((data.Total_Households_Worked || 0) / Math.max(data.Total_No_of_Active_Job_Cards || 1, 1) * 3, 3),
      
      // Average days per household (0-2 points)
      averageDays: Math.min((data.Average_days_of_employment_provided_per_Household || 0) / 50 * 2, 2),
      
      // Payment timeliness (0-2 points)
      paymentTimeliness: Math.min((data.percentage_payments_gererated_within_15_days || 0) / 50 * 2, 2),
      
      // Work completion rate (0-2 points)
      workCompletion: Math.min((data.Number_of_Completed_Works || 0) / Math.max(data.Total_No_of_Works_Takenup || 1, 1) * 2, 2),
      
      // Women participation (0-1 point)
      womenParticipation: Math.min((data.Women_Persondays || 0) / Math.max(data.Persondays_of_Central_Liability_so_far || 1, 1) * 1, 1)
    };

    const totalScore = Object.values(metrics).reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore * 10) / 10; // Round to 1 decimal place
  };
  