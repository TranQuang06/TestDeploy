// pages/api/elevenlabs-tts.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, voiceId = "pNInz6obpgDQGcFmaJgB" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Giới hạn độ dài văn bản để tiết kiệm quota
    const limitedText = text.substring(0, 500);

    // Sử dụng API key đã cung cấp
    const apiKey =
      process.env.ELEVENLABS_API_KEY ||
      "sk_f0f957005f7e592134f318fa3b25f2da7b41e236377505ab";

    // Gọi API ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: limitedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "ElevenLabs API error:",
        response.status,
        response.statusText,
        errorData
      );

      if (response.status === 401) {
        throw new Error("API key không hợp lệ hoặc đã hết hạn");
      } else if (response.status === 429) {
        throw new Error("Đã vượt quá giới hạn sử dụng API");
      } else if (response.status === 400) {
        throw new Error("Dữ liệu đầu vào không hợp lệ");
      } else {
        throw new Error(
          `Lỗi API ElevenLabs (${response.status}): ${errorData}`
        );
      }
    }

    // ElevenLabs trả về audio binary trực tiếp
    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return res.status(200).json({
      audioContent: audioBase64,
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
    });
  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to convert text to speech" });
  }
}
