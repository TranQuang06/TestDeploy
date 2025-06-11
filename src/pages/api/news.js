// pages/api/news.js
export default async function handler(req, res) {
  const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
  if (!GNEWS_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing GNEWS_API_KEY in .env.local" });
  }

  // Ví dụ: lấy top-headlines US, tối đa 9 bài
  const url =
    `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}` +
    `&lang=en&country=us&max=9`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Fetch lỗi từ GNews" });
    }
    const data = await response.json();
    // GNews trả về { totalArticles, articles: [...] }
    return res.status(200).json(data);
  } catch (err) {
    console.error("GNews error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
