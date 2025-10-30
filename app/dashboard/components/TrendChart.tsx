import { useEffect, useMemo, useState } from 'react';
import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';
import { useSearchParams } from 'next/navigation';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type MetricKey = 'households' | 'avgDays' | 'paymentPercent' | 'worksCompleted' | 'womenPercent';

type ChartDataPoint = {
  period: string;
  households: number;
  avgDays: number;
  paymentPercent: number;
  worksCompleted: number;
  womenPercent: number;
};

type Metric = {
  key: MetricKey;
  label: string;
  shortLabel: string;
  color: string;
  unit: string;
  description: string;
  icon: string;
};

// Helper to make period label like "Sep 24"
const getMonthName = (m: string | number): string => {
  const monthIndex = Math.max(0, Math.min(11, Number(m) - 1));
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][monthIndex] || '';
};

const METRICS: Metric[] = [
  { 
    key: 'households', 
    label: 'Households Employed',
    shortLabel: 'Households',
    color: '#3b82f6',
    unit: '',
    description: 'Total families who got work',
    icon: '👨‍👩‍👧‍👦'
  },
  { 
    key: 'avgDays', 
    label: 'Average Work Days',
    shortLabel: 'Work Days',
    color: '#10b981',
    unit: ' days',
    description: 'Average days worked per household',
    icon: '📅'
  },
  { 
    key: 'paymentPercent', 
    label: 'Timely Payment Rate',
    shortLabel: 'Payment %',
    color: '#8b5cf6',
    unit: '%',
    description: 'Payments made within 15 days',
    icon: '💰'
  },
  { 
    key: 'worksCompleted', 
    label: 'Completed Projects',
    shortLabel: 'Projects',
    color: '#14b8a6',
    unit: '',
    description: 'Number of works finished',
    icon: '🏗️'
  },
  { 
    key: 'womenPercent', 
    label: 'Women Participation',
    shortLabel: 'Women %',
    color: '#ec4899',
    unit: '%',
    description: 'Percentage of women workers',
    icon: '👩'
  },
];

export default function TrendChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('households');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedRows, setFetchedRows] = useState<any[]>([]);

  const toNum = (v: unknown, fallback = 0): number => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  // Build last 6 (month, year) pairs based on URL params (district_code, month, year in FY base)
  useEffect(() => {
    const district = searchParams.get('district_code');
    const monthStr = searchParams.get('month');
    const fyBaseStr = searchParams.get('year'); // FY base (e.g., 2024 means FY 2024-25)

    if (!district || !monthStr || !fyBaseStr) {
      setFetchedRows([]);
      return;
    }

    const startMonth = Number(monthStr); // 1-12 calendar month
    const fyBase = Number(fyBaseStr);
    // Infer calendar year from FY base and month
    let calYear = startMonth >= 4 ? fyBase : fyBase + 1;

    const pairs: { month: number; calYear: number; fyYear: number }[] = [];
    let m = startMonth;
    let y = calYear;
    for (let i = 0; i < 6; i++) {
      const fyYear = m >= 4 ? y : y - 1;
      pairs.push({ month: m, calYear: y, fyYear });
      m -= 1;
      if (m < 1) {
        m = 12;
        y -= 1;
      }
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await Promise.all(
          pairs.map(async ({ month, fyYear }) => {
            const url = `/api/fetch-data?district_code=${district}&month=${month}&year=${fyYear}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const row = Array.isArray(json) && json.length > 0 ? json[0] : null;
            return row ? { ...row, __month: month, __fyYear: fyYear } : null;
          })
        );
        const filtered = results.filter(Boolean) as any[];
        setFetchedRows(filtered.reverse()); // oldest to newest
      } catch (e: any) {
        setError(e.message || 'Failed to load trend data');
        setFetchedRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [searchParams]);

  // Transform fetched rows into chart points
  const chartData: ChartDataPoint[] = useMemo(() => {
    return fetchedRows.map((item: any) => {
      // Always use our internally tracked month/year to avoid parsing API variability
      const monthVal = toNum(item?.__month);
      const fyBase = toNum(item?.__fyYear);
      const calYear = monthVal >= 4 ? fyBase : fyBase + 1;
      const periodYear = String(calYear).slice(-2);

      const totalPersonDays = toNum(item?.Persondays_of_Central_Liability_so_far, 1);
      const womenPercent = (toNum(item?.Women_Persondays) / totalPersonDays) * 100;

      return {
        period: `${getMonthName(monthVal)} ${periodYear}`,
        households: toNum(item?.Total_Households_Worked),
        avgDays: toNum(item?.Average_days_of_employment_provided_per_Household),
        paymentPercent: toNum(item?.percentage_payments_gererated_within_15_days),
        worksCompleted: toNum(item?.Number_of_Completed_Works),
        womenPercent,
      } as ChartDataPoint;
    });
  }, [fetchedRows]);

  const currentMetric = METRICS.find(m => m.key === selectedMetric) || METRICS[0];

  const formatValue = (value: unknown, metricKey: MetricKey) => {
    const n = toNum(value);
    if (metricKey === 'households' || metricKey === 'worksCompleted') {
      return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : Math.round(n);
    }
    return n.toFixed(1);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (!active || !payload?.[0]) return null;
    
      const data = payload[0].payload;
    const value = toNum(data[selectedMetric]);
    const formattedValue = selectedMetric === 'households' || selectedMetric === 'worksCompleted'
      ? Math.round(value).toLocaleString()
      : value.toFixed(1);

      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-gray-200">
        <p className="font-bold text-gray-900 mb-2">{data.period}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentMetric.color }}></div>
          <div>
            <p className="text-xs text-gray-600">{currentMetric.label}</p>
            <p className="text-lg font-bold" style={{ color: currentMetric.color }}>
              {formattedValue}{currentMetric.unit}
            </p>
          </div>
          </div>
        </div>
      );
  };

  const calculateStats = () => {
    const rawValues = chartData.map((d) => toNum((d as any)[selectedMetric], NaN));
    const values = rawValues.filter((v) => Number.isFinite(v));
    if (values.length < 2) {
      return { max: 0, min: 0, avg: 0, change: 0, first: 0, last: 0 };
    }
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const first = values[0];
    const last = values[values.length - 1];
    const change = first === 0 ? 0 : ((last - first) / first) * 100;

    return { max, min, avg, change, first, last };
  };

  const stats = calculateStats();

    return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm">
      {loading && <LoadingState />}
      {error && (
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      )}
      {!loading && !error && chartData.length === 0 && (
        <div className="text-center text-gray-500">No trend data available.</div>
      )}
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Performance Trends
        </h2>
        <p className="text-sm text-gray-600">
          Track key metrics over the last 6 months • प्रदर्शन रुझान
        </p>
      </div>

      {/* Metric Selector - Card Style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {METRICS.map((metric) => {
          const isSelected = selectedMetric === metric.key;
  return (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
              className={`p-4 rounded-xl text-left transition-all duration-200 ${
                isSelected
                  ? 'shadow-lg transform scale-105'
                  : 'bg-gray-50 hover:bg-gray-100 shadow-sm'
            }`}
            style={{
                backgroundColor: isSelected ? `${metric.color}15` : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{metric.icon}</span>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }}></div>
                )}
              </div>
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {metric.shortLabel}
            </div>
          </button>
          );
        })}
      </div>

      {/* Current Selection Banner */}
      <div className="bg-linear-to-r from-gray-50 to-white p-4 rounded-lg border-l-4" style={{ borderColor: currentMetric.color }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentMetric.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{currentMetric.label}</h3>
              <p className="text-sm text-gray-600">{currentMetric.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 p-6 rounded-xl">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="period"
                tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
              tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis
                tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
              tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickFormatter={(value) => String(formatValue(value, selectedMetric))}
                label={{ 
                  value: `${currentMetric.label}${currentMetric.unit}`, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12, fill: '#6b7280', fontWeight: 600 }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              strokeWidth={3}
              fill={`url(#gradient-${selectedMetric})`}
                animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
          </div>
        </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-3 gap-4">
      <div className="bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="text-xs text-green-700 font-semibold mb-1">HIGHEST</div>
          <div className="text-2xl font-bold text-green-900">
            {formatValue(stats.max, selectedMetric)}{currentMetric.unit}
          </div>
          <div className="text-xs text-green-600 mt-1">Peak performance</div>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-700 font-semibold mb-1">AVERAGE</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatValue(stats.avg, selectedMetric)}{currentMetric.unit}
          </div>
          <div className="text-xs text-blue-600 mt-1">6-month average</div>
      </div>

        <div className="bg-linear-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <div className="text-xs text-purple-700 font-semibold mb-1">LOWEST</div>
          <div className="text-2xl font-bold text-purple-900">
            {formatValue(stats.min, selectedMetric)}{currentMetric.unit}
          </div>
          <div className="text-xs text-purple-600 mt-1">Minimum recorded</div>
        </div>
      </div>
    </div>
  );
}