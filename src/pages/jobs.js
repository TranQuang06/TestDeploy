import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function JobsRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Chuyển hướng từ /jobs đến /JobsPage với cùng query params
    const { query } = router;
    const queryString = new URLSearchParams(query).toString();
    router.replace(`/JobsPage${queryString ? `?${queryString}` : ''}`);
  }, [router]);
  
  return <div>Redirecting...</div>;
}
