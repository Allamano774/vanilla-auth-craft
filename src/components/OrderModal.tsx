
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchUserBalance();
      setTargetUrl("");
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
        description: `You need $${service.price.toFixed(2)} but only have $${userBalance.toFixed(2)}. Please add funds to your account.`,
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

      onClose();
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

  if (!service) return null;

  const canAfford = userBalance >= service.price;

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
              <p className="text-lg font-bold text-blue-600">${service.price}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Balance</Label>
            <div className={`p-3 rounded-lg ${canAfford ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`font-medium ${canAfford ? 'text-green-700' : 'text-red-700'}`}>
                ${userBalance.toFixed(2)}
              </p>
              {!canAfford && (
                <p className="text-sm text-red-600 mt-1">
                  Insufficient funds. Need ${(service.price - userBalance).toFixed(2)} more.
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
              {loading ? "Processing..." : `Place Order - $${service.price}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
