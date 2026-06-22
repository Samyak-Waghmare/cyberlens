/** Fetch the visitor's public IP + approximate geolocation (keyless, best-effort). */
export async function fetchIpInfo() {
  try {
    const res = await fetch("https://ipwho.is/");
    const j = await res.json();
    if (j && j.success !== false) {
      return {
        ip: j.ip,
        city: j.city,
        region: j.region,
        country: j.country,
        countryCode: j.country_code,
        isp: j.connection?.isp || j.connection?.org,
        flag: j.flag?.emoji,
      };
    }
  } catch {
    /* fall through */
  }
  // Fallback provider.
  try {
    const res = await fetch("https://ipapi.co/json/");
    const j = await res.json();
    return {
      ip: j.ip,
      city: j.city,
      region: j.region,
      country: j.country_name,
      countryCode: j.country_code,
      isp: j.org,
    };
  } catch {
    return null;
  }
}
