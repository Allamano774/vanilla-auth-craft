import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type Order = Tables<"orders">;

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh orders every 30 seconds
    const interval = setInterval(() => {
      console.log("Auto-refreshing orders...");
      setRefreshing(true);
      fetchOrders().then(() => {
        setRefreshing(false);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);

      if (!user) {
        console.log("No user found");
        toast({
          title: "Authentication required",
          description: "Please log in to view your orders",
          variant: "destructive",
        });
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Orders query result:", { data, error });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      
      console.log("Successfully fetched orders:", data?.length || 0);
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    toast({
      title: "Orders Refreshed",
      description: "Your order history has been updated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Your order has been received and is awaiting approval";
      case "approved":
        return "Your order has been approved and is being processed";
      case "completed":
        return "Your order has been completed successfully";
      case "cancelled":
        return "Your order has been cancelled";
      default:
        return "Order status unknown";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600">Track your service orders: Pending → Approved → Completed</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshOrders}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {refreshing && (
          <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Checking for order updates...
          </div>
        )}

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-gray-500 text-lg mb-2">No orders found</p>
              <p className="text-gray-400 text-sm">Your orders will appear here once you make a purchase</p>
              <Button 
                variant="outline" 
                onClick={handleRefreshOrders}
                className="mt-4"
                disabled={refreshing}
              >
                {refreshing ? "Checking..." : "Check for Orders"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{order.service_name}</CardTitle>
                      <p className="text-sm text-gray-600">{order.service_type}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status || "pending")}>
                        {(order.status || "pending").toUpperCase()}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {getStatusDescription(order.status || "pending")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Quantity</p>
                      <p className="text-lg">{order.quantity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Price</p>
                      <p className="text-lg font-semibold">KES {Number(order.price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Target URL</p>
                    <p className="text-sm text-gray-600 break-all">{order.target_url}</p>
                  </div>
                  
                  {/* Status timeline for pending/approved orders */}
                  {(order.status === "pending" || order.status === "approved") && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {order.status === "pending" 
                            ? "⏳ Awaiting approval - We'll start processing soon!"
                            : "🔄 Processing your order - Expected completion: 24-48 hours"
                          }
                        </span>
                      </div>
                      {order.status === "approved" && (
                        <p className="text-xs text-blue-600 mt-2">
                          Need help? Contact support at +254 785 760 507 if not completed within 48 hours
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
