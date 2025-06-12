// pages/api/adzuna.js
export default async function handler(req, res) {
  const { query } = req;
  const { what = "", where = "" } = query;

  const APP_ID = process.env.ADZUNA_APP_ID;
  const API_KEY = process.env.ADZUNA_API_KEY;
  if (!APP_ID || !API_KEY) {
    return res.status(500).json({ error: "Missing Adzuna API credentials" });
  }

  // Quốc gia: bạn có thể truyền từ client (query.country), nếu không có, mặc định 'pl' hay 'us'...
  const country = query.country || "pl"; // ví dụ Poland
  const page = 1;
  const resultsPerPage = 20;

  try {
    const url =
      `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}` +
      `?app_id=${APP_ID}&app_key=${API_KEY}` +
      `&results_per_page=${resultsPerPage}` +
      `&what=${encodeURIComponent(what)}` +
      `&where=${encodeURIComponent(where)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || "API request failed",
      });
    }

    // Chuyển đổi dữ liệu từ Adzuna sang định dạng mà frontend cần
    const jobs = (data.results || []).map((job) => {
      // Tạo logo từ tên công ty
      const companyName = job.company?.display_name || "Company";
      const companyInitials = companyName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

      // Tạo màu ngẫu nhiên nhưng nhất quán cho mỗi công ty
      const getColorFromName = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = Math.abs(hash).toString(16).substring(0, 6);
        return color.padStart(6, "0");
      };

      const bgColor = getColorFromName(companyName);

      // Tạo URL logo từ UI Avatars hoặc sử dụng Clearbit nếu muốn
      const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        companyInitials
      )}&background=${bgColor}&color=ffffff&size=50&bold=true`;

      return {
        id: job.id,
        title: job.title,
        companyName: companyName,
        companyLogo: logoUrl,
        locationText: job.location.display_name,
        salary:
          job.salary_min && job.salary_max
            ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${
                job.salary_currency || ""
              }`
            : "Salary not specified",
        description: job.description,
        url: job.redirect_url,
        lat: job.latitude,
        lng: job.longitude,
        bookmarked: false,
        // Thêm các trường khác nếu cần
      };
    });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Adzuna API error:", error);
    return res.status(500).json({ error: "Failed to fetch jobs from Adzuna" });
  }
}
