import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lat, lng, useIP } = body;

    let locationData;

    if (useIP) {
      // 📍Fallback: detect location via IP
      const res = await fetch("https://ipapi.co/json/");
      locationData = await res.json();
    } else if (lat && lng) {
      // 🌍Detect location using coordinates (reverse geocoding)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      );
      locationData = await res.json();
    } else {
      return NextResponse.json({ success: false, error: "Missing coordinates" });
    }

    // 🧩 Extract address info
    const address = locationData.address || {};
    const state =
      address.state || locationData.region || locationData.region_name || "Unknown";
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      locationData.city ||
      "Unknown";
    const districtFromAPI =
      address.state_district || address.county || address.city || "Unknown";

    // ✅ Map Assam cities to their corresponding districts
    const cityToDistrictMap: Record<string, string> = {
      guwahati: "Kamrup Metropolitan",
      dibrugarh: "Dibrugarh",
      silchar: "Cachar",
      tezpur: "Sonitpur",
      jorhat: "Jorhat",
      nagaon: "Nagaon",
      barpeta: "Barpeta",
      bongaigaon: "Bongaigaon",
      nalbari: "Nalbari",
      tinsukia: "Tinsukia",
      golaghat: "Golaghat",
    };

    const lowerCity = city.toLowerCase();
    const mappedDistrict = cityToDistrictMap[lowerCity] || districtFromAPI;

    // 🗺️ Assam districts (for lookup)
    const ASSAM_DISTRICTS = {
      "Baksa": "1801",
      "Barpeta": "1802",
      "Biswanath": "1803",
      "Bongaigaon": "1804",
      "Cachar": "1805",
      "Charaideo": "1806",
      "Chirang": "1807",
      "Darrang": "1808",
      "Dhemaji": "1809",
      "Dhubri": "1810",
      "Dibrugarh": "1811",
      "Dima Hasao": "1812",
      "Goalpara": "1813",
      "Golaghat": "1814",
      "Hailakandi": "1815",
      "Hojai": "1816",
      "Jorhat": "1817",
      "Kamrup": "1818",
      "Kamrup Metropolitan": "1819",
      "Karbi Anglong": "1820",
      "Karimganj": "1821",
      "Kokrajhar": "1822",
      "Lakhimpur": "1823",
      "Majuli": "1824",
      "Morigaon": "1825",
      "Nagaon": "1826",
      "Nalbari": "1827",
      "Sivasagar": "1828",
      "Sonitpur": "1829",
      "South Salmara-Mankachar": "1830",
      "Tinsukia": "1831",
      "Udalguri": "1832",
      "West Karbi Anglong": "1833",
    };

    // 🧠 Normalize for Assam check
    const stateIsAssam = state.toLowerCase().includes("assam");

    // 🎯 Find district code if available
    let detectedDistrictCode = null;
    for (const [name, code] of Object.entries(ASSAM_DISTRICTS)) {
      if (mappedDistrict.toLowerCase().includes(name.toLowerCase())) {
        detectedDistrictCode = code;
        break;
      }
    }

    // ✅ Return Assam district if detected
    if (stateIsAssam && detectedDistrictCode) {
      return NextResponse.json({
        success: true,
        district: {
          state_code: "18",
          state_name: "Assam",
          district_code: detectedDistrictCode,
          district_name: mappedDistrict,
          city_name: city,
        },
      });
    }

    // ⚠️ Fallback for non-Assam or unknown areas
    return NextResponse.json({
      success: true,
      district: {
        state_name: state,
        city_name: city,
        district_name: mappedDistrict,
        message: "Currently available only for Assam.",
      },
    });
  } catch (error) {
    console.error("Error detecting location:", error);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
