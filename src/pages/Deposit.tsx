
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          {/* Main Payment Card */}
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-8 text-center">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  NeurotechGains Wallet
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Secure payment for your account. Pay with<br/>
                  <span className="font-medium text-green-600">M-Pesa or Card</span>
                </p>
              </div>

              {/* Amount Input */}
              <div className="mb-8">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-3 block">
                  Enter Amount
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-center text-xl font-semibold h-12 border-2 border-gray-200 focus:border-green-400 focus:ring-green-400 rounded-lg pl-12"
                    min="100"
                    step="1"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-medium text-gray-500">
                    KES
                  </span>
                </div>
                {amount && parseFloat(amount) >= 100 && (
                  <div className="mt-4 text-2xl font-bold text-green-600">
                    KES {parseFloat(amount).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Primary Payment Button */}
              <button
                onClick={handlePaystackPayment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mb-6"
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

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    or pay with
                  </span>
                </div>
              </div>

              {/* Alternative Payment Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePaystackPayment}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </button>
                <button
                  onClick={handlePaystackPayment}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                >
                  <Shield className="w-4 h-4" />
                  Bank
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security & Info Cards */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900 text-sm mb-1">Secure Payment</h3>
                    <p className="text-xs text-green-700">
                      Your payment is processed securely through Paystack.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 text-sm mb-1">Instant Credit</h3>
                    <p className="text-xs text-blue-700">
                      Funds are added to your account immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="border-yellow-200 bg-yellow-50 mt-4">
            <CardContent className="p-4">
              <h3 className="font-medium text-yellow-900 text-sm mb-2">📋 Important Information</h3>
              <ul className="text-xs text-yellow-800 space-y-1">
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
          <div className="text-center pt-6">
            <p className="text-sm text-gray-600 mb-3">
              Need assistance with your payment?
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/support")}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Contact Support Team
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
