// app/dashboard/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DistrictSelector from './components/DistrictSelector';
import OverviewCards from './components/OverviewCards';
import TrendChart from './components/TrendChart';
import ComparisonChart from './components/ComparisionChart';
import DataTable from './components/DataTable';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import DFooter from '../components/DFooter';
import { useFetchData } from './hooks/useFetchData';
import { useGsapFadeIn } from './hooks/useGsapFadeIn';

interface DistrictData {
  fin_year: string;
  month: string;
  state_code: string;
  state_name: string;
  district_code: string;
  district_name: string;
  Total_Households_Worked: number;
  Total_No_of_Active_Job_Cards: number;
  Average_days_of_employment_provided_per_Household: number;
  Total_No_of_HHs_completed_100_Days_of_Wage_Employment: number;
  Total_Exp: number;
  Wages: number;
  Material_and_skilled_Wages: number;
  Total_Adm_Expenditure: number;
  Average_Wage_rate_per_day_per_person: number;
  Number_of_Completed_Works: number;
  Number_of_Ongoing_Works: number;
  Total_No_of_Works_Takenup: number;
  percentage_payments_gererated_within_15_days: number;
  Women_Persondays: number;
  SC_persondays: number;
  ST_persondays: number;
  Differently_abled_persons_worked: number;
  Total_Individuals_Worked: number;
  Total_No_of_Active_Workers: number;
  Total_No_of_Workers: number;
  SC_workers_against_active_workers: number;
  ST_workers_against_active_workers: number;
  Number_of_GPs_with_NIL_exp: number;
  Persondays_of_Central_Liability_so_far: number;
  Approved_Labour_Budget: number;
  percent_of_Category_B_Works: number;
  percent_of_Expenditure_on_Agriculture_Allied_Works: number;
  percent_of_NRM_Expenditure: number;
  Total_No_of_JobCards_issued: number;
  Remarks?: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Get district from URL params
  useEffect(() => {
    const districtCode = searchParams.get('district_code');
    const month = searchParams.get("month");
    const year = searchParams.get("year");
  
    if (districtCode) {
      setSelectedDistrict(districtCode);
    }
  
    // Derive current financial year dynamically
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const fyYear = currentDate.getMonth() >= 3 ? currentYear : currentYear - 1;
  
    // Set defaults safely
    setSelectedMonth(month || (currentDate.getMonth() + 1).toString()); // default: current month (1–12)
    setSelectedYear(year || fyYear.toString());
  }, [searchParams]);
  
  // Fetch district data using the hook
  const { data, loading, error } = useFetchData();
  
  
  // 🌈 GSAP animations
  const headerRef = useGsapFadeIn({ delay: 0.2 });
  const overviewRef = useGsapFadeIn({ delay: 0.4 });
  const chartsRef = useGsapFadeIn({ delay: 0.6 });
  const tableRef = useGsapFadeIn({ delay: 0.8 });
  
  const handleDistrictChange = (districtCode: string) => {
    setSelectedDistrict(districtCode);
    router.push(`/dashboard?district_code=${districtCode}&month=${selectedMonth}&year=${selectedYear}`);
  };
  
  const handleTimeRangeChange = (month: string, year: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  
    if (selectedDistrict) {
      router.push(`/dashboard?district_code=${selectedDistrict}&month=${month}&year=${year}`);
    }
  };
  
  // Extract current district data
  const currentData = data && data.length > 0 ? data[0] as DistrictData : null;
  
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div ref={headerRef} className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                मनरेगा असम डैशबोर्ड
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                MGNREGA Assam Dashboard
              </p>
            </div>

            {/* District Selector */}
            <div className="lg:w-96">
              <DistrictSelector
                selectedDistrict={selectedDistrict}
                onDistrictChange={handleDistrictChange}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onTimeRangeChange={handleTimeRangeChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* No District Selected */}
        {!selectedDistrict && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              जिला चुनें / Select a District
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Please select a district from the dropdown above to view MGNREGA performance data.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Data Display */}
        {!loading && !error && currentData && (
          <>
            {/* District Info Header */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border-2 border-gray-400">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {currentData.district_name}
                  </h2>
                  <p className="text-gray-600">
                    {currentData.state_name} • {currentData.month}/{currentData.fin_year}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Performance Period</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Cards */}
            <div ref={overviewRef}>
              <OverviewCards data={currentData} />
            </div>

            {/* Charts Section */}
            <div ref={chartsRef} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trend Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  रुझान / Performance Trends
                </h3>
                <TrendChart
                />
              </div>

              {/* Comparison Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  जिला तुलना / District Comparison
                </h3>
                <ComparisonChart
                  currentDistrict={selectedDistrict}
                  currentData={currentData}
                />
              </div>
            </div>

            {/* Data Table */}
            <div ref={tableRef} className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  विस्तृत डेटा / Detailed Data
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Complete MGNREGA metrics for transparency
                </p>
              </div>
              <DataTable data={currentData} />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <DFooter />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardContent />
    </Suspense>
  );
}