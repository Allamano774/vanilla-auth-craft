
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Smartphone, DollarSign, History, RefreshCw } from "lucide-react";
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
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loadingDeposits, setLoadingDeposits] = useState(true);
  const [autoRefreshing, setAutoRefreshing] = useState(false);
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

  // Fetch user's deposit history
  const fetchDeposits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching deposits:", error);
        return;
      }

      setDeposits(data || []);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    } finally {
      setLoadingDeposits(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDeposits();
  }, []);

  // Auto-refresh deposits every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-refreshing deposits...");
      setAutoRefreshing(true);
      fetchDeposits().then(() => {
        setAutoRefreshing(false);
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefreshDeposits = async () => {
    setAutoRefreshing(true);
    await fetchDeposits();
    setAutoRefreshing(false);
    toast({
      title: "Deposits Refreshed",
      description: "Your deposit history has been updated.",
    });
  };

  const paymentMethods = [
    { id: "mpesa", name: "M-Pesa (Paystack)", icon: Smartphone, description: "Pay with M-Pesa via Paystack" },
    { id: "paypal", name: "PayPal", icon: CreditCard, description: "International payments (Coming Soon)" },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, MasterCard (Coming Soon)" },
  ];

  const quickAmounts = [2, 20, 50, 100, 250, 500];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const payWithPaystack = async (depositAmount: number, depositId: string, transactionRef: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!window.PaystackPop) {
        reject(new Error("Paystack not loaded. Please refresh the page and try again."));
        return;
      }

      if (!paystackLoaded) {
        reject(new Error("Payment system is still loading. Please wait a moment and try again."));
        return;
      }

      console.log("Initiating Paystack payment:", {
        amount: depositAmount,
        amountInCents: depositAmount * 100,
        reference: transactionRef,
        depositId
      });

      try {
        const handler = window.PaystackPop.setup({
          key: 'pk_live_c8d72323ec70238b1fb7ce3d5a42494560fbe815', 
          email: 'customer@example.com',
          amount: depositAmount * 100, // Convert to cents (Paystack expects amount in kobo/cents)
          currency: 'KES',
          ref: transactionRef,
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
            console.log("Paystack payment popup closed - marking as cancelled with reference:", transactionRef);
            // Update the deposit status to cancelled when popup is closed
            updateDepositStatus(depositId, "cancelled");
            reject(new Error(`Payment was cancelled. Transaction reference: ${transactionRef}`));
          }
        });
        
        handler.openIframe();
      } catch (error) {
        console.error("Error opening Paystack iframe:", error);
        // Update the deposit status to failed if there's an error
        updateDepositStatus(depositId, "failed");
        reject(new Error("Failed to open payment popup. Please try again."));
      }
    });
  };

  const updateDepositStatus = async (depositId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("deposits")
        .update({ status })
        .eq("id", depositId);

      if (error) {
        console.error("Error updating deposit status:", error);
      } else {
        console.log(`Deposit ${depositId} status updated to: ${status}`);
        // Refresh deposits list to show updated status
        await fetchDeposits();
      }
    } catch (error) {
      console.error("Error updating deposit status:", error);
    }
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

    if (depositAmount < 2) {
      toast({
        title: "Minimum Deposit",
        description: "Minimum deposit amount is KES 2.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Generate transaction reference
      const transactionRef = 'DEPOSIT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      // Create deposit record immediately when payment is initiated
      console.log("Creating deposit record for amount:", depositAmount, "with reference:", transactionRef);
      const { data: depositData, error: depositError } = await supabase
        .from("deposits")
        .insert({
          user_id: user.id,
          amount: depositAmount,
          payment_method: paymentMethod,
          status: "pending",
          transaction_reference: transactionRef,
        })
        .select()
        .single();

      if (depositError) {
        console.error("Error creating deposit record:", depositError);
        throw new Error("Failed to create deposit record. Please try again.");
      }

      const depositId = depositData.id;
      console.log("Deposit record created with ID:", depositId, "and reference:", transactionRef);

      // Refresh deposits list to show the new pending transaction
      await fetchDeposits();

      let paymentSuccess = false;

      // Handle M-Pesa payment via Paystack
      if (paymentMethod === "mpesa") {
        if (!paystackLoaded) {
          await updateDepositStatus(depositId, "failed");
          throw new Error("Payment system is still loading. Please wait a moment and try again.");
        }

        try {
          paymentSuccess = await payWithPaystack(depositAmount, depositId, transactionRef);
        } catch (error) {
          console.error("M-Pesa payment error:", error);
          const errorMessage = error instanceof Error ? error.message : "Payment failed. Please try again.";
          toast({
            title: "Payment Cancelled",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
      } else {
        // For other payment methods, mark as failed and show that they're not implemented yet
        await updateDepositStatus(depositId, "failed");
        toast({
          title: "Payment Method Not Available",
          description: `${paymentMethods.find(m => m.id === paymentMethod)?.name} is coming soon. Please use M-Pesa for now.`,
          variant: "destructive",
        });
        return;
      }

      if (paymentSuccess) {
        console.log("Processing successful payment for amount:", depositAmount);

        // Update deposit status to completed
        await updateDepositStatus(depositId, "completed");

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
          description: `KES ${depositAmount.toFixed(2)} has been added to your account. New balance: KES ${newBalance.toFixed(2)}`,
        });

        setAmount("");
        
        // Refresh deposits list immediately
        await fetchDeposits();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-orange-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Funds</h1>
          <p className="text-gray-600">Top up your account balance to start ordering services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deposit Form */}
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
                  <Label htmlFor="amount">Enter Amount (KES)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="2"
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
                        KES {value}
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
                     `Pay KES ${(parseFloat(amount || "0")).toFixed(0)} via M-Pesa` : 
                     `Deposit KES ${amount || "0.00"}`}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Deposit History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Deposit History
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshDeposits}
                  disabled={autoRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${autoRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {autoRefreshing && (
                <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Checking for new transactions...
                </div>
              )}
              
              {loadingDeposits ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading deposits...</p>
                </div>
              ) : deposits.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No deposits found</p>
                  <p className="text-sm">Your deposit history will appear here</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deposits.map((deposit) => (
                        <TableRow key={deposit.id}>
                          <TableCell className="font-medium">
                            KES {Number(deposit.amount).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span className={`capitalize ${getStatusColor(deposit.status)}`}>
                              {deposit.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 font-mono">
                            {deposit.transaction_reference || 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {formatDate(deposit.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• Minimum deposit amount is KES 2</p>
            <p>• M-Pesa payments are processed via Paystack</p>
            <p>• Only M-Pesa is currently available - other methods coming soon</p>
            <p>• Deposits are usually processed instantly</p>
            <p>• Transactions are automatically checked every 30 seconds</p>
            <p>• All payment attempts are recorded with unique transaction references</p>
            <p>• You can see the status and reference code of all transactions, including cancelled ones</p>
            <p>• Transaction references help with support inquiries and tracking</p>
            <p>• All payments are secure and encrypted</p>
            <p>• Contact support if you encounter any issues</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
