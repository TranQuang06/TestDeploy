import { createJobPost } from "./jobService";

// Sample job data for testing
const sampleJobs = [
  {
    jobTitle: "Frontend Developer (React/Next.js)",
    companyName: "TechViet Solutions",
    companyLogo: null,
    jobDescription:
      "Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm với React và Next.js để tham gia vào đội ngũ phát triển sản phẩm.",
    salary: "15-25 triệu VNĐ",
    location: "Hồ Chí Minh",
    jobType: "Toàn thời gian",
    category: "technology",
    experience: "2-3 năm kinh nghiệm",
    skills: "React, Next.js, JavaScript, TypeScript, CSS, HTML",
    benefits:
      "Lương thưởng hấp dẫn, Bảo hiểm đầy đủ, Laptop công ty, Team building hàng quý",
    contactEmail: "hr@techviet.com",
    expiryDate: new Date("2025-07-15").toISOString(),
    postedBy: "sample-user-1",
    postedByName: "HR TechViet",
    postedByAvatar: null,
  },
  {
    jobTitle: "Marketing Specialist",
    companyName: "Digital Marketing Agency",
    companyLogo: null,
    jobDescription:
      "Vị trí Marketing Specialist với trách nhiệm lập kế hoạch và triển khai các chiến dịch marketing online.",
    salary: "12-18 triệu VNĐ",
    location: "Hà Nội",
    jobType: "Toàn thời gian",
    category: "marketing",
    experience: "1-2 năm kinh nghiệm",
    skills: "Facebook Ads, Google Ads, Content Marketing, SEO",
    benefits:
      "Môi trường trẻ, năng động, Cơ hội thăng tiến, Đào tạo chuyên sâu",
    contactEmail: "jobs@digitalagency.com",
    expiryDate: new Date("2025-07-20").toISOString(),
    postedBy: "sample-user-2",
    postedByName: "Digital Agency HR",
    postedByAvatar: null,
  },
  {
    jobTitle: "UI/UX Designer",
    companyName: "Creative Studio",
    companyLogo: null,
    jobDescription:
      "Tìm kiếm UI/UX Designer có khả năng thiết kế giao diện người dùng và trải nghiệm người dùng cho các ứng dụng web và mobile.",
    salary: "18-28 triệu VNĐ",
    location: "Đà Nẵng",
    jobType: "Toàn thời gian",
    category: "design",
    experience: "2-4 năm kinh nghiệm",
    skills: "Figma, Adobe Creative Suite, Sketch, Prototyping",
    benefits: "Lương cạnh tranh, Môi trường sáng tạo, Flexible working time",
    contactEmail: "design@creativestudio.com",
    expiryDate: new Date("2025-08-01").toISOString(),
    postedBy: "sample-user-3",
    postedByName: "Creative Studio",
    postedByAvatar: null,
  },
];

/**
 * Create sample job posts for testing
 */
export const createSampleJobs = async () => {
  try {
    console.log("🔄 Creating sample job posts...");

    const createdJobs = [];

    for (const jobData of sampleJobs) {
      try {
        const newJob = await createJobPost(jobData);
        createdJobs.push(newJob);
        console.log(`✅ Created job: ${jobData.jobTitle}`);
      } catch (error) {
        console.error(`❌ Error creating job ${jobData.jobTitle}:`, error);
      }
    }

    console.log(`✅ Successfully created ${createdJobs.length} sample jobs`);
    return createdJobs;
  } catch (error) {
    console.error("❌ Error creating sample jobs:", error);
    throw error;
  }
};

/**
 * Run this function in browser console to create sample data
 */
export const runSampleJobCreation = () => {
  createSampleJobs()
    .then((jobs) => {
      console.log("🎉 Sample jobs created successfully:", jobs);
    })
    .catch((error) => {
      console.error("❌ Failed to create sample jobs:", error);
    });
};
