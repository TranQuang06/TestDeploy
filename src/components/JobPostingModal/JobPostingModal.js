import React, { useState } from "react";
import {
  Modal,
  message,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Form,
} from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { createJobPost } from "../../utils/jobService";
import styles from "./JobPostingModal.module.css";
import {
  AiOutlineClose,
  AiOutlineDollar,
  AiOutlineEnvironment,
  AiOutlineClockCircle,
  AiOutlineTeam,
  AiOutlineFileText,
  AiOutlineUser,
} from "react-icons/ai";

const { Option } = Select;
const { TextArea } = Input;

const JobPostingModal = ({ isOpen, onClose, onJobPosted }) => {
  const { user, userProfile } = useAuth();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Job types options
  const jobTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "intern", label: "Intern/Thực tập" },
    { value: "contract", label: "Contract/Hợp đồng" },
    { value: "freelance", label: "Freelance" },
    { value: "remote", label: "Remote" },
  ];

  // Experience levels
  const experienceLevels = [
    { value: "entry", label: "Entry Level/Fresher" },
    { value: "junior", label: "Junior (1-2 năm)" },
    { value: "middle", label: "Middle (2-5 năm)" },
    { value: "senior", label: "Senior (5+ năm)" },
    { value: "lead", label: "Lead/Manager" },
  ];

  // Job categories
  const jobCategories = [
    { value: "technology", label: "Công nghệ thông tin" },
    { value: "marketing", label: "Marketing" },
    { value: "finance", label: "Tài chính" },
    { value: "sales", label: "Bán hàng" },
    { value: "hr", label: "Nhân sự" },
    { value: "design", label: "Thiết kế" },
    { value: "education", label: "Giáo dục" },
    { value: "healthcare", label: "Y tế" },
    { value: "manufacturing", label: "Sản xuất" },
    { value: "other", label: "Khác" },
  ];

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const jobData = {
        ...values,
        postedBy: user.uid,
        postedByName: getUserDisplayName(),
        postedByAvatar: getUserAvatar(),
        status: "active",
        applicationCount: 0,
        createdAt: new Date().toISOString(),
        expiryDate: values.expiryDate?.toISOString(),
      };

      console.log("📋 Job posting data:", jobData);

      const newJob = await createJobPost(jobData);
      console.log("✅ Job posted successfully:", newJob);

      message.success("Đăng tin tuyển dụng thành công!");
      form.resetFields();
      onClose();

      if (onJobPosted) {
        onJobPosted(newJob);
      }
    } catch (error) {
      console.error("❌ Error posting job:", error);
      message.error("Có lỗi xảy ra khi đăng tin. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    if (userProfile?.displayName) {
      return userProfile.displayName;
    }
    return user?.displayName || user?.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    return userProfile?.avatar || user?.photoURL || null;
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className={styles.modalHeader}>
          <AiOutlineFileText className={styles.titleIcon} />
          <span>Đăng tin tuyển dụng</span>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className={styles.jobPostingModal}
    >
      <div className={styles.modalContent}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.jobForm}
        >
          {/* Basic Job Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <AiOutlineFileText />
              Thông tin cơ bản
            </h3>

            <Form.Item
              name="jobTitle"
              label="Vị trí tuyển dụng"
              rules={[
                { required: true, message: "Vui lòng nhập vị trí tuyển dụng!" },
              ]}
            >
              <Input
                placeholder="Ví dụ: Frontend Developer, Marketing Manager..."
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="companyName"
              label="Tên công ty"
              rules={[
                { required: true, message: "Vui lòng nhập tên công ty!" },
              ]}
            >
              <Input
                placeholder="Tên công ty của bạn"
                size="large"
                prefix={<AiOutlineUser />}
              />
            </Form.Item>

            <div className={styles.rowFields}>
              <Form.Item
                name="jobType"
                label="Loại công việc"
                rules={[
                  { required: true, message: "Vui lòng chọn loại công việc!" },
                ]}
                className={styles.halfField}
              >
                <Select placeholder="Chọn loại công việc" size="large">
                  {jobTypes.map((type) => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="category"
                label="Lĩnh vực"
                rules={[{ required: true, message: "Vui lòng chọn lĩnh vực!" }]}
                className={styles.halfField}
              >
                <Select placeholder="Chọn lĩnh vực" size="large">
                  {jobCategories.map((category) => (
                    <Option key={category.value} value={category.value}>
                      {category.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Salary and Experience */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <AiOutlineDollar />
              Mức lương & Kinh nghiệm
            </h3>

            <div className={styles.rowFields}>
              <Form.Item
                name="salaryMin"
                label="Mức lương tối thiểu (triệu VNĐ)"
                className={styles.halfField}
              >
                <InputNumber
                  placeholder="Ví dụ: 10"
                  min={0}
                  max={1000}
                  size="large"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                name="salaryMax"
                label="Mức lương tối đa (triệu VNĐ)"
                className={styles.halfField}
              >
                <InputNumber
                  placeholder="Ví dụ: 20"
                  min={0}
                  max={1000}
                  size="large"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>

            <Form.Item name="salaryNegotiable" label="Lương thỏa thuận">
              <Select placeholder="Có thể thỏa thuận?" size="large">
                <Option value={true}>Có thể thỏa thuận</Option>
                <Option value={false}>Mức lương cố định</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="experienceLevel"
              label="Yêu cầu kinh nghiệm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn yêu cầu kinh nghiệm!",
                },
              ]}
            >
              <Select placeholder="Chọn yêu cầu kinh nghiệm" size="large">
                {experienceLevels.map((level) => (
                  <Option key={level.value} value={level.value}>
                    {level.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Location and Details */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <AiOutlineEnvironment />
              Địa điểm & Chi tiết
            </h3>

            <Form.Item
              name="location"
              label="Địa điểm làm việc"
              rules={[
                { required: true, message: "Vui lòng nhập địa điểm làm việc!" },
              ]}
            >
              <Input
                placeholder="Ví dụ: Hà Nội, TP.HCM, Remote..."
                size="large"
                prefix={<AiOutlineEnvironment />}
              />
            </Form.Item>

            <Form.Item
              name="jobDescription"
              label="Mô tả công việc"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả công việc!" },
              ]}
            >
              <TextArea
                placeholder="Mô tả chi tiết về công việc, trách nhiệm, yêu cầu..."
                rows={6}
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Form.Item name="requirements" label="Yêu cầu ứng viên">
              <TextArea
                placeholder="Các yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                rows={4}
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item name="benefits" label="Quyền lợi">
              <TextArea
                placeholder="Các quyền lợi, phúc lợi cho ứng viên..."
                rows={3}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </div>

          {/* Contact and Expiry */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <AiOutlineClockCircle />
              Thông tin liên hệ
            </h3>

            <div className={styles.rowFields}>
              <Form.Item
                name="contactEmail"
                label="Email liên hệ"
                rules={[
                  { required: true, message: "Vui lòng nhập email liên hệ!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
                className={styles.halfField}
              >
                <Input placeholder="hr@company.com" size="large" />
              </Form.Item>

              <Form.Item
                name="contactPhone"
                label="Số điện thoại (không bắt buộc)"
                className={styles.halfField}
              >
                <Input placeholder="0123456789" size="large" />
              </Form.Item>
            </div>

            <Form.Item
              name="expiryDate"
              label="Hạn nộp hồ sơ"
              rules={[
                { required: true, message: "Vui lòng chọn hạn nộp hồ sơ!" },
              ]}
            >
              <DatePicker
                placeholder="Chọn ngày hết hạn"
                size="large"
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current.valueOf() < Date.now()
                }
              />
            </Form.Item>
          </div>

          {/* Submit Buttons */}
          <div className={styles.formActions}>
            <Button
              onClick={handleCancel}
              size="large"
              className={styles.cancelBtn}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              size="large"
              className={styles.submitBtn}
            >
              {isSubmitting ? "Đang đăng tin..." : "Đăng tin tuyển dụng"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default JobPostingModal;
