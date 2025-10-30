// app/api/fetch-data/route.ts
import { NextResponse } from "next/server";

// Month number to name mapping
const MONTH_MAP: { [key: string]: string } = {
  '1': 'Jan',
  '2': 'Feb',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'Aug',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec'
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    console.log("📦 Received Query Params:", Object.fromEntries(searchParams.entries()));
    const districtCode = searchParams.get("district_code");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    // Detailed logging
    console.log('🔍 API Route received:', {
      districtCode,
      month,
      year,
      allParams: Object.fromEntries(searchParams.entries())
    });

    // Validate district code
    if (!districtCode) {
      console.error('❌ Missing district_code');
      return NextResponse.json(
        { error: "district_code is required" },
        { status: 400 }
      );
    }

    // Validate district code format (should be 4 digits like 0407)
    if (!/^\d{4}$/.test(districtCode)) {
      console.error('❌ Invalid district_code format:', districtCode);
      return NextResponse.json(
        { error: `Invalid district_code format: ${districtCode}. Expected 4 digits like 0407.` },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_API_URL;
    const resourceId = process.env.NEXT_PUBLIC_RESOURCE_ID;

    // Convert month number to month name
    const monthName = month && MONTH_MAP[month] ? MONTH_MAP[month] : null;
    
    // Build financial year
    const finYear = year ? `${parseInt(year) - 1}-${year}` : null;

    console.log('🔄 Converted params:', { 
      districtCode, 
      monthName, 
      finYear 
    });

    // Build URLs with proper encoding
    const baseParams = `api-key=${apiKey}&format=json&limit=10`;
    const stateFilter = `&filters[state_name]=ASSAM`;
    const districtFilter = `&filters[district_code]=${districtCode}`;
    
    const attempts = [
      // 1. Most specific: District only (most reliable)
      `https://api.data.gov.in/resource/${resourceId}?${baseParams}${stateFilter}${districtFilter}`,
      
      // 2. Fallback: Just district code, any state
      `https://api.data.gov.in/resource/${resourceId}?${baseParams}${districtFilter}`,
    ];

    for (let i = 0; i < attempts.length; i++) {
      try {
        const url = attempts[i];
        console.log(`📡 Attempt ${i + 1}:`, url);
        
        const res = await fetch(url, {
          headers: { 
            'Accept': 'application/json',
          },
        });

        console.log(`📥 Response status:`, res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`❌ API error:`, res.status, errorText);
          continue;
        }

        const data = await res.json();
        console.log(`📦 API Response:`, {
          total: data.total,
          count: data.records?.length || 0,
          sampleDistrict: data.records?.[0]?.district_name,
          sampleMonth: data.records?.[0]?.month,
          sampleYear: data.records?.[0]?.fin_year,
        });

        if (data.records && data.records.length > 0) {
          // Filter by month and year if provided
          let filteredRecords = data.records;
          
          if (monthName) {
            const monthFiltered = filteredRecords.filter((r: any) => 
              r.month === monthName
            );
            if (monthFiltered.length > 0) {
              filteredRecords = monthFiltered;
              console.log(`✅ Filtered to ${monthFiltered.length} records for month: ${monthName}`);
            }
          }
          
          if (finYear) {
            const yearFiltered = filteredRecords.filter((r: any) => 
              r.fin_year === finYear
            );
            if (yearFiltered.length > 0) {
              filteredRecords = yearFiltered;
              console.log(`✅ Filtered to ${yearFiltered.length} records for year: ${finYear}`);
            }
          }
          
          console.log(`✅ Returning ${filteredRecords.length} record(s)`);
          return NextResponse.json(filteredRecords.slice(0, 1));
        }
      } catch (err: any) {
        console.error(`❌ Attempt ${i + 1} error:`, err.message);
        continue;
      }
    }

    // No data found
    console.log('⚠️ No data found for district:', districtCode);
    return NextResponse.json([], { status: 200 });

  } catch (error: any) {
    console.error('❌ Unexpected error in API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}