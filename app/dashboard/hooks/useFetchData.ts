import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export const useFetchData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const district_code = searchParams.get("district_code");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    // ✅ Run only when all params are available
    if (!district_code || !month || !year) {
      console.log("⏸️ Skipping fetch — missing params", {
        district_code,
        month,
        year,
      });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `/api/fetch-data?district_code=${district_code}&month=${month}&year=${year}`;
        console.log("🌐 Fetching:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        setData(result);
        console.log("✅ Data received:", result);
      } catch (err: any) {
        setError(err.message);
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]); // ✅ Depend on searchParams so it re-runs when query changes

  return { data, loading, error };
};
