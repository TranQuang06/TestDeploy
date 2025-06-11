// Dữ liệu mẫu cho các CV templates
export const cvTemplatesData = {
  // Template 1 - Resume Swiss (Minimal)
  1: {
    id: "cv_swiss_01",
    fullname: "Nguyễn Văn An",
    position: "Frontend Developer",
    photo: "/assets/img/creatCV/cv/cv1.png",
    personal: {
      gender: "Nam",
      birthday: "15/03/1995",
      phone: "0987 654 321",
      email: "nguyenvanan.dev@gmail.com",
      address: "Quận 1, TP. Hồ Chí Minh"
    },
    objective: "Là một Frontend Developer với 3 năm kinh nghiệm, tôi mong muốn phát triển sự nghiệp tại một công ty công nghệ hàng đầu để tạo ra những sản phẩm web hiện đại và thân thiện với người dùng.",
    skills: [
      "Thành thạo React.js, Vue.js, Angular",
      "Kinh nghiệm với HTML5, CSS3, JavaScript ES6+",
      "Sử dụng thành thạo Git, Webpack, npm/yarn"
    ],
    certificates: [
      "AWS Certified Developer Associate",
      "Google Analytics Certified",
      "Scrum Master Certification"
    ],
    awards: [
      "Nhân viên xuất sắc năm 2023",
      "Giải Nhất cuộc thi Hackathon FPT 2022"
    ],
    hobbies: [
      "Học các công nghệ web mới",
      "Đóng góp cho các dự án open source"
    ],
    references: [
      {
        name: "Anh Trần Minh Tuấn",
        relation: "Team Lead",
        company: "FPT Software",
        phone: "0912 345 678"
      }
    ],
    education: [
      {
        period: "2017 – 2021",
        institution: "Đại học Bách Khoa TP.HCM",
        major: "Kỹ thuật Phần mềm",
        grade: "Tốt nghiệp loại Giỏi (GPA: 3.6/4.0)"
      }
    ],
    experience: [
      {
        period: "01/2022 – Nay",
        company: "FPT Software",
        role: "Senior Frontend Developer",
        details: [
          "Phát triển và maintain 5+ ứng dụng web React.js",
          "Tối ưu hiệu suất website, giảm 40% thời gian load",
          "Mentor cho 3 junior developers",
          "Collaborate với team UX/UI để implement design system"
        ]
      },
      {
        period: "06/2021 – 12/2021",
        company: "Startup ABC",
        role: "Frontend Developer",
        details: [
          "Xây dựng giao diện web responsive cho platform e-commerce",
          "Tích hợp API và xử lý state management với Redux",
          "Viết unit test với Jest và React Testing Library"
        ]
      }
    ],
    activities: [
      {
        period: "2020 – Nay",
        title: "Volunteer tại CoderDojo Vietnam",
        details: "Dạy lập trình web cơ bản cho trẻ em từ 7-17 tuổi"
      }
    ],
    projects: [
      {
        year: "2023",
        title: "E-commerce Platform",
        description: "Xây dựng platform thương mại điện tử với React.js, Node.js, phục vụ 10,000+ users"
      }
    ],
    extraInfo: "Có khả năng làm việc remote, sẵn sàng học hỏi công nghệ mới và làm việc trong môi trường agile."
  },

  // Template 2 - Resume Creative
  2: {
    id: "cv_creative_02",
    fullname: "Lê Thị Minh Châu",
    position: "UI/UX Designer",
    photo: "/assets/img/creatCV/cv/cv2.png",
    personal: {
      gender: "Nữ",
      birthday: "22/08/1996",
      phone: "0976 543 210",
      email: "minhchau.design@gmail.com",
      address: "Quận Cầu Giấy, Hà Nội"
    },
    objective: "UI/UX Designer sáng tạo với 4 năm kinh nghiệm thiết kế sản phẩm số. Đam mê tạo ra những trải nghiệm người dùng tuyệt vời và giao diện đẹp mắt, thân thiện.",
    skills: [
      "Thành thạo Figma, Adobe XD, Sketch",
      "Kinh nghiệm User Research và Usability Testing",
      "Hiểu biết về HTML/CSS và Design System"
    ],
    certificates: [
      "Google UX Design Certificate",
      "Adobe Certified Expert (ACE)",
      "Interaction Design Foundation Certificate"
    ],
    awards: [
      "Designer of the Year 2023 - Company ABC",
      "Awwwards Site of the Day cho dự án XYZ"
    ],
    hobbies: [
      "Nghiên cứu xu hướng design mới",
      "Chụp ảnh và digital art"
    ],
    references: [
      {
        name: "Chị Nguyễn Thúy Hằng",
        relation: "Design Director",
        company: "VNG Corporation",
        phone: "0908 765 432"
      }
    ],
    education: [
      {
        period: "2018 – 2022",
        institution: "Đại học Mỹ thuật Công nghiệp",
        major: "Thiết kế Đồ họa",
        grade: "Tốt nghiệp loại Khá (GPA: 3.4/4.0)"
      }
    ],
    experience: [
      {
        period: "03/2023 – Nay",
        company: "VNG Corporation",
        role: "Senior UI/UX Designer",
        details: [
          "Lead design cho 3 sản phẩm mobile app với 1M+ users",
          "Thiết kế và maintain design system cho toàn công ty",
          "Conduct user research và usability testing",
          "Collaborate với product team để define product requirements"
        ]
      },
      {
        period: "01/2021 – 02/2023",
        company: "Tiki Corporation",
        role: "UI/UX Designer",
        details: [
          "Thiết kế giao diện cho Tiki mobile app và website",
          "Tăng 25% conversion rate thông qua redesign checkout flow",
          "Tạo prototype và wireframe cho các tính năng mới"
        ]
      }
    ],
    activities: [
      {
        period: "2022 – Nay",
        title: "Mentor tại UX Mastery Vietnam",
        details: "Hướng dẫn và chia sẻ kinh nghiệm cho các designer mới vào nghề"
      }
    ],
    projects: [
      {
        year: "2023",
        title: "Banking Mobile App Redesign",
        description: "Redesign hoàn toàn mobile banking app, cải thiện UX và tăng 30% user satisfaction"
      }
    ],
    extraInfo: "Có khả năng làm việc đa văn hóa, thành thạo tiếng Anh và có kinh nghiệm remote work."
  },

  // Template 3 - Resume Professional
  3: {
    id: "cv_professional_03",
    fullname: "Trần Đức Minh",
    position: "Project Manager",
    photo: "/assets/img/creatCV/cv/cv3.png",
    personal: {
      gender: "Nam",
      birthday: "10/12/1988",
      phone: "0965 432 109",
      email: "tranducminh.pm@gmail.com",
      address: "Quận 7, TP. Hồ Chí Minh"
    },
    objective: "Project Manager giàu kinh nghiệm với 8 năm quản lý các dự án công nghệ thông tin. Chuyên môn trong việc điều phối team, quản lý timeline và đảm bảo chất lượng sản phẩm.",
    skills: [
      "Quản lý dự án Agile/Scrum, Waterfall",
      "Thành thạo Jira, Confluence, MS Project",
      "Kỹ năng leadership và team management xuất sắc"
    ],
    certificates: [
      "PMP (Project Management Professional)",
      "Certified Scrum Master (CSM)",
      "ITIL Foundation Certificate"
    ],
    awards: [
      "Project Manager of the Year 2022",
      "Successfully delivered 15+ projects on time and budget"
    ],
    hobbies: [
      "Đọc sách về leadership và management",
      "Chơi golf và networking"
    ],
    references: [
      {
        name: "Ông Lê Văn Thành",
        relation: "Director of Engineering",
        company: "Viettel Solutions",
        phone: "0901 234 567"
      }
    ],
    education: [
      {
        period: "2010 – 2014",
        institution: "Đại học Bách Khoa Hà Nội",
        major: "Quản trị Kinh doanh",
        grade: "Tốt nghiệp loại Giỏi (GPA: 3.7/4.0)"
      }
    ],
    experience: [
      {
        period: "01/2020 – Nay",
        company: "Viettel Solutions",
        role: "Senior Project Manager",
        details: [
          "Quản lý portfolio 5+ dự án với budget tổng cộng $2M+",
          "Lead cross-functional team 20+ members",
          "Đạt 98% on-time delivery rate trong 3 năm liên tiếp",
          "Implement Agile methodology, tăng 40% productivity"
        ]
      },
      {
        period: "06/2016 – 12/2019",
        company: "FPT Software",
        role: "Project Manager",
        details: [
          "Quản lý các dự án outsourcing cho khách hàng Nhật Bản",
          "Coordinate với offshore team và onsite team",
          "Đảm bảo quality và timeline theo yêu cầu khách hàng"
        ]
      }
    ],
    activities: [
      {
        period: "2019 – Nay",
        title: "Speaker tại PMI Vietnam Chapter",
        details: "Chia sẻ kinh nghiệm quản lý dự án và best practices trong industry"
      }
    ],
    projects: [
      {
        year: "2023",
        title: "Digital Transformation Project",
        description: "Lead dự án chuyển đổi số cho tập đoàn lớn, impact 10,000+ employees"
      }
    ],
    extraInfo: "Có kinh nghiệm làm việc với khách hàng quốc tế, thành thạo tiếng Anh và tiếng Nhật cơ bản."
  },

  // Template 4 - Resume Modern
  4: {
    id: "cv_modern_04",
    fullname: "Phạm Thị Hương",
    position: "Digital Marketing Manager",
    photo: "/assets/img/creatCV/cv/cv4.png",
    personal: {
      gender: "Nữ",
      birthday: "05/07/1992",
      phone: "0934 567 890",
      email: "phamhuong.marketing@gmail.com",
      address: "Quận Ba Đình, Hà Nội"
    },
    objective: "Digital Marketing Manager với 6 năm kinh nghiệm trong việc xây dựng và thực hiện các chiến lược marketing online. Chuyên môn về SEO, SEM, Social Media và Content Marketing.",
    skills: [
      "Google Ads, Facebook Ads, LinkedIn Ads",
      "SEO/SEM, Google Analytics, Google Tag Manager",
      "Content Marketing và Social Media Strategy"
    ],
    certificates: [
      "Google Ads Certified",
      "Facebook Blueprint Certification",
      "HubSpot Content Marketing Certification"
    ],
    awards: [
      "Marketing Campaign of the Year 2023",
      "Tăng 150% ROI cho chiến dịch digital marketing"
    ],
    hobbies: [
      "Nghiên cứu xu hướng marketing mới",
      "Viết blog về digital marketing"
    ],
    references: [
      {
        name: "Anh Nguyễn Hoàng Nam",
        relation: "Marketing Director",
        company: "Shopee Vietnam",
        phone: "0918 765 432"
      }
    ],
    education: [
      {
        period: "2014 – 2018",
        institution: "Đại học Ngoại Thương",
        major: "Marketing",
        grade: "Tốt nghiệp loại Giỏi (GPA: 3.8/4.0)"
      }
    ],
    experience: [
      {
        period: "02/2021 – Nay",
        company: "Shopee Vietnam",
        role: "Senior Digital Marketing Manager",
        details: [
          "Quản lý budget marketing 500K USD/tháng",
          "Lead team 8 marketing specialists",
          "Tăng 200% organic traffic thông qua SEO strategy",
          "Phát triển content strategy cho 5+ social platforms"
        ]
      },
      {
        period: "08/2018 – 01/2021",
        company: "Tiki Corporation",
        role: "Digital Marketing Specialist",
        details: [
          "Quản lý Google Ads và Facebook Ads campaigns",
          "Tối ưu conversion rate, giảm 30% cost per acquisition",
          "Phân tích data và báo cáo performance hàng tuần"
        ]
      }
    ],
    activities: [
      {
        period: "2020 – Nay",
        title: "Speaker tại Digital Marketing Summit",
        details: "Chia sẻ kinh nghiệm về performance marketing và growth hacking"
      }
    ],
    projects: [
      {
        year: "2023",
        title: "Omnichannel Marketing Campaign",
        description: "Thiết kế và thực hiện chiến dịch marketing đa kênh, đạt 5M+ impressions"
      }
    ],
    extraInfo: "Có khả năng làm việc trong môi trường áp lực cao, thành thạo tiếng Anh và có kinh nghiệm quản lý team đa quốc gia."
  },

  // Template 5 - Resume Clean
  5: {
    id: "cv_clean_05",
    fullname: "Hoàng Văn Đức",
    position: "Data Analyst",
    photo: "/assets/img/creatCV/cv/cv5.png",
    personal: {
      gender: "Nam",
      birthday: "18/11/1994",
      phone: "0945 678 901",
      email: "hoangduc.data@gmail.com",
      address: "Quận Thanh Xuân, Hà Nội"
    },
    objective: "Data Analyst với 4 năm kinh nghiệm trong việc phân tích dữ liệu và xây dựng dashboard. Đam mê khám phá insights từ data để hỗ trợ ra quyết định kinh doanh.",
    skills: [
      "Python, R, SQL, Excel advanced",
      "Tableau, Power BI, Google Data Studio",
      "Machine Learning cơ bản và Statistical Analysis"
    ],
    certificates: [
      "Google Data Analytics Certificate",
      "Tableau Desktop Specialist",
      "Microsoft Power BI Data Analyst Associate"
    ],
    awards: [
      "Best Data Insight Award 2023",
      "Phát hiện insight giúp công ty tiết kiệm 200K USD/năm"
    ],
    hobbies: [
      "Kaggle competitions",
      "Học machine learning và AI"
    ],
    references: [
      {
        name: "Chị Lê Thị Mai",
        relation: "Head of Data Science",
        company: "VinGroup",
        phone: "0907 654 321"
      }
    ],
    education: [
      {
        period: "2016 – 2020",
        institution: "Đại học Kinh tế Quốc dân",
        major: "Thống kê Kinh tế",
        grade: "Tốt nghiệp loại Giỏi (GPA: 3.6/4.0)"
      }
    ],
    experience: [
      {
        period: "06/2022 – Nay",
        company: "VinGroup",
        role: "Senior Data Analyst",
        details: [
          "Phân tích dữ liệu khách hàng cho 10+ brands trong tập đoàn",
          "Xây dựng automated reporting system với Python",
          "Tạo dashboard real-time cho C-level executives",
          "Collaborate với product team để optimize user experience"
        ]
      },
      {
        period: "01/2020 – 05/2022",
        company: "Grab Vietnam",
        role: "Data Analyst",
        details: [
          "Phân tích behavior của driver và passenger",
          "A/B testing cho các tính năng mới của app",
          "Xây dựng predictive model để forecast demand"
        ]
      }
    ],
    activities: [
      {
        period: "2021 – Nay",
        title: "Mentor tại DataCamp Vietnam",
        details: "Hướng dẫn các bạn mới học về data analysis và visualization"
      }
    ],
    projects: [
      {
        year: "2023",
        title: "Customer Segmentation & Recommendation System",
        description: "Xây dựng hệ thống phân khúc khách hàng và gợi ý sản phẩm, tăng 25% revenue"
      }
    ],
    extraInfo: "Có khả năng làm việc với big data, thành thạo cloud platforms (AWS, GCP) và có kinh nghiệm present insights cho stakeholders."
  },

  // Template 6 - Resume Executive (cho các template khác, sử dụng lại dữ liệu với một số thay đổi)
  6: {
    id: "cv_executive_06",
    fullname: "Nguyễn Thị Lan Anh",
    position: "HR Manager",
    photo: "/assets/img/creatCV/cv/cv6.png",
    personal: {
      gender: "Nữ",
      birthday: "12/04/1990",
      phone: "0923 456 789",
      email: "lananh.hr@gmail.com",
      address: "Quận Đống Đa, Hà Nội"
    },
    objective: "HR Manager với 7 năm kinh nghiệm trong việc xây dựng và phát triển đội ngũ nhân sự. Chuyên môn về recruitment, training và employee engagement.",
    skills: [
      "Recruitment và Talent Acquisition",
      "Training & Development, Performance Management",
      "HR Analytics và HRIS systems"
    ],
    certificates: [
      "SHRM Certified Professional (SHRM-CP)",
      "Professional in Human Resources (PHR)",
      "Certified Training Professional (CTP)"
    ],
    awards: [
      "HR Excellence Award 2023",
      "Best Employer Branding Campaign 2022"
    ],
    hobbies: [
      "Đọc sách về psychology và leadership",
      "Tham gia các workshop về HR trends"
    ],
    references: [
      {
        name: "Bà Phạm Thị Hoa",
        relation: "HR Director",
        company: "Samsung Vietnam",
        phone: "0915 678 901"
      }
    ],
    education: [
      {
        period: "2012 – 2016",
        institution: "Đại học Kinh tế Quốc dân",
        major: "Quản trị Nhân lực",
        grade: "Tốt nghiệp loại Giỏi (GPA: 3.7/4.0)"
      }
    ],
    experience: [
      {
        period: "01/2021 – Nay",
        company: "Samsung Vietnam",
        role: "Senior HR Manager",
        details: [
          "Quản lý toàn bộ hoạt động HR cho 500+ nhân viên",
          "Xây dựng employer branding strategy",
          "Giảm 30% turnover rate thông qua employee engagement programs",
          "Lead digital transformation cho HR processes"
        ]
      }
    ],
    activities: [
      {
        period: "2020 – Nay",
        title: "Board Member tại HR Association Vietnam",
        details: "Tham gia xây dựng standards và best practices cho ngành HR"
      }
    ],
    projects: [
      {
        year: "2023",
        title: "Digital HR Transformation",
        description: "Lead dự án chuyển đổi số cho toàn bộ quy trình HR, tăng 50% efficiency"
      }
    ],
    extraInfo: "Có kinh nghiệm quản lý đa văn hóa, thành thạo tiếng Anh và Hàn Quốc cơ bản."
  }
};

// Mapping cho các template ID khác (sử dụng lại dữ liệu có sẵn)
const templateMapping = {
  7: 1, // Software Engineer -> Frontend Developer
  8: 5, // Financial Analyst -> Data Analyst
  9: 2, // Content Writer -> UI/UX Designer
  10: 3, // Operations Manager -> Project Manager
  11: 4, // Digital Marketer -> Digital Marketing Manager
  12: 5, // Business Analyst -> Data Analyst
};

// Function để lấy dữ liệu CV theo template ID
export const getCVDataByTemplate = (templateId) => {
  const id = parseInt(templateId);

  // Nếu có dữ liệu trực tiếp cho template ID
  if (cvTemplatesData[id]) {
    return cvTemplatesData[id];
  }

  // Nếu không có, sử dụng mapping
  if (templateMapping[id]) {
    const mappedData = cvTemplatesData[templateMapping[id]];
    // Clone và cập nhật một số thông tin để phù hợp với template
    return {
      ...mappedData,
      id: `cv_template_${id}`,
      photo: `/assets/img/creatCV/cv/cv${id}.png`
    };
  }

  // Default fallback
  return cvTemplatesData[1];
};

// Function để lấy tất cả template IDs
export const getAllTemplateIds = () => {
  return Object.keys(cvTemplatesData);
};
