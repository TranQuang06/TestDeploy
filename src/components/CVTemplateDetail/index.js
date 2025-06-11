import React from "react";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { Radio, Button } from "antd";
import styles from "./CVTemplateDetailed.module.css"; // Đổi tên file css cho đúng

export default function CVTemplateDetailed({ data, onBackList }) {
  // Nếu muốn dữ liệu mẫu thì truyền props hoặc copy luôn object ở trên vào biến `data`
  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
        {/* Cột trái: Nội dung CV + sidebar */}
        <div className={styles.cvCard}>
          <div className={styles.profileHeader}>
            <img className={styles.avatar} src={data.photo} alt={data.fullname} />
            <div>
              <div className={styles.fullname}>{data.fullname}</div>
              <div className={styles.position}>{data.position}</div>
              <div className={styles.summary}>{data.objective}</div>
            </div>
          </div>
          <div className={styles.gridTwoCol}>
            {/* Cột lớn: Main Info */}
            <div>
              {/* Học vấn */}
              <div className={styles.cvBlock}>
                <div className={styles.blockTitle}>HỌC VẤN</div>
                {data.education.map((e, i) => (
                  <div key={i}>
                    <b>{e.institution}</b>
                    <div>{e.major}</div>
                    <div className={styles.blockTime}>{e.period}</div>
                    <div>{e.grade}</div>
                  </div>
                ))}
              </div>
              {/* Kinh nghiệm */}
              <div className={styles.cvBlock}>
                <div className={styles.blockTitle}>KINH NGHIỆM LÀM VIỆC</div>
                {data.experience.map((ex, i) => (
                  <div key={i}>
                    <b>{ex.company}</b>
                    <span className={styles.blockTime}>{ex.period}</span>
                    <div className={styles.boldText}>{ex.role}</div>
                    <ul className={styles.blockList}>
                      {ex.details.map((d, j) => <li key={j}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              {/* Hoạt động */}
              <div className={styles.cvBlock}>
                <div className={styles.blockTitle}>HOẠT ĐỘNG</div>
                {data.activities.map((act, i) => (
                  <div key={i}>
                    <b>{act.title}</b>
                    <span className={styles.blockTime}>{act.period}</span>
                    <div>{act.details}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Sidebar nhỏ bên phải của card */}
            <div>
              <div className={styles.sideBlock}>
                <div className={styles.sideBlockTitle}>THÔNG TIN CÁ NHÂN</div>
                <div><PhoneOutlined /> {data.personal.phone}</div>
                <div><MailOutlined /> {data.personal.email}</div>
                <div><EnvironmentOutlined /> {data.personal.address}</div>
              </div>
              <div className={styles.sideBlock}>
                <div className={styles.sideBlockTitle}>CHỨNG CHỈ</div>
                {data.certificates.map((c, i) => <div key={i}>{c}</div>)}
              </div>
              <div className={styles.sideBlock}>
                <div className={styles.sideBlockTitle}>NGƯỜI GIỚI THIỆU</div>
                {data.references.map((r, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <b>{r.name}</b>
                    <br />
                    {r.relation} tại {r.company}
                    <br />
                    SĐT: {r.phone}
                  </div>
                ))}
              </div>
              <div className={styles.sideBlock}>
                <div className={styles.sideBlockTitle}>DANH HIỆU VÀ GIẢI THƯỞNG</div>
                {data.awards.map((a, i) => <div key={i}>{a}</div>)}
              </div>
              {data.extraInfo && (
                <div className={styles.sideBlock}>
                  <div className={styles.sideBlockTitle}>THÔNG TIN THÊM</div>
                  <div>{data.extraInfo}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Cột phải: Box tạo CV */}
        <div className={styles.rightCol}>
          <div className={styles.createBox}>
            <div className={styles.createBoxTitle}>Bạn muốn tạo CV từ?</div>
            <Radio.Group
              defaultValue="suggested"
              className={styles.radioGroup}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <Radio value="suggested">Nội dung CV mẫu TopCV gợi ý</Radio>
              <Radio value="upload">
                Nội dung CV từ máy tính của bạn hoặc <span style={{ color: "#2563eb" }}>LinkedIn</span>
              </Radio>
              <Radio value="blank">
                Tạo CV từ đầu <span style={{ fontSize: 12, color: "#aaa" }}>(Bắt đầu từ trang trắng không có nội dung gợi ý)</span>
              </Radio>
            </Radio.Group>
            <Button block disabled style={{ marginTop: 14, background: "#ededed", color: "#666" }}>
              Tạo CV
            </Button>
            <Button
              block
              className={styles.btnBack}
              style={{
                marginTop: 16,
                color: "#00b14f",
                border: "1px solid #00b14f",
                background: "#fff",
                fontWeight: 500
              }}
              onClick={onBackList || (() => window.history.back())}
            >
              ← Quay lại danh sách mẫu CV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
