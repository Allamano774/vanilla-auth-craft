
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Shield className="w-24 h-24 text-orange-500" />
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel Disabled</h1>
            <p className="text-gray-600">
              The admin functionality has been temporarily disabled. 
              All users now have standard access permissions.
            </p>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminOrders;
