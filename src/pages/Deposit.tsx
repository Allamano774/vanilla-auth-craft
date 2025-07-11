
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a deposit",
        variant: "destructive",
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    
    if (!depositAmount || depositAmount < 100) {
      toast({
        title: "Invalid amount",
        description: "Minimum deposit amount is KES 100",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          amount: depositAmount,
          email: user.email,
        },
      });

      if (error) {
        throw error;
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url;

    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: error.message || "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaystackPayment = () => {
    if (!amount || parseFloat(amount) < 100) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount (minimum KES 100)",
        variant: "destructive",
      });
      return;
    }
    handleDeposit(new Event('submit') as any);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Creative Payment Interface */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                NeurotechGains Wallet
              </h1>
              <p className="text-gray-600 text-lg">
                Secure payment for your account. Pay with<br/>
                <span className="font-semibold text-blue-600">M-Pesa or Card</span>
              </p>
            </div>

            <div className="mb-8">
              <Label htmlFor="amount" className="text-lg font-medium text-gray-700 mb-2 block">
                Enter Amount
              </Label>
              <div className="relative max-w-xs mx-auto">
                <Input
                  id="amount"
                  type="number"
                  placeholder="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-center text-2xl font-bold h-14 border-2 border-blue-200 focus:border-blue-400"
                  min="100"
                  step="1"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-500">
                  KES
                </span>
              </div>
              {amount && (
                <div className="mt-3 text-3xl font-bold text-green-600">
                  KES {parseFloat(amount || "0").toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={handlePaystackPayment}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5" />
                  Lipa na M-Pesa
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-blue-50 to-purple-50 text-gray-500">
                  or pay with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handlePaystackPayment}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Card
              </button>
              <button
                onClick={handlePaystackPayment}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Bank
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Secure Payment</h3>
                  <p className="text-sm text-green-700">
                    Your payment is processed securely through Paystack. We never store your payment information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Instant Credit</h3>
                  <p className="text-sm text-blue-700">
                    Funds are added to your account immediately after successful payment confirmation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">📋 Important Information</h3>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Minimum deposit amount is KES 100</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Deposits are non-refundable once processed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Contact support if you experience any payment issues</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600 mb-3">
            Need assistance with your payment?
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/support")}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Contact Support Team
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
