
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/Layout/DashboardLayout";

// Declare PaystackPop for TypeScript
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const { toast } = useToast();

  // Load Paystack script dynamically
  useEffect(() => {
    const loadPaystack = () => {
      if (window.PaystackPop) {
        setPaystackLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => {
        console.log('Paystack script loaded successfully');
        setPaystackLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Paystack script');
        toast({
          title: "Payment System Error",
          description: "Failed to load payment system. Please refresh the page and try again.",
          variant: "destructive",
        });
      };
      document.head.appendChild(script);
    };

    loadPaystack();
  }, [toast]);

  const paymentMethods = [
    { id: "mpesa", name: "M-Pesa (Paystack)", icon: Smartphone, description: "Pay with M-Pesa via Paystack" },
    { id: "paypal", name: "PayPal", icon: CreditCard, description: "International payments (Coming Soon)" },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, MasterCard (Coming Soon)" },
  ];

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const payWithPaystack = async (depositAmount: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!window.PaystackPop) {
        reject(new Error("Paystack not loaded. Please refresh the page and try again."));
        return;
      }

      if (!paystackLoaded) {
        reject(new Error("Payment system is still loading. Please wait a moment and try again."));
        return;
      }

      const ref = 'DEPOSIT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      console.log("Initiating Paystack payment:", {
        amount: depositAmount,
        amountInCents: depositAmount * 100,
        reference: ref
      });

      try {
        const handler = window.PaystackPop.setup({
          key: 'pk_live_c8d72323ec70238b1fb7ce3d5a42494560fbe815', 
          email: 'customer@example.com', // In production, use actual user email
          amount: depositAmount * 100, // Convert to cents (Paystack expects amount in kobo/cents)
          currency: 'KES',
          ref: ref,
          label: "Account Deposit",
          callback: function(response: any) {
            console.log("Paystack payment successful:", response);
            toast({
              title: "Payment Successful!",
              description: `M-Pesa payment completed. Reference: ${response.reference}`,
            });
            resolve(true);
          },
          onClose: function() {
            console.log("Paystack payment popup closed");
            reject(new Error("Payment was cancelled. Please try again."));
          }
        });
        
        handler.openIframe();
      } catch (error) {
        console.error("Error opening Paystack iframe:", error);
        reject(new Error("Failed to open payment popup. Please try again."));
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);

    if (!depositAmount || depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (depositAmount < 5) {
      toast({
        title: "Minimum Deposit",
        description: "Minimum deposit amount is $5.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let paymentSuccess = false;

      // Handle M-Pesa payment via Paystack
      if (paymentMethod === "mpesa") {
        if (!paystackLoaded) {
          throw new Error("Payment system is still loading. Please wait a moment and try again.");
        }

        try {
          paymentSuccess = await payWithPaystack(depositAmount);
        } catch (error) {
          console.error("M-Pesa payment error:", error);
          const errorMessage = error instanceof Error ? error.message : "Payment failed. Please try again.";
          toast({
            title: "Payment Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
      } else {
        // For other payment methods, show that they're not implemented yet
        toast({
          title: "Payment Method Not Available",
          description: `${paymentMethods.find(m => m.id === paymentMethod)?.name} is coming soon. Please use M-Pesa for now.`,
          variant: "destructive",
        });
        return;
      }

      if (paymentSuccess) {
        console.log("Processing successful payment for amount:", depositAmount);

        // Create deposit record
        const { error: depositError } = await supabase
          .from("deposits")
          .insert({
            user_id: user.id,
            amount: depositAmount,
            payment_method: paymentMethod,
            status: "completed",
          });

        if (depositError) {
          console.error("Error creating deposit record:", depositError);
          throw new Error("Failed to record deposit. Please contact support with your payment reference.");
        }

        // Get current balance
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("balance")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw new Error("Failed to update balance. Please contact support with your payment reference.");
        }

        const currentBalance = Number(profile?.balance) || 0;
        const newBalance = currentBalance + depositAmount;

        // Update user balance
        const { error: balanceError } = await supabase
          .from("profiles")
          .update({ balance: newBalance })
          .eq("id", user.id);

        if (balanceError) {
          console.error("Error updating balance:", balanceError);
          throw new Error("Failed to update balance. Please contact support with your payment reference.");
        }

        console.log("Balance updated successfully:", { oldBalance: currentBalance, newBalance });

        toast({
          title: "Deposit Successful!",
          description: `$${depositAmount.toFixed(2)} has been added to your account. New balance: $${newBalance.toFixed(2)}`,
        });

        setAmount("");
      }
    } catch (error) {
      console.error("Error processing deposit:", error);
      const errorMessage = error instanceof Error ? error.message : "There was an error processing your deposit. Please try again.";
      toast({
        title: "Deposit Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Funds</h1>
          <p className="text-gray-600">Top up your account balance to start ordering services</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Deposit Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="amount">Enter Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="5"
                  step="0.01"
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(value)}
                      className="text-sm"
                    >
                      ${value}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex items-center space-x-3 flex-1">
                        <method.icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {paymentMethod === "mpesa" && !paystackLoaded && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Loading payment system...
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !amount || (paymentMethod === "mpesa" && !paystackLoaded)}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Processing..." : 
                   paymentMethod === "mpesa" ? 
                   `Pay KES ${(parseFloat(amount || "0") * 100).toFixed(0)} via M-Pesa` : 
                   `Deposit $${amount || "0.00"}`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• Minimum deposit amount is $5</p>
            <p>• M-Pesa payments are processed via Paystack</p>
            <p>• Only M-Pesa is currently available - other methods coming soon</p>
            <p>• Deposits are usually processed instantly</p>
            <p>• All payments are secure and encrypted</p>
            <p>• Contact support if you encounter any issues</p>
            <p>• Keep your payment reference for support inquiries</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
