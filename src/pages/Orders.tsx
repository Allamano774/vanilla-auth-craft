
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Clock, MessageCircle } from "lucide-react";
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

  const WhatsAppIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.515"/>
    </svg>
  );

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

        {/* WhatsApp Support Notice */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WhatsAppIcon />
                <div>
                  <h3 className="font-semibold text-green-800">Order Taking Too Long?</h3>
                  <p className="text-sm text-green-700">Contact our 24/7 support team directly on WhatsApp</p>
                </div>
              </div>
              <a
                href="https://wa.me/254785760507?text=Hello%20NeuroTech%20Gains,%20I%20need%20help%20with%20my%20order.%20It%20seems%20to%20be%20taking%20longer%20than%20expected."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <WhatsAppIcon />
                Chat Now
              </a>
            </div>
          </CardContent>
        </Card>

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
                        <div className="mt-2 space-y-2">
                          <p className="text-xs text-blue-600">
                            Need help? Contact support at +254 785 760 507 if not completed within 48 hours
                          </p>
                          <a
                            href={`https://wa.me/254785760507?text=Hello%20NeuroTech%20Gains,%20my%20order%20for%20${encodeURIComponent(order.service_name)}%20is%20taking%20longer%20than%20expected.%20Order%20placed%20on%20${encodeURIComponent(new Date(order.created_at || "").toLocaleDateString())}.%20Please%20help.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
                          >
                            <WhatsAppIcon />
                            WhatsApp Support
                          </a>
                        </div>
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
