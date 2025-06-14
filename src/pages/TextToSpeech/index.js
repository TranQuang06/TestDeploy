import React, { useState, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./TextToSpeech.module.css";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("pNInz6obpgDQGcFmaJgB"); // Default ElevenLabs voice
  const [useWebSpeech, setUseWebSpeech] = useState(false);

  // Danh sách giọng nói của ElevenLabs
  const elevenLabsVoices = [
    // Tiếng Anh
    { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (Tiếng Anh - Nam)" },
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Tiếng Anh - Nữ)" },
    { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi (Tiếng Anh - Nữ)" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella (Tiếng Anh - Nữ)" },
    { id: "ErXwobaYiN019PkySvjV", name: "Antoni (Tiếng Anh - Nam)" },
    { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli (Tiếng Anh - Nữ)" },
    { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh (Tiếng Anh - Nam)" },
    { id: "VR6AewLTigWG4xSOukaG", name: "Arnold (Tiếng Anh - Nam)" },
    { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam (Tiếng Anh - Nam)" },
    // Tiếng Việt
    { id: "Vu0cT7tT8Jb2Sl4ynN5X", name: "Linh (Tiếng Việt - Nữ)" },
    { id: "Vu0cT7tT8Jb2Sl4ynN5X", name: "Minh (Tiếng Việt - Nam)" },
    // Tiếng Nhật
    { id: "GBv7mTt0atIp3Br8iCZE", name: "Hiroshi (Tiếng Nhật - Nam)" },
    // Tiếng Trung
    { id: "zh-CN-XiaoxiaoNeural", name: "Xiaoxiao (Tiếng Trung - Nữ)" },
    // Tiếng Pháp
    { id: "FR-FR-HenriNeural", name: "Henri (Tiếng Pháp - Nam)" },
  ];

  // Fallback sử dụng Web Speech API của trình duyệt
  const fallbackToWebSpeech = (textToSpeak) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Tìm giọng tiếng Việt nếu có
      const voices = speechSynthesis.getVoices();
      const vietnameseVoice = voices.find(
        (voice) => voice.lang.includes("vi") || voice.lang.includes("VN")
      );

      if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
      }

      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setError("Không thể phát âm thanh bằng trình duyệt");
        setIsPlaying(false);
        setIsLoading(false);
      };

      speechSynthesis.speak(utterance);
    } else {
      setError("Trình duyệt không hỗ trợ chuyển đổi văn bản thành giọng nói");
      setIsLoading(false);
    }
  };

  // Sử dụng ElevenLabs API
  const convertToSpeech = async () => {
    if (!text.trim()) {
      setError("Vui lòng nhập văn bản để đọc");
      return;
    }

    setIsLoading(true);
    setError("");

    // Nếu người dùng chọn Web Speech API
    if (useWebSpeech) {
      fallbackToWebSpeech(text);
      return;
    }

    try {
      // Gọi API endpoint của chúng ta
      const response = await fetch("/api/elevenlabs-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Không thể chuyển đổi văn bản thành giọng nói"
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Lưu URL để có thể phát
      setAudioUrl(data.audioUrl);

      if (audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.load();

        audioRef.current.oncanplay = () => {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch((e) => {
              console.error("Play error:", e);
              setError(
                "Không thể phát âm thanh tự động. Vui lòng nhấn nút Phát."
              );
              setIsLoading(false);
            });
        };

        audioRef.current.onended = () => {
          setIsPlaying(false);
        };

        audioRef.current.onerror = (e) => {
          console.error("Audio error:", e);
          setError("Không thể phát âm thanh. Vui lòng thử lại sau.");
          setIsLoading(false);
        };
      }
    } catch (err) {
      console.error("ElevenLabs error:", err);

      // Nếu ElevenLabs thất bại, thử fallback với Web Speech API
      if (err.message.includes("API key") || err.message.includes("API")) {
        console.log("Fallback to Web Speech API");
        setError(
          "ElevenLabs không khả dụng, sử dụng giọng nói mặc định của trình duyệt..."
        );
        setTimeout(() => {
          setError("");
          fallbackToWebSpeech(text);
        }, 1000);
      } else {
        setError(err.message || "Đã xảy ra lỗi khi chuyển đổi văn bản");
        setIsLoading(false);
      }
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((e) => {
            console.error("Play button error:", e);
            setError(
              "Không thể phát âm thanh. Có thể do chính sách bảo mật của trình duyệt."
            );
          });
      }
    }
  };

  const handleDownload = () => {
    if (!audioUrl) {
      setError("Không có file âm thanh để tải xuống");
      return;
    }

    // Tạo một thẻ a tạm thời để tải xuống
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `elevenlabs_${new Date().getTime()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Chuyển Văn Bản Thành Giọng Nói</h1>
        <h2 className={styles.subtitle}>Powered by ElevenLabs AI</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label>
              <input
                type="checkbox"
                checked={useWebSpeech}
                onChange={(e) => setUseWebSpeech(e.target.checked)}
              />
              Sử dụng giọng nói của trình duyệt (miễn phí)
            </label>
          </div>

          {!useWebSpeech && (
            <div className={styles.controlGroup}>
              <label htmlFor="voice-select">Chọn giọng đọc ElevenLabs:</label>
              <select
                id="voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className={styles.select}
              >
                {elevenLabsVoices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <textarea
          className={styles.textInput}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập văn bản bạn muốn chuyển thành giọng nói..."
          rows={10}
        />

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={convertToSpeech}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Chuyển đổi"}
          </button>

          <button
            className={styles.button}
            onClick={handlePlayPause}
            disabled={(!audioRef.current?.src && !isPlaying) || isLoading}
          >
            {isPlaying ? "Tạm dừng" : "Phát"}
          </button>

          {audioUrl && (
            <button
              className={`${styles.button} ${styles.secondary}`}
              onClick={handleDownload}
            >
              Tải xuống MP3
            </button>
          )}
        </div>

        <audio ref={audioRef} controls className={styles.audioControl} />

        <div className={styles.infoBox}>
          <p>Thông tin:</p>
          <ul>
            <li>
              <strong>ElevenLabs AI:</strong> Sử dụng công nghệ AI tiên tiến để
              tạo giọng đọc tự nhiên như người thật
            </li>
            <li>
              <strong>Giọng nói trình duyệt:</strong> Sử dụng Web Speech API có
              sẵn trong trình duyệt (miễn phí, không cần API key)
            </li>
            <li>Hỗ trợ nhiều ngôn ngữ và giọng đọc khác nhau</li>
            <li>Giới hạn 500 ký tự mỗi lần chuyển đổi để tối ưu hiệu suất</li>
            <li>
              Nếu ElevenLabs không khả dụng, hệ thống sẽ tự động chuyển sang sử
              dụng giọng nói của trình duyệt
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}
