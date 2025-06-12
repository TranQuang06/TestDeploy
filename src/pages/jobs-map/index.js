import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function JobsMapRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Chuyển hướng từ /jobs-map đến /JobsMapPage với cùng query params
    const { query } = router;
    const queryString = new URLSearchParams(query).toString();
    router.replace(`/JobsMapPage${queryString ? `?${queryString}` : ''}`);
  }, [router]);
  
  return <div>Redirecting to jobs map...</div>;
}