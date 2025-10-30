import { NextResponse } from "next/server";

// Month number to name mapping
const MONTH_MAP: Record<string, string> = {
  '1': 'Jan','2': 'Feb','3': 'March','4': 'April','5': 'May','6': 'June','7': 'July','8': 'Aug','9': 'Sep','10': 'Oct','11': 'Nov','12': 'Dec'
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year"); // FY base, e.g. 2024 for FY 2024-25

    const monthName = month && MONTH_MAP[month] ? MONTH_MAP[month] : null;
    const finYear = year ? `${parseInt(year) - 1}-${year}` : null;

    const apiKey = "579b464db66ec23bdd000001ec48bf189a0547097ed08d17ef85ffa6";
    const resourceId = "ee03643a-ee4c-48c2-ac30-9f2ff26ab722";

    const baseParams = `api-key=${apiKey}&format=json&limit=5000`;
    const stateFilter = `&filters[state_name]=ASSAM`;

    const url = `https://api.data.gov.in/resource/${resourceId}?${baseParams}${stateFilter}`;

    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: `Upstream error ${res.status}: ${t}` }, { status: 502 });
    }
    const json = await res.json();
    let records: any[] = json.records || [];

    if (monthName) {
      const m = records.filter((r) => r.month === monthName);
      if (m.length > 0) records = m;
    }
    if (finYear) {
      const y = records.filter((r) => r.fin_year === finYear);
      if (y.length > 0) records = y;
    }

    // Only essential fields back to client
    const trimmed = records.map((r) => ({
      district_code: r.district_code,
      district_name: r.district_name,
      Total_Households_Worked: Number(r.Total_Households_Worked) || 0,
      Average_days_of_employment_provided_per_Household: Number(r.Average_days_of_employment_provided_per_Household) || 0,
      percentage_payments_gererated_within_15_days: Number(r.percentage_payments_gererated_within_15_days) || 0,
      Number_of_Completed_Works: Number(r.Number_of_Completed_Works) || 0,
      Total_Exp: Number(r.Total_Exp) || 0,
      Women_Persondays: Number(r.Women_Persondays) || 0,
      Persondays_of_Central_Liability_so_far: Number(r.Persondays_of_Central_Liability_so_far) || 0,
    }));

    return NextResponse.json(trimmed);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}


