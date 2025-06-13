import React, { useState, useEffect, useRef } from "react";
import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
} from "@ant-design/icons";
import styles from "./ChatButton.module.css";

function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?",
      isBot: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [fullResponse, setFullResponse] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Hiệu ứng đang nhập
  useEffect(() => {
    if (isTyping && fullResponse) {
      let currentIndex = 0;
      const typingSpeed = 30; // ms giữa mỗi ký tự (điều chỉnh để chậm/nhanh hơn)

      // Xóa timer cũ nếu có
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }

      // Tạo hiệu ứng đang nhập
      typingTimerRef.current = setInterval(() => {
        if (currentIndex < fullResponse.length) {
          setTypingText(fullResponse.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingTimerRef.current);
          setIsTyping(false);
          // Thêm tin nhắn hoàn chỉnh vào danh sách
          setMessages((prev) => [...prev, { text: fullResponse, isBot: true }]);
          setFullResponse("");
          setTypingText("");
        }
      }, typingSpeed);

      return () => {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
        }
      };
    }
  }, [isTyping, fullResponse]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading || isTyping) return;

    // Thêm tin nhắn của người dùng
    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Gọi API Gemini
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const reply =
        data.reply || "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.";

      // Thêm độ trễ trước khi bắt đầu hiệu ứng đang nhập
      setTimeout(() => {
        setIsLoading(false);
        setFullResponse(reply);
        setIsTyping(true);
      }, 1000); // Độ trễ 1 giây trước khi bắt đầu hiệu ứng đang nhập
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Thêm độ trễ trước khi hiển thị lỗi
      setTimeout(() => {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            text: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
            isBot: true,
          },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingText]);

  // Focus vào input khi mở chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  return (
    <div className={styles.chatButtonContainer}>
      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <h3>Trợ lý AI</h3>
            <button onClick={toggleChat} className={styles.closeButton}>
              <CloseOutlined />
            </button>
          </div>
          <div className={styles.chatBody}>
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`${styles.message} ${
                  msg.isBot ? styles.botMessage : styles.userMessage
                }`}
              >
                {msg.text}
              </p>
            ))}

            {isTyping && typingText && (
              <p
                className={`${styles.message} ${styles.botMessage} ${styles.typingMessage}`}
              >
                {typingText}
                <span className={styles.typingCursor}></span>
              </p>
            )}

            {isLoading && (
              <div className={styles.loadingIndicator}>
                <span>Đang suy nghĩ...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
          <div className={styles.chatFooter}>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              ref={inputRef}
              disabled={isLoading || isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || isTyping || inputValue.trim() === ""}
              className={
                isLoading || isTyping || inputValue.trim() === ""
                  ? styles.disabledButton
                  : ""
              }
            >
              <SendOutlined />
            </button>
          </div>
        </div>
      )}
      <button
        className={styles.chatButton}
        onClick={toggleChat}
        aria-label="Chat hỗ trợ"
      >
        <MessageOutlined />
      </button>
    </div>
  );
}

export default ChatButton;
