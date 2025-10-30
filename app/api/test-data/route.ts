import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = "579b464db66ec23bdd000001ec48bf189a0547097ed08d17ef85ffa6";
    const resourceId = "ee03643a-ee4c-48c2-ac30-9f2ff26ab722";

    const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=500`;

    console.log("📡 Fetching all districts...");
    const res = await fetch(url);
    const data = await res.json();

    if (!data.records || data.records.length === 0) {
      console.warn("⚠️ No district data found");
      return NextResponse.json({ message: "No district data found" }, { status: 404 });
    }

    // ✅ Filter for Assam (district codes starting with '04')
    const assamDistricts = data.records.filter(
      (r: any) => r.district_code?.startsWith("04")
    );

    console.log("📋 Assam District List (Code → Name):");
    assamDistricts.forEach((r: any) => {
      console.log(`${r.district_code} → ${r.district_name}`);
    });

    // Return as JSON as well
    return NextResponse.json(
      { count: assamDistricts.length, districts: assamDistricts },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Error fetching districts:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
