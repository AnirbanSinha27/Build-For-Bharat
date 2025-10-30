// app/dashboard/components/ComparisonChart.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import gsap from 'gsap';
import { useSearchParams } from 'next/navigation';
import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';
import { formatNumber } from '../utils/formatters';
import { calculatePerformanceScore } from '../utils/helpers';

interface ComparisonChartProps {
  currentDistrict: string;
  currentData: any;
}

interface DistrictComparisonData {
  district_code: string;
  district_name: string;
  Total_Households_Worked: number;
  Average_days_of_employment_provided_per_Household: number;
  percentage_payments_gererated_within_15_days: number;
  Number_of_Completed_Works: number;
  Total_Exp: number;
  Women_Persondays: number;
  Persondays_of_Central_Liability_so_far: number;
  performanceScore?: number;
}

interface ChartDataPoint {
  district: string;
  districtShort: string;
  households: number;
  avgDays: number;
  payment: number;
  works: number;
  score: number;
  isCurrentDistrict: boolean;
}

interface RadarDataPoint {
  metric: string;
  metricAssamese: string;
  current: number;
  stateAvg: number;
  topDistrict: number;
  fullMark: number;
}

export default function ComparisonChart({ currentDistrict, currentData }: ComparisonChartProps) {
  const [comparisonData, setComparisonData] = useState<ChartDataPoint[]>([]);
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [viewMode, setViewMode] = useState<'bar' | 'radar'>('bar');
  const chartRef = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [currentRank, setCurrentRank] = useState(0);

  // Fetch all districts for current month/year to compute real ranks
  const searchParams = useSearchParams();
  const [allDistrictsData, setAllDistrictsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    if (!month || !year) return;
    const url = `/api/fetch-data/all?month=${month}&year=${year}`;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setAllDistrictsData(Array.isArray(json) ? json : []);
      } catch (e: any) {
        setError(e.message || 'Failed to load comparison data');
        setAllDistrictsData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    if (allDistrictsData && allDistrictsData.length > 0 && currentData) {
      // Cast data to proper type
      const typedData = allDistrictsData as DistrictComparisonData[];
      
      // Calculate performance scores for all districts
      const districtsWithScores = typedData.map(district => ({
        ...district,
        performanceScore: calculatePerformanceScore(district),
      }));

      // Sort by performance score
      const allSorted = districtsWithScores.slice().sort((a, b) => b.performanceScore! - a.performanceScore!);
      // Rank fix: true rank in whole Assam
      const newCurrentDistrictRank = allSorted.findIndex(d => d.district_code === currentDistrict) + 1;
      setCurrentRank(newCurrentDistrictRank);

      // Get top 4 districts
      const topNDistricts = allSorted.slice(0, 4);
      // Always include selected district
      let finalDistricts = topNDistricts;
      const selectedDistrictEntry = districtsWithScores.find(d => d.district_code === currentDistrict);
      if (selectedDistrictEntry && !finalDistricts.some(d => d.district_code === currentDistrict)) {
        finalDistricts = [...topNDistricts, selectedDistrictEntry];
      }

      // Transform for bar chart
      const chartData: ChartDataPoint[] = finalDistricts.map(district => ({
        district: district.district_name,
        districtShort: district.district_name.length > 12 
          ? district.district_name.substring(0, 12) + '...' 
          : district.district_name,
        households: district.Total_Households_Worked,
        avgDays: district.Average_days_of_employment_provided_per_Household,
        payment: Number(district.percentage_payments_gererated_within_15_days) || 0,
        works: district.Number_of_Completed_Works,
        score: district.performanceScore || 0,
        isCurrentDistrict: district.district_code === currentDistrict,
      }));

      setComparisonData(chartData);

      // Prepare radar chart data
      const stateAvgHouseholds = typedData.reduce((sum, d) => sum + d.Total_Households_Worked, 0) / typedData.length;
      const stateAvgDays = typedData.reduce((sum, d) => sum + d.Average_days_of_employment_provided_per_Household, 0) / typedData.length;
      const stateAvgPayment = typedData.reduce((sum, d) => sum + (Number(d.percentage_payments_gererated_within_15_days) || 0), 0) / typedData.length;
      const stateAvgWorks = typedData.reduce((sum, d) => sum + d.Number_of_Completed_Works, 0) / typedData.length;

      const topDistrict = allSorted[0];
      const womenPercentCurrent = (currentData.Women_Persondays / currentData.Persondays_of_Central_Liability_so_far) * 100;
      const topWomenPercent = (topDistrict.Women_Persondays / topDistrict.Persondays_of_Central_Liability_so_far) * 100;
      const stateAvgWomen = typedData.reduce((sum, d) => {
        const percent = (d.Women_Persondays / d.Persondays_of_Central_Liability_so_far) * 100;
        return sum + percent;
      }, 0) / typedData.length;

      const maxHouseholds = Math.max(...typedData.map(d => d.Total_Households_Worked));
      const maxWorks = Math.max(...typedData.map(d => d.Number_of_Completed_Works));

      const radar: RadarDataPoint[] = [
        {
          metric: 'Households',
          metricAssamese: 'परिवार', // Hindi for households
          current: (currentData.Total_Households_Worked / maxHouseholds) * 100,
          stateAvg: (stateAvgHouseholds / maxHouseholds) * 100,
          topDistrict: 100,
          fullMark: 100,
        },
        {
          metric: 'Avg Days',
          metricAssamese: 'औसत कार्य दिवस',
          current: currentData.Average_days_of_employment_provided_per_Household,
          stateAvg: stateAvgDays,
          topDistrict: topDistrict.Average_days_of_employment_provided_per_Household,
          fullMark: 100,
        },
        {
          metric: 'Payment %',
          metricAssamese: 'भुगतान %',
          current: Number(currentData.percentage_payments_gererated_within_15_days) || 0,
          stateAvg: stateAvgPayment,
          topDistrict: Number(topDistrict.percentage_payments_gererated_within_15_days) || 0,
          fullMark: 100,
        },
        {
          metric: 'Works',
          metricAssamese: 'पूर्ण कार्य',
          current: (currentData.Number_of_Completed_Works / maxWorks) * 100,
          stateAvg: (stateAvgWorks / maxWorks) * 100,
          topDistrict: 100,
          fullMark: 100,
        },
        {
          metric: 'Women %',
          metricAssamese: 'महिला %',
          current: womenPercentCurrent,
          stateAvg: stateAvgWomen,
          topDistrict: topWomenPercent,
          fullMark: 100,
        },
      ];

      setRadarData(radar);
    }
  }, [allDistrictsData, currentData, currentDistrict]);

  // GSAP animation
  useEffect(() => {
    if (chartRef.current && comparisonData.length > 0 && !animationComplete) {
      gsap.fromTo(
        chartRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => setAnimationComplete(true),
        }
      );
    }
  }, [comparisonData, animationComplete]);

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">
            {data.district}
            {data.isCurrentDistrict && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
            )}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Score:</span> {data.score.toFixed(1)}/10
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Households:</span> {formatNumber(data.households)}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Avg Days:</span> {data.avgDays}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Payment:</span> {data.payment.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Works:</span> {formatNumber(data.works)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for radar chart
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border-2 border-gray-200">
          <p className="font-semibold text-gray-900 text-sm mb-2">
            {payload[0].payload.metric}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Your District:</span> {Number(payload[0].value || 0).toFixed(1)}
            </p>
            <p className="text-xs text-green-700">
              <span className="font-medium">State Avg:</span> {Number(payload[1]?.value || 0).toFixed(1)}
            </p>
            <p className="text-xs text-purple-700">
              <span className="font-medium">Top District:</span> {Number(payload[2]?.value || 0).toFixed(1)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!comparisonData || comparisonData.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm">No comparison data available</p>
      </div>
    );
  }

  const currentDistrictScore = comparisonData.find(d => d.isCurrentDistrict)?.score || 0;

  return (
    <div ref={chartRef} className="space-y-4">
      {/* View Toggle */}
      <div className="flex flex-col gap-1 md:flex-row items-center justify-between">
        <div className="text-sm text-gray-600">
          {currentRank > 0 && (
            <span>
              Your Rank: <span className="font-bold text-blue-600">#{currentRank}</span> in Assam
            </span>
          )}
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('bar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'bar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Bar Chart
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'radar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🎯 Radar
          </button>
        </div>
      </div>

      {/* Bar Chart View */}
      {viewMode === 'bar' && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 10, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="districtShort"
                label={{ value: 'District/जिला', position: 'insideBottom', offset: 0, style: { fontSize: 13, fill: '#444', fontWeight: 600 } }}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#d1d5db' }}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={{ stroke: '#d1d5db' }}
                label={{ value: 'स्कोर (Score, 0-10)', angle: -90, position: 'insideLeft', style: { fontSize: 13, fill: '#6b7280', fontWeight: 600 } }}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey="score"
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {comparisonData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCurrentDistrict ? '#3b82f6' : '#94a3b8'}
                    opacity={entry.isCurrentDistrict ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Radar Chart View */}
      {viewMode === 'radar' && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#d1d5db" />
              <PolarAngleAxis
                dataKey="metricAssamese"
                tick={{ fill: '#6b7280', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 10 }}
              />
              <Radar
                name="Your District"
                dataKey="current"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
                strokeWidth={2}
                animationDuration={1500}
              />
              <Radar
                name="State Average"
                dataKey="stateAvg"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={1500}
              />
              <Radar
                name="Top District"
                dataKey="topDistrict"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
                strokeWidth={2}
                animationDuration={1500}
              />
              <Tooltip content={<CustomRadarTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Best Performing District */}
        <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏆</span>
            <h4 className="text-sm font-semibold text-yellow-900">Top Performer</h4>
          </div>
          <p className="text-lg font-bold text-yellow-900">{comparisonData[0]?.district}</p>
          <p className="text-sm text-yellow-700">Score: {comparisonData[0]?.score.toFixed(1)}/10</p>
        </div>
        
      </div>

      {/* Key Learnings */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-green-900 mb-1">
              शीर्ष प्रदर्शनकर्ताओं से सीखें
            </h4>
            <p className="text-sm text-green-800">
              {(() => {
                const topDistrict = comparisonData[0];
                const gap = topDistrict.score - currentDistrictScore;
                
                if (currentRank === 1) {
                  return "Excellent! You're the top performer in Assam. Keep up the great work!";
                } else if (gap < 1) {
                  return `You're very close to the top! Just ${gap.toFixed(1)} points away from #1.`;
                } else if (gap < 2) {
                  return `Good progress! Focus on improving payment timeliness and work completion to reach the top.`;
                } else {
                  return `${topDistrict.district} leads with strong household coverage and timely payments. Consider their best practices.`;
                }
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}