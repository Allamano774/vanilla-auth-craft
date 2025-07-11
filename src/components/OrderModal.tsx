
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Clock, MessageCircle, CheckCircle } from "lucide-react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    platform: string;
    type: string;
    quantity: number;
    price: number;
  } | null;
}

const OrderModal = ({ isOpen, onClose, service }: OrderModalProps) => {
  const [targetUrl, setTargetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchUserBalance();
      setTargetUrl("");
      setOrderPlaced(false);
    }
  }, [isOpen]);

  const fetchUserBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("balance")
          .eq("id", user.id)
          .single();
        
        setUserBalance(Number(data?.balance) || 0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !targetUrl.trim()) return;

    if (userBalance < service.price) {
      toast({
        title: "Insufficient Balance",
        description: `You need KSh ${service.price.toFixed(2)} but only have KSh ${userBalance.toFixed(2)}. Please add funds to your account.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create the order
      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          service_type: service.platform,
          service_name: `${service.platform} ${service.type}`,
          quantity: service.quantity,
          price: service.price,
          target_url: targetUrl.trim(),
          status: "pending",
        });

      if (orderError) throw orderError;

      // Update user balance
      const { error: balanceError } = await supabase
        .from("profiles")
        .update({ balance: userBalance - service.price })
        .eq("id", user.id);

      if (balanceError) throw balanceError;

      toast({
        title: "Order Placed Successfully!",
        description: `Your order for ${service.quantity} ${service.platform} ${service.type} has been placed.`,
      });

      setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOrderPlaced(false);
    onClose();
  };

  if (!service) return null;

  const canAfford = userBalance >= service.price;

  // Show completion timeline after successful order
  if (orderPlaced) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Order Placed Successfully!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your {service.platform} order is being processed
              </h3>
              <p className="text-gray-600">
                {service.quantity} {service.type} for your account
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">⏰ Processing Timeline</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span><strong>Minimum:</strong> 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span><strong>Maximum:</strong> 48 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🤝 Need Help?</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    If your order isn't completed within 48 hours, don't worry! 
                    Our support team is here to help you immediately.
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Contact Support via WhatsApp:</p>
                    <p className="font-mono text-sm font-semibold text-green-700">
                      📱 +254 XXX XXX XXX
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Available 24/7 for immediate assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Got it, Thanks! 🎉
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order {service.platform} {service.type}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service Details</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{service.quantity} {service.platform} {service.type}</p>
              <p className="text-lg font-bold text-blue-600">KSh {service.price}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Balance</Label>
            <div className={`p-3 rounded-lg ${canAfford ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`font-medium ${canAfford ? 'text-green-700' : 'text-red-700'}`}>
                KSh {userBalance.toFixed(2)}
              </p>
              {!canAfford && (
                <p className="text-sm text-red-600 mt-1">
                  Insufficient funds. Need KSh {(service.price - userBalance).toFixed(2)} more.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetUrl">Target URL *</Label>
            <Input
              id="targetUrl"
              type="url"
              placeholder={`Enter your ${service.platform} profile/post URL`}
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !canAfford}
              className="flex-1"
            >
              {loading ? "Processing..." : `Place Order - KSh ${service.price}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
