import React, { useState, useRef, useEffect } from "react";

import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { Button, Input, Upload, message } from "antd";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from "./CVTemplateDetailed.module.css";

const { TextArea } = Input;


export default function CVTemplateDetailed({ data, onBackList }) {
  // Kiểm tra dữ liệu đầu vào và tạo default data
  const defaultData = {
    fullname: data?.fullname || "Họ và tên",
    position: data?.position || "Vị trí ứng tuyển",
    photo: data?.photo || "/assets/img/creatCV/cv/avatar.png",
    objective: data?.objective || "Mục tiêu nghề nghiệp",
    personal: {
      phone: data?.personal?.phone || "Số điện thoại",
      email: data?.personal?.email || "Email",
      address: data?.personal?.address || "Địa chỉ"
    },
    education: data?.education || [],
    experience: data?.experience || [],
    activities: data?.activities || [],
    certificates: data?.certificates || [],
    references: data?.references || [],
    awards: data?.awards || [],
    extraInfo: data?.extraInfo || ""
  };

  // State để quản lý dữ liệu CV có thể edit
  const [cvData, setCvData] = useState(defaultData);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(defaultData);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const cvContentRef = useRef(null);

  // Handler để cập nhật dữ liệu
  const updateCvData = (path, value) => {
    setCvData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Handler để cập nhật array items
  const updateArrayItem = (arrayPath, index, field, value) => {
    setCvData(prev => {
      const newData = { ...prev };
      const array = arrayPath.split('.').reduce((obj, key) => obj[key], newData);
      if (array && array[index]) {
        array[index] = { ...array[index], [field]: value };
      }
      return newData;
    });
  };

  // Handler để thêm item vào array
  const addArrayItem = (arrayPath, newItem) => {
    setCvData(prev => {
      const newData = { ...prev };
      const keys = arrayPath.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      if (!current[keys[keys.length - 1]]) {
        current[keys[keys.length - 1]] = [];
      }
      current[keys[keys.length - 1]].push(newItem);
      return newData;
    });
  };
  

  // Handler để xóa item khỏi array
  const removeArrayItem = (arrayPath, index) => {
    setCvData(prev => {
      const newData = { ...prev };
      const keys = arrayPath.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]].splice(index, 1);
      return newData;
    });
  };

  // Handler upload ảnh với validation
  const handleImageUpload = (file) => {
    // Kiểm tra định dạng file
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh (JPG, PNG, GIF, etc.)!');
      return false;
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
      return false;
    }

    // Đọc và cập nhật ảnh
    const reader = new FileReader();
    reader.onload = (e) => {
      updateCvData('photo', e.target.result);
      message.success('✅ Ảnh đã được cập nhật thành công!');
    };
    reader.onerror = () => {
      message.error('❌ Có lỗi khi đọc file ảnh!');
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload
  };

  // Handler save changes
  const handleSave = () => {
    setOriginalData(cvData);
    setIsEditing(false);
    message.success('Đã lưu thay đổi!');
  };

  // Handler cancel changes
  const handleCancel = () => {
    setCvData(originalData);
    setIsEditing(false);
    message.info('Đã hủy thay đổi!');
  };

  // Handler toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  // Preset cấu hình PDF
  const PX_PER_MM = 96 / 25.4;

const getPDFPreset = (name = 'standard') => ({
  standard: {
    canvas: { scale: 2, quality: 1, backgroundColor: '#ffffff' },
    pdf:    { marginTop: 10, marginRight: 10, marginBottom: 10, marginLeft: 10, compress: false },
    layout: { centerHorizontal: false, centerVertical: false }
  },
  highQuality: {
    canvas: { scale: 3, quality: 1, backgroundColor: '#ffffff' },
    pdf:    { marginTop: 15, marginRight: 15, marginBottom: 15, marginLeft: 15, compress: false },
    layout: { centerHorizontal: false, centerVertical: false }
  },
  office: {
  canvas: { scale: 2, quality: 1, backgroundColor: '#ffffff' },
  pdf:    { marginTop: 4, marginRight: 4, marginBottom: 4, marginLeft: 4, compress: true},
  layout: { centerHorizontal: false, centerVertical: false }
}

}[name] || {});

  // Function test capture để debug
  const testCapture = async () => {
    if (!cvContentRef.current) {
      message.error('Không tìm thấy CV element!');
      return;
    }

    try {
      const cvElement = cvContentRef.current;
      console.log('🧪 Testing capture...');
      console.log('Element:', cvElement);
      console.log('Dimensions:', {
        offsetWidth: cvElement.offsetWidth,
        offsetHeight: cvElement.offsetHeight,
        scrollWidth: cvElement.scrollWidth,
        scrollHeight: cvElement.scrollHeight
      });

      // Test capture nhỏ
      const testCanvas = await html2canvas(cvElement, {
        scale: 1,
        backgroundColor: '#ffffff',
        logging: true,
        width: cvElement.scrollWidth,
        height: cvElement.scrollHeight
      });
      
      console.log('Test canvas:', testCanvas.width, 'x', testCanvas.height);

      // Tạo preview image để kiểm tra
      const dataURL = testCanvas.toDataURL('image/png');

      // Tạo popup preview
      const previewWindow = window.open('', '_blank', 'width=800,height=600');
      previewWindow.document.write(`
        <html>
          <head><title>CV Preview Test</title></head>
          <body style="margin: 20px; font-family: Arial;">
            <h3>🧪 Test Capture Preview</h3>
            <p><strong>Canvas Size:</strong> ${testCanvas.width} x ${testCanvas.height} pixels</p>
            <p><strong>Element Size:</strong> ${cvElement.offsetWidth} x ${cvElement.offsetHeight} pixels</p>
            <div style="border: 2px solid #1890ff; padding: 10px; margin: 10px 0;">
              <img src="${dataURL}" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
            </div>
            <p style="color: green;">✅ Nếu bạn thấy đầy đủ nội dung CV ở trên, PDF sẽ xuất đúng!</p>
          </body>
        </html>
      `);

      console.log('Preview image data:', dataURL.substring(0, 100) + '...');
      message.success('✅ Test capture thành công! Xem popup preview để kiểm tra.');

    } catch (error) {
      console.error('❌ Test capture failed:', error);
      message.error('Test capture thất bại: ' + error.message);
    }
  };

  // Handler xuất PDF với hỗ trợ nhiều trang A4
const handleExportPDF = async () => {
  const preset = getPDFPreset('office');
  if (!cvContentRef.current) {
    message.error('Không tìm thấy nội dung CV!');
    return;
  }
  setIsGeneratingPDF(true);

  /* --------------- Ẩn nút, chuẩn bị chụp --------------- */
  const cvElement = cvContentRef.current;
  const hiddenEls = [
    ...document.querySelectorAll(`.${styles.editButton}`),
    document.querySelector('[data-edit-toggle="true"]'),
    document.querySelector(`.${styles.rightCol}`)
  ].filter(Boolean);
  const cache = hiddenEls.map(el => ({ el, ds: el.style.display, vs: el.style.visibility }));
  hiddenEls.forEach(el => { el.style.display = 'none'; el.style.visibility = 'hidden'; });

  const oldWidth = cvElement.style.width;
  cvElement.classList.add('pdf-export-mode');
  
  // Đảm bảo chiều rộng cố định cho A4
  cvElement.style.width = '794px';
  
  // Đảm bảo tất cả các phần tử có word-wrap
  const allTextElements = cvElement.querySelectorAll('p, span, div, li');
  const textStyles = Array.from(allTextElements).map(el => ({
    el,
    oldWordWrap: el.style.wordWrap,
    oldOverflowWrap: el.style.overflowWrap,
    oldWordBreak: el.style.wordBreak,
    oldWhiteSpace: el.style.whiteSpace
  }));
  
  allTextElements.forEach(el => {
    el.style.wordWrap = 'break-word';
    el.style.overflowWrap = 'break-word';
    el.style.wordBreak = 'break-word';
    el.style.whiteSpace = 'normal';
  });

  await new Promise(r => setTimeout(r, 500));     // chờ layout

  /* --------------- Chụp canvas --------------- */
  const canvas = await html2canvas(cvElement, {
    scale: preset.canvas.scale,
    backgroundColor: preset.canvas.backgroundColor,
    useCORS: true,
    logging: false,
    allowTaint: true,
    letterRendering: true,
    windowWidth: 794,
    windowHeight: cvElement.scrollHeight
  });

  /* --------------- Quy đổi kích thước --------------- */
  const imgWidthMM = canvas.width / PX_PER_MM / preset.canvas.scale;
  const imgHeightMM = canvas.height / PX_PER_MM / preset.canvas.scale;

  /* --------------- Tạo PDF --------------- */
  const pdf = new jsPDF({ 
    unit: 'mm', 
    format: 'a4', 
    compress: preset.pdf.compress,
    orientation: 'portrait'
  });
  
  const availW = 210 - preset.pdf.marginLeft - preset.pdf.marginRight;
  const availH = 297 - preset.pdf.marginTop - preset.pdf.marginBottom;
  
  // Chỉ fit theo chiều RỘNG
  const fitScale = availW / imgWidthMM;
  const finalW = imgWidthMM * fitScale;
  const finalH = imgHeightMM * fitScale;
  
  // Tính toán số trang cần thiết
  const totalPages = Math.ceil(finalH / availH);
  
  // Xử lý nhiều trang
  for (let page = 0; page < totalPages; page++) {
    // Thêm trang mới nếu không phải trang đầu tiên
    if (page > 0) {
      pdf.addPage();
    }
    
    const x = preset.pdf.marginLeft;
    const y = preset.pdf.marginTop;
    
    // Tính toán vị trí cắt ảnh cho từng trang
    const sourceY = (page * availH / finalH) * canvas.height;
    const sourceHeight = Math.min(
      (availH / finalH) * canvas.height,
      canvas.height - sourceY
    );
    
    // Tạo canvas tạm thời cho phần cần hiển thị
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = sourceHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Vẽ phần tương ứng của canvas gốc lên canvas tạm
    tempCtx.drawImage(
      canvas,
      0, sourceY, canvas.width, sourceHeight,
      0, 0, canvas.width, sourceHeight
    );
    
    // Tính chiều cao thực tế cho phần này
    const partHeight = (sourceHeight / canvas.height) * finalH;
    
    // Thêm phần ảnh vào PDF
    pdf.addImage(
      tempCanvas.toDataURL('image/png', preset.canvas.quality),
      'PNG',
      x,
      y,
      finalW,
      partHeight,
      '',
      'FAST'
    );
  }

  const fileName = `CV_${(cvData.fullname || 'CV').replace(/\W+/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`;
  pdf.save(fileName);

  /* --------------- Khôi phục giao diện --------------- */
  cvElement.style.width = oldWidth;
  cvElement.classList.remove('pdf-export-mode');
  
  // Khôi phục các phần tử ẩn
  cache.forEach(({ el, ds, vs }) => { 
    el.style.display = ds; 
    el.style.visibility = vs; 
  });
  
  // Khôi phục style cho các phần tử text
  textStyles.forEach(({ el, oldWordWrap, oldOverflowWrap, oldWordBreak, oldWhiteSpace }) => {
    el.style.wordWrap = oldWordWrap;
    el.style.overflowWrap = oldOverflowWrap;
    el.style.wordBreak = oldWordBreak;
    el.style.whiteSpace = oldWhiteSpace;
  });
  
  setIsGeneratingPDF(false);
  message.success(`✅ Xuất PDF thành công (${totalPages} trang)!`);
};


  // -- EditableText giữ state cục bộ, chỉ commit khi blur/Enter --
const EditableText = ({
  isEditing,  
  value,
  onChange,                   // giữ nguyên prop cũ → không phải sửa chỗ gọi
  multiline = false,
  placeholder = "Nhập text..."
}) => {

  /* 1. State “nháp” chỉ tồn tại trong ô input */
  const [draft, setDraft] = useState(value);

  if (!isEditing) return <span>{value}</span>;

  /* 2. Nếu giá trị ngoài thay đổi (load CV khác, hủy edit…) → đồng bộ lại */
  useEffect(() => setDraft(value), [value]);

  /* 3. Khi rời ô (blur) hoặc nhấn Enter (input 1 dòng) mới commit */
  const commit = () => {
    if (draft !== value) onChange(draft);  // chỉ gửi lên store khi thực sự thay đổi
  };

  
  const Comp = multiline ? TextArea : Input;

  return (
    <Comp
      autoFocus                   // bảo đảm luôn giữ focus sau render
      value={draft}
      onChange={e => setDraft(e.target.value)}   // KHÔNG đụng tới cvData
      onBlur={commit}
      onPressEnter={!multiline ? commit : undefined}
      placeholder={placeholder}
      style={{ marginBottom: multiline ? 8 : 4 }}
    />
  );
};

  return (
    <div className={styles.container}>
      {/* Edit Mode Toggle Button */}
      {/* Nút chỉnh sửa ở góc phải */}
      <div
        style={{ position: 'fixed', top: 100, right: 20, zIndex: 1000 }}
        data-edit-toggle="true"
      >
        <Button
          type={isEditing ? "primary" : "default"}
          icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
          onClick={toggleEditMode}
          style={{ marginBottom: 8 }}
        >
          {isEditing ? 'Lưu' : 'Chỉnh sửa'}
        </Button>
        {isEditing && (
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancel}
            style={{ marginLeft: 8 }}
          >
            Hủy
          </Button>
        )}
      </div>

      <div className={styles.mainLayout}>
        {/* Cột trái: Nội dung CV + sidebar */}
        <div className={styles.cvCard} ref={cvContentRef} data-cv-content="true">
          {/*slidebar*/}
          <div className={styles.gridTwoCol}>
            <div>
              {/* Avatar với upload */}
              <div style={{ position: 'relative', display: 'inline-block' }} className={styles.avatarContainer}>
                <img
                  className={styles.avatar}
                  src={cvData.photo || '/assets/img/creatCV/cv/avatar.png'}
                  alt={cvData.fullname || 'Avatar'}
                  style={{
                    border: isEditing ? '2px dashed #1890ff' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
                {isEditing && (
                  <>
                    {/* Nút upload chính - đảm bảo luôn hiển thị */}
                    <Upload
                      beforeUpload={handleImageUpload}
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        size="small"
                        className={styles.avatarUpload}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          background: '#1890ff',
                          borderColor: '#1890ff',
                          color: 'white',
                          boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10
                        }}
                      />
                    </Upload>

                    {/* Overlay hướng dẫn khi hover */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(24, 144, 255, 0.1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.8,
                      transition: 'opacity 0.3s ease',
                      cursor: 'pointer',
                      zIndex: 5
                    }}
                    className="upload-overlay"
                    >
                      <div style={{
                        color: '#1890ff',
                        fontSize: 12,
                        fontWeight: 600,
                        textAlign: 'center'
                      }}>
                        📷<br/>Đổi ảnh
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.sideBlock}>
                <div className={styles.sideBlockTitle}>THÔNG TIN CÁ NHÂN</div>
                <div>
                  <PhoneOutlined />
                  <EditableText
                    isEditing={isEditing}    
                    value={cvData.personal?.phone || ''}
                    onChange={(value) => updateCvData('personal.phone', value)}
                    placeholder="Số điện thoại"
                  />
                </div>
                <div>
                  <MailOutlined />
                  <EditableText
                    isEditing={isEditing}    
                    value={cvData.personal?.email || ''}
                    onChange={(value) => updateCvData('personal.email', value)}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <EnvironmentOutlined />
                  <EditableText
                    isEditing={isEditing}    
                    value={cvData.personal?.address || ''}
                    onChange={(value) => updateCvData('personal.address', value)}
                    placeholder="Địa chỉ"
                  />
                </div>
              </div>
              <div className={styles.sideBlock}>
                <div className={styles.sideBlockTitle}>
                  CHỨNG CHỈ
                  {isEditing && (
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      size="small"
                      className={styles.editButton}
                      onClick={() => addArrayItem('certificates', 'Chứng chỉ mới')}
                      style={{ float: 'right' }}
                    />
                  )}
                </div>
                {(cvData.certificates || []).map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <EditableText
                      isEditing={isEditing}    
                      value={c}
                      onChange={(value) => {
                        const newCerts = [...(cvData.certificates || [])];
                        newCerts[i] = value;
                        updateCvData('certificates', newCerts);
                      }}
                      placeholder="Tên chứng chỉ"
                    />
                    {isEditing && (
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        size="small"
                        className={styles.editButton}
                        onClick={() => removeArrayItem('certificates', i)}
                        style={{ color: 'red', marginLeft: 8 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.sideBlock}>
                <div className={styles.sideBlockTitle}>
                  NGƯỜI GIỚI THIỆU
                  {isEditing && (
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => addArrayItem('references', {
                        name: 'Tên người giới thiệu',
                        relation: 'Vị trí',
                        company: 'Công ty',
                        phone: 'Số điện thoại'
                      })}
                      style={{ float: 'right' }}
                    />
                  )}
                </div>
                {(cvData.references || []).map((r, i) => (
                  <div key={i} style={{ marginBottom: 8, position: 'relative' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      <EditableText
                        isEditing={isEditing}    
                        value={r.name}
                        onChange={(value) => updateArrayItem('references', i, 'name', value)}
                        placeholder="Tên người giới thiệu"
                      />
                    </div>
                    <div>
                      <EditableText
                        isEditing={isEditing}    
                        value={r.relation}
                        onChange={(value) => updateArrayItem('references', i, 'relation', value)}
                        placeholder="Vị trí"
                      /> tại <EditableText
                        value={r.company}
                        onChange={(value) => updateArrayItem('references', i, 'company', value)}
                        placeholder="Công ty"
                      />
                    </div>
                    <div>
                      SĐT: <EditableText
                        isEditing={isEditing}    
                        value={r.phone}
                        onChange={(value) => updateArrayItem('references', i, 'phone', value)}
                        placeholder="Số điện thoại"
                      />
                    </div>
                    {isEditing && (
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => removeArrayItem('references', i)}
                        style={{ color: 'red', position: 'absolute', top: 0, right: 0 }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.sideBlock}>
                <div className={styles.sideBlockTitle}>
                  DANH HIỆU VÀ GIẢI THƯỞNG
                  {isEditing && (
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => addArrayItem('awards', 'Giải thưởng mới')}
                      style={{ float: 'right' }}
                    />
                  )}
                </div>
                {(cvData.awards || []).map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <EditableText
                      isEditing={isEditing}    
                      value={a}
                      onChange={(value) => {
                        const newAwards = [...(cvData.awards || [])];
                        newAwards[i] = value;
                        updateCvData('awards', newAwards);
                      }}
                      placeholder="Tên giải thưởng"
                    />
                    {isEditing && (
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => removeArrayItem('awards', i)}
                        style={{ color: 'red', marginLeft: 8 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.sideBlock}>
                <div className={styles.sideBlockTitle}>THÔNG TIN THÊM</div>
                <EditableText
                  isEditing={isEditing}    
                  value={cvData.extraInfo || ''}
                  onChange={(value) => updateCvData('extraInfo', value)}
                  multiline={true}
                  placeholder="Thông tin bổ sung..."
                />
              </div>
            </div>
            {/* Cột lớn: Main Info */}
            <div>
              {/*thông tin cá nhân */}
              <div>
                <div className={styles.fullname}>
                  <EditableText
                    value={cvData.fullname || ''}
                    onChange={(value) => updateCvData('fullname', value)}
                    placeholder="Họ và tên"
                  />
                </div>
                <div className={styles.position}>
                  <EditableText
                    isEditing={isEditing}    
                    value={cvData.position || ''}
                    onChange={(value) => updateCvData('position', value)}
                    placeholder="Vị trí ứng tuyển"
                  />
                </div>
                <div className={styles.summary}>
                  <EditableText
                    isEditing={isEditing}    
                    value={cvData.objective || ''}
                    onChange={(value) => updateCvData('objective', value)}
                    multiline={true}
                    placeholder="Mục tiêu nghề nghiệp..."
                  />
                </div>
              </div>
              {/* Học vấn */}
              <div className={styles.cvBlock}>
                <div className={styles.blockTitle}>
                  HỌC VẤN
                  {isEditing && (
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => addArrayItem('education', {
                        period: 'Thời gian',
                        institution: 'Tên trường',
                        major: 'Chuyên ngành',
                        grade: 'Kết quả'
                      })}
                      style={{ float: 'right' }}
                    />
                  )}
                </div>
                {(cvData.education || []).map((e, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                    <div style={{ fontWeight: 'bold' }}>
                      <EditableText
                        isEditing={isEditing}    
                        value={e.institution}
                        onChange={(value) => updateArrayItem('education', i, 'institution', value)}
                        placeholder="Tên trường"
                      />
                    </div>
                    <div>
                      <EditableText
                        isEditing={isEditing}    
                        value={e.major}
                        onChange={(value) => updateArrayItem('education', i, 'major', value)}
                        placeholder="Chuyên ngành"
                      />
                    </div>
                    <div className={styles.blockTime}>
                      <EditableText
                        value={e.period}
                        onChange={(value) => updateArrayItem('education', i, 'period', value)}
                        placeholder="Thời gian học"
                      />
                    </div>
                    <div>
                      <EditableText
                        isEditing={isEditing}    
                        value={e.grade}
                        onChange={(value) => updateArrayItem('education', i, 'grade', value)}
                        placeholder="Kết quả"
                      />
                    </div>
                    {isEditing && (
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => removeArrayItem('education', i)}
                        style={{ color: 'red', position: 'absolute', top: 0, right: 0 }}
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* Kinh nghiệm */}
              <div className={styles.cvBlock}>
                <div className={styles.blockTitle}>
                  KINH NGHIỆM LÀM VIỆC
                  {isEditing && (
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => addArrayItem('experience', {
                        period: 'Thời gian',
                        company: 'Tên công ty',
                        role: 'Vị trí',
                        details: ['Mô tả công việc']
                      })}
                      style={{ float: 'right' }}
                    />
                  )}
                </div>
                {(cvData.experience || []).map((ex, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                    <div style={{ fontWeight: 'bold' }}>
                      <EditableText
                        isEditing={isEditing}    
                        value={ex.company}
                        onChange={(value) => updateArrayItem('experience', i, 'company', value)}
                        placeholder="Tên công ty"
                      />
                    </div>
                    <span className={styles.blockTime}>
                      <EditableText
                        isEditing={isEditing}    
                        value={ex.period}
                        onChange={(value) => updateArrayItem('experience', i, 'period', value)}
                        placeholder="Thời gian làm việc"
                      />
                    </span>
                    <div className={styles.boldText}>
                      <EditableText
                        isEditing={isEditing}    
                        value={ex.role}
                        onChange={(value) => updateArrayItem('experience', i, 'role', value)}
                        placeholder="Vị trí công việc"
                      />
                    </div>
                    <ul className={styles.blockList}>
                      {(ex.details || []).map((d, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center' }}>
                          <EditableText
                            value={d}
                            onChange={(value) => {
                              const newDetails = [...(ex.details || [])];
                              newDetails[j] = value;
                              updateArrayItem('experience', i, 'details', newDetails);
                            }}
                            placeholder="Mô tả công việc"
                          />
                          {isEditing && (
                            <Button
                              type="link"
                              icon={<DeleteOutlined />}
                              size="small"
                              onClick={() => {
                                const newDetails = (ex.details || []).filter((_, index) => index !== j);
                                updateArrayItem('experience', i, 'details', newDetails);
                              }}
                              style={{ color: 'red', marginLeft: 8 }}
                            />
                          )}
                        </li>
                      ))}
                      {isEditing && (
                        <li>
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            size="small"
                            onClick={() => {
                              const newDetails = [...(ex.details || []), 'Mô tả công việc mới'];
                              updateArrayItem('experience', i, 'details', newDetails);
                            }}
                          >
                            Thêm mô tả
                          </Button>
                        </li>
                      )}
                    </ul>
                    {isEditing && (
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => removeArrayItem('experience', i)}
                        style={{ color: 'red', position: 'absolute', top: 0, right: 0 }}
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* Hoạt động */}
              <div className={styles.cvBlock}>
                <div className={styles.blockTitle}>
                  HOẠT ĐỘNG
                  {isEditing && (
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => addArrayItem('activities', {
                        period: 'Thời gian',
                        title: 'Tên hoạt động',
                        details: 'Mô tả hoạt động'
                      })}
                      style={{ float: 'right' }}
                    />
                  )}
                </div>
                {(cvData.activities || []).map((act, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                    <div style={{ fontWeight: 'bold' }}>
                      <EditableText
                        isEditing={isEditing}    
                        value={act.title}
                        onChange={(value) => updateArrayItem('activities', i, 'title', value)}
                        placeholder="Tên hoạt động"
                      />
                    </div>
                    <span className={styles.blockTime}>
                      <EditableText
                        isEditing={isEditing}    
                        value={act.period}
                        onChange={(value) => updateArrayItem('activities', i, 'period', value)}
                        placeholder="Thời gian"
                      />
                    </span>
                    <div>
                      <EditableText
                        isEditing={isEditing}    
                        value={act.details}
                        onChange={(value) => updateArrayItem('activities', i, 'details', value)}
                        multiline={true}
                        placeholder="Mô tả hoạt động"
                      />
                    </div>
                    {isEditing && (
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => removeArrayItem('activities', i)}
                        style={{ color: 'red', position: 'absolute', top: 0, right: 0 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Cột phải: Box tạo CV */}
        <div className={styles.rightCol}>
          <div className={styles.createBox}>
            <div className={styles.createBoxTitle}>Tạo CV của bạn</div>

            {/* Thông tin về CV */}
            <div style={{
              background: "#f6ffed",
              border: "1px solid #b7eb8f",
              borderRadius: 8,
              padding: 16,
              marginBottom: 20
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#52c41a",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                📄 CV chất lượng cao
              </div>
              <div style={{ fontSize: 13, color: "#389e0d", lineHeight: 1.5 }}>
                ✓ Định dạng PDF chuẩn A4<br/>
                ✓ Chất lượng in ấn cao<br/>
                ✓ Tương thích mọi thiết bị<br/>
                ✓ Sẵn sàng nộp hồ sơ
              </div>
            </div>



            {/* Nút tạo CV (xuất PDF) */}
            <Button
              block
              size="large"
              icon={isGeneratingPDF ? <LoadingOutlined /> : <DownloadOutlined />}
              loading={isGeneratingPDF}
              onClick={handleExportPDF}
              disabled={isGeneratingPDF}
              style={{
                height: 50,
                marginBottom: 16,
                background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                borderColor: "#1890ff",
                color: "white",
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)"
              }}
            >
              {isGeneratingPDF ? 'Đang tạo PDF...' : '📄 Tạo CV PDF A4'}
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
