import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Collection name
const JOBS_COLLECTION = "jobs";

/**
 * Create a new job posting
 * @param {Object} jobData - The job data to create
 * @returns {Promise<Object>} The created job with ID
 */
export const createJobPost = async (jobData) => {
  try {
    console.log("🔄 Creating job post...", jobData);

    const jobToCreate = {
      ...jobData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "active",
      applicationCount: 0,
      viewCount: 0,
      featured: false,
    };

    const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobToCreate);

    console.log("✅ Job post created successfully with ID:", docRef.id);

    return {
      id: docRef.id,
      ...jobToCreate,
    };
  } catch (error) {
    console.error("❌ Error creating job post:", error);
    throw error;
  }
};

/**
 * Get all job postings with filters
 * @param {Object} filters - Filters to apply
 * @returns {Promise<Array>} Array of job postings
 */
export const getJobPosts = async (filters = {}) => {
  try {
    console.log("🔄 Fetching job posts with filters:", filters);

    let q = collection(db, JOBS_COLLECTION);
    const constraints = [];

    // Apply filters
    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }

    if (filters.jobType) {
      constraints.push(where("jobType", "==", filters.jobType));
    }

    if (filters.category) {
      constraints.push(where("category", "==", filters.category));
    }

    if (filters.location) {
      constraints.push(where("location", "==", filters.location));
    }

    if (filters.postedBy) {
      constraints.push(where("postedBy", "==", filters.postedBy));
    }

    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    // Create query with constraints if any
    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const querySnapshot = await getDocs(q);
    const jobs = [];

    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`✅ Fetched ${jobs.length} job posts`);
    return jobs;
  } catch (error) {
    console.error("❌ Error fetching job posts:", error);
    throw error;
  }
};

/**
 * Get a single job posting by ID
 * @param {string} jobId - The job ID
 * @returns {Promise<Object>} The job posting
 */
export const getJobPost = async (jobId) => {
  try {
    console.log("🔄 Fetching job post:", jobId);

    const docRef = doc(db, JOBS_COLLECTION, jobId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Job post not found");
    }

    const job = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    console.log("✅ Job post fetched successfully");
    return job;
  } catch (error) {
    console.error("❌ Error fetching job post:", error);
    throw error;
  }
};

/**
 * Update a job posting
 * @param {string} jobId - The job ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export const updateJobPost = async (jobId, updateData) => {
  try {
    console.log("🔄 Updating job post:", jobId, updateData);

    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Job post updated successfully");
  } catch (error) {
    console.error("❌ Error updating job post:", error);
    throw error;
  }
};

/**
 * Delete a job posting
 * @param {string} jobId - The job ID
 * @returns {Promise<void>}
 */
export const deleteJobPost = async (jobId) => {
  try {
    console.log("🔄 Deleting job post:", jobId);

    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await deleteDoc(docRef);

    console.log("✅ Job post deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting job post:", error);
    throw error;
  }
};

/**
 * Search job postings
 * @param {string} searchTerm - The search term
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} Array of matching job postings
 */
export const searchJobPosts = async (searchTerm, filters = {}) => {
  try {
    console.log("🔄 Searching job posts:", searchTerm, filters);

    // For now, we'll get all jobs and filter client-side
    // In production, you might want to use Algolia or another search service
    const allJobs = await getJobPosts(filters);

    if (!searchTerm) {
      return allJobs;
    }

    const searchResults = allJobs.filter((job) => {
      const searchFields = [
        job.jobTitle,
        job.companyName,
        job.jobDescription,
        job.requirements,
        job.location,
      ]
        .join(" ")
        .toLowerCase();

      return searchFields.includes(searchTerm.toLowerCase());
    });

    console.log(`✅ Found ${searchResults.length} matching job posts`);
    return searchResults;
  } catch (error) {
    console.error("❌ Error searching job posts:", error);
    throw error;
  }
};

/**
 * Increment view count for a job posting
 * @param {string} jobId - The job ID
 * @returns {Promise<void>}
 */
export const incrementJobViewCount = async (jobId) => {
  try {
    console.log("🔄 Incrementing view count for job:", jobId);

    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(docRef, {
      viewCount: increment(1),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ View count incremented successfully");
  } catch (error) {
    console.error("❌ Error incrementing view count:", error);
    throw error;
  }
};

/**
 * Increment application count for a job posting
 * @param {string} jobId - The job ID
 * @returns {Promise<void>}
 */
export const incrementJobApplicationCount = async (jobId) => {
  try {
    console.log("🔄 Incrementing application count for job:", jobId);

    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(docRef, {
      applicationCount: increment(1),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Application count incremented successfully");
  } catch (error) {
    console.error("❌ Error incrementing application count:", error);
    throw error;
  }
};

/**
 * Get job postings by user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of user's job postings
 */
export const getJobPostsByUser = async (userId) => {
  try {
    console.log("🔄 Fetching job posts by user:", userId);

    const q = query(
      collection(db, JOBS_COLLECTION),
      where("postedBy", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const jobs = [];

    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`✅ Fetched ${jobs.length} job posts by user`);
    return jobs;
  } catch (error) {
    console.error("❌ Error fetching job posts by user:", error);
    throw error;
  }
};

/**
 * Get featured job postings
 * @param {number} limitCount - Number of featured jobs to get
 * @returns {Promise<Array>} Array of featured job postings
 */
export const getFeaturedJobPosts = async (limitCount = 10) => {
  try {
    console.log("🔄 Fetching featured job posts");

    const q = query(
      collection(db, JOBS_COLLECTION),
      where("featured", "==", true),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const jobs = [];

    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`✅ Fetched ${jobs.length} featured job posts`);
    return jobs;
  } catch (error) {
    console.error("❌ Error fetching featured job posts:", error);
    throw error;
  }
};

/**
 * Toggle featured status of a job posting
 * @param {string} jobId - The job ID
 * @param {boolean} featured - Whether to feature the job
 * @returns {Promise<void>}
 */
export const toggleJobFeatured = async (jobId, featured = true) => {
  try {
    console.log("🔄 Toggling featured status for job:", jobId, featured);

    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(docRef, {
      featured,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Featured status toggled successfully");
  } catch (error) {
    console.error("❌ Error toggling featured status:", error);
    throw error;
  }
};
