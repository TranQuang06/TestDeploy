// pages/api/popular-blogs.js
export default async function handler(req, res) {
  const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
  if (!GNEWS_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing GNEWS_API_KEY in environment" });
  }

  // Bạn có thể mở rộng để nhận query param, ví dụ ?topic=technology
  // const topic = req.query.topic || '';
  // let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&lang=en&country=us&max=6`;
  // if (topic) url += `&topic=${topic}`;

  // Ở đây đơn giản lấy top-headlines US, max 6 bài
  const url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&lang=en&country=us&max=8`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Fetch lỗi từ GNews", details: await response.text() });
    }
    const data = await response.json();
    // GNews trả về: { totalArticles, articles: [ { title, description, content, url, image, publishedAt, source: { name, url } } ] }
    return res.status(200).json(data);
  } catch (err) {
    console.error("GNews API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
