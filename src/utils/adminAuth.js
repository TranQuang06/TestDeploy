import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAdminCheck } from "../hooks/useAdminCheck";

export const withAdminAuth = (WrappedComponent) => {
  return function AdminProtectedComponent(props) {
    const router = useRouter();
    const { isAdmin, isChecking, user } = useAdminCheck();

    useEffect(() => {
      if (!isChecking) {
        if (!user) {
          router.push("/SignIn");
        } else if (!isAdmin) {
          router.push("/Admin"); // Redirect to admin page for setup
        }
      }
    }, [isAdmin, isChecking, user, router]);

    // Show loading while checking
    if (isChecking) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>Checking admin permissions...</div>
        </div>
      );
    }

    // Don't render if not admin
    if (!user || !isAdmin) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

// Alternative hook-based approach
export const useRequireAdmin = () => {
  const router = useRouter();
  const { isAdmin, isChecking, user } = useAdminCheck();

  useEffect(() => {
    if (!isChecking) {
      if (!user) {
        router.push("/SignIn");
      } else if (!isAdmin) {
        router.push("/Admin");
      }
    }
  }, [isAdmin, isChecking, user, router]);

  return { isAdmin, isChecking, user };
};
