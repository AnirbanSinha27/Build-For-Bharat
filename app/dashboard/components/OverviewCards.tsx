// app/dashboard/components/OverviewCards.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

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

interface OverviewCardsProps {
  data: DistrictData;
}

const InfoTooltip = ({ content }: { content: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-white/60 hover:text-white transition-colors"
        type="button"
      >
        <Info className="w-4 h-4" />
      </button>
      {isVisible && (
        <div className="absolute z-9999 w-64 p-3 text-sm text-white bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl left-1/2 -translate-x-1/2 bottom-full mb-2 border border-white/10 ml-20">
          {content}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/95 rotate-45 border-r border-b border-white/10"></div>
        </div>
      )}
    </div>
  );
};

const formatNumber = (num: number): string => {
  if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
  return num.toLocaleString('en-IN');
};

const formatCurrency = (num: number): string => {
  return `₹${formatNumber(num)}`;
};

const calculatePerformanceScore = (data: DistrictData): number => {
  const householdCoverage = data.Total_No_of_Active_Job_Cards > 0
    ? (data.Total_Households_Worked / data.Total_No_of_Active_Job_Cards) * 100
    : 0;
  const daysProvided = data.Average_days_of_employment_provided_per_Household || 0;
  const paymentTimeliness = Number(data.percentage_payments_gererated_within_15_days) || 0;
  const workCompletion = data.Total_No_of_Works_Takenup > 0
    ? (data.Number_of_Completed_Works / data.Total_No_of_Works_Takenup) * 100
    : 0;

  const score = (
    (householdCoverage / 100) * 2.5 +
    (daysProvided / 100) * 3 +
    (paymentTimeliness / 100) * 2.5 +
    (workCompletion / 100) * 2
  );

  return Math.min(score, 10);
};

const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}
      {typeof value === 'number' && !suffix.includes('%') 
        ? formatNumber(Math.floor(displayValue))
        : Math.floor(displayValue)
      }
      {suffix}
    </span>
  );
};

export default function OverviewCards({ data }: OverviewCardsProps) {
  const performanceScore = calculatePerformanceScore(data);
  
  const householdCoverage = data.Total_No_of_Active_Job_Cards > 0
    ? (data.Total_Households_Worked / data.Total_No_of_Active_Job_Cards) * 100
    : 0;
  const averageDays = data.Average_days_of_employment_provided_per_Household || 0;
  const paymentTimeliness = Number(data.percentage_payments_gererated_within_15_days) || 0;
  const workCompletionRate = data.Total_No_of_Works_Takenup > 0
    ? (data.Number_of_Completed_Works / data.Total_No_of_Works_Takenup) * 100
    : 0;
  const womenParticipation = data.Total_Individuals_Worked > 0
    ? (data.Women_Persondays / data.Persondays_of_Central_Liability_so_far) * 100
    : 0;

  const getStatusColor = (percent: number) => {
    if (percent >= 80) return 'from-emerald-500 to-teal-500';
    if (percent >= 60) return 'from-blue-500 to-cyan-500';
    if (percent >= 40) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Hero Performance Section - Full Width */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 p-1">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
        <div className="relative bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full mb-4 border border-white/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">Live Performance Metrics</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                <AnimatedNumber value={performanceScore} suffix="/10" />
              </h1>
              <p className="text-xl text-white/80 mb-2">प्रदर्शन स्कोर</p>
              <p className="text-white/60 text-sm max-w-md">
                Comprehensive MGNREGA performance evaluation based on employment, payments, and work completion metrics
              </p>
            </div>
            
            <div className="flex gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-24 rounded-full transition-all duration-1000 delay-${i * 100} ${
                    i < Math.floor(performanceScore)
                      ? 'bg-linear-to-t from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/50'
                      : 'bg-white/10'
                  }`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: `${60 + (i < Math.floor(performanceScore) ? (performanceScore - i) * 10 : 0)}px`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-fr">
        {/* Large Feature - Households */}
        <div className="md:col-span-4 md:row-span-2 group relative  rounded-3xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 p-1 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
          <div className="relative h-full bg-linear-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">Households Worked</h3>
                    <InfoTooltip content="Number of households that received employment under MGNREGA during this period" />
                  </div>
                  <p className="text-white/60">काम करने वाले परिवार</p>
                </div>
                <div className="p-4 bg-blue-500/20 rounded-2xl backdrop-blur-xl border border-blue-500/30">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-6xl font-bold text-white mb-4">
                  <AnimatedNumber value={data.Total_Households_Worked} />
                </div>
                <p className="text-white/60 text-lg">
                  Out of <span className="text-white font-semibold">{formatNumber(data.Total_No_of_Active_Job_Cards)}</span> active job cards
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm text-white/80 mb-2">
                  <span>Coverage</span>
                  <span className="font-bold text-white">{householdCoverage.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full  backdrop-blur-xl">
                  <div
                    className={`h-full bg-linear-to-r ${getStatusColor(householdCoverage)} rounded-full transition-all duration-1000 shadow-lg shadow-blue-500/50`}
                    style={{ width: `${householdCoverage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Days */}
        <div className="md:col-span-2 group relative rounded-3xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 p-1 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
          <div className="relative h-full bg-linear-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <InfoTooltip content="Average employment days provided per household. Target: 100 days/year" />
                <div className="p-3 bg-emerald-500/20 rounded-xl backdrop-blur-xl border border-emerald-500/30">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div className="text-4xl font-bold text-white mb-2">
                <AnimatedNumber value={averageDays} />
              </div>
              <p className="text-white/60 text-sm mb-4">Avg Days/Household</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                <span className="text-xs text-emerald-400 font-semibold">
                  {formatNumber(data.Total_No_of_HHs_completed_100_Days_of_Wage_Employment)} completed 100 days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Timelines */}
        <div className="md:col-span-2 group relative rounded-3xl bg-linear-to-br from-purple-500/10 to-pink-500/10 p-1 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
          <div className="relative h-full bg-linear-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <InfoTooltip content="Percentage of payments made within 15 days as per MGNREGA norms" />
                <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-xl border border-purple-500/30">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="text-4xl font-bold text-white mb-2">
                <AnimatedNumber value={paymentTimeliness} suffix="%" />
              </div>
              <p className="text-white/60 text-sm">Timely Payments</p>
            </div>
          </div>
        </div>

        {/* Works Completion */}
        <div className="md:col-span-2 group relative rounded-3xl bg-linear-to-br from-amber-500/10 to-orange-500/10 p-1 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500">
          <div className="relative h-full bg-linear-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <InfoTooltip content="Infrastructure works completed vs ongoing" />
                <div className="p-3 bg-amber-500/20 rounded-xl backdrop-blur-xl border border-amber-500/30">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-baseline gap-3 mb-2">
                <div className="text-4xl font-bold text-white">
                  <AnimatedNumber value={data.Number_of_Completed_Works} />
                </div>
                <div className="text-white/60">/ {data.Total_No_of_Works_Takenup}</div>
              </div>
              <p className="text-white/60 text-sm mb-3">Works Completed</p>
              
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-amber-400 font-semibold">{data.Number_of_Ongoing_Works} ongoing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="md:col-span-2 group relative  rounded-3xl bg-linear-to-br from-rose-500/10 to-red-500/10 p-1 hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-500">
          <div className="relative h-full bg-linear-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/30 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <InfoTooltip content="Total MGNREGA expenditure including wages and materials" />
                <div className="p-3 bg-rose-500/20 rounded-xl backdrop-blur-xl border border-rose-500/30">
                  <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="text-3xl font-bold text-white mb-2">
                {formatCurrency(data.Total_Exp)}
              </div>
              <p className="text-white/60 text-sm mb-3">Total Expenditure</p>
              
              <div className="text-xs text-white/60">
                Wages: <span className="text-white font-semibold">{formatCurrency(data.Wages)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Women Participation */}
        <div className="md:col-span-2 group relative rounded-3xl bg-linear-to-br from-fuchsia-500/10 to-pink-500/10 p-1 hover:shadow-2xl hover:shadow-fuchsia-500/20 transition-all duration-500">
          <div className="relative h-full bg-linear-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl group-hover:bg-fuchsia-500/30 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <InfoTooltip content="Women participation in MGNREGA. Target: minimum 33%" />
                <div className="p-3 bg-fuchsia-500/20 rounded-xl backdrop-blur-xl border border-fuchsia-500/30">
                  <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="text-4xl font-bold text-white mb-2">
                <AnimatedNumber value={womenParticipation} suffix="%" />
              </div>
              <p className="text-white/60 text-sm mb-3">Women Participation</p>
              
              <div className="text-xs text-white/60">
                {formatNumber(data.Women_Persondays)} person-days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demographics Bar - Full Width */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-500/10 via-gray-500/10 to-zinc-500/10 p-1">
        <div className="relative bg-linear-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">
            जनसांख्यिकीय भागीदारी <span className="text-white/60">/ Demographic Participation</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-500/20 rounded-xl backdrop-blur-xl border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">SC Workers</div>
                  <div className="text-3xl font-bold text-white">
                    <AnimatedNumber value={data.SC_persondays} />
                  </div>
                  <div className="text-xs text-white/40 mt-1">person-days</div>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-500/20 rounded-xl backdrop-blur-xl border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">ST Workers</div>
                  <div className="text-3xl font-bold text-white">
                    <AnimatedNumber value={data.ST_persondays} />
                  </div>
                  <div className="text-xs text-white/40 mt-1">person-days</div>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-500/20 rounded-xl backdrop-blur-xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Differently Abled</div>
                  <div className="text-3xl font-bold text-white">
                    <AnimatedNumber value={data.Differently_abled_persons_worked} />
                  </div>
                  <div className="text-xs text-white/40 mt-1">workers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
