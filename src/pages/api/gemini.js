// pages/api/gemini.js
export default async function handler(req, res) {
  // Chỉ chấp nhận phương thức POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Sử dụng API key được cung cấp
    const GEMINI_API_KEY = "AIzaSyD2OqWT8mPIQR0qR0iiNM-GZxnS8FgYVzU";

    // Gọi API Gemini với model gemini-2.0-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Bạn là trợ lý hỗ trợ khách hàng cho trang web tìm kiếm việc làm. 
                  
Thông tin về trang web:
- Tên: MyWork
- Chức năng chính: Tìm kiếm việc làm, đăng tin tuyển dụng, kết nối nhà tuyển dụng và ứng viên
- Tính năng nổi bật: Bản đồ việc làm, chat trực tiếp, chuyển văn bản thành giọng nói
- Đối tượng: Người tìm việc và nhà tuyển dụng tại Việt Nam

Các tính năng chính của trang web:
1. Việc làm: Tìm kiếm việc làm, xem bản đồ việc làm theo vị trí địa lý
2. Công cụ: Tạo CV chuyên nghiệp, chuyển văn bản thành giọng nói
3. Khóa học: Các khóa học nâng cao kỹ năng nghề nghiệp
4. Blog: Bài viết về thị trường việc làm, kỹ năng phỏng vấn
5. Social: Kết nối với cộng đồng người tìm việc và nhà tuyển dụng

Khi trả lời:
1. Luôn giữ giọng điệu thân thiện, chuyên nghiệp
2. Trả lời ngắn gọn, súc tích (dưới 3 câu)
3. Nếu được hỏi về việc làm, hướng dẫn cách sử dụng tính năng tìm kiếm hoặc bản đồ việc làm
4. Nếu được hỏi về đăng tin tuyển dụng, giới thiệu tính năng đăng tin và quy trình
5. Nếu được hỏi về công cụ, giới thiệu tính năng tạo CV hoặc chuyển văn bản thành giọng nói
6. Nếu được hỏi về khóa học, giới thiệu các khóa học nâng cao kỹ năng
7. Với câu hỏi không liên quan đến việc làm, trả lời lịch sự nhưng hướng người dùng quay lại chủ đề việc làm

Câu hỏi: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return res.status(200).json({
        reply:
          "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.",
      });
    }

    const data = await response.json();

    // Trích xuất phản hồi từ Gemini
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return res.status(200).json({
      reply:
        "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
    });
  }
}
