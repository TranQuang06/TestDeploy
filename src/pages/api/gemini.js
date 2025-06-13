// pages/api/gemini.js
export default async function handler(req, res) {
  // Chỉ chấp nhận phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Sử dụng API key được cung cấp
    const GEMINI_API_KEY = 'AIzaSyD2OqWT8mPIQR0qR0iiNM-GZxnS8FgYVzU';
    
    // Gọi API Gemini với model gemini-2.0-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Bạn là trợ lý hỗ trợ khách hàng. Hãy trả lời câu hỏi sau một cách ngắn gọn, thân thiện và hữu ích: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return res.status(200).json({ 
        reply: 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.' 
      });
    }

    const data = await response.json();
    
    // Trích xuất phản hồi từ Gemini
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                  'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.';
    
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(200).json({ 
      reply: 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.' 
    });
  }
}