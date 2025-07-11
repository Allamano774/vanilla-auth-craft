
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Shield } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  // Since admin roles have been removed, redirect all users to dashboard
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Shield className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">Admin Access Disabled</h1>
        <p className="text-gray-600 text-center max-w-md">
          The admin functionality has been temporarily disabled. 
          Redirecting to dashboard...
        </p>
      </div>
      <Navigate to="/dashboard" replace />
    </div>
  );
};

export default AdminRoute;
