
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, HelpCircle, Clock, CreditCard, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/Layout/DashboardLayout";

const Support = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  };

  const createWhatsAppMessage = (type: "payment" | "order") => {
    const baseMessage = `Hello NeuroTech Gains, I need support with my ${type}. My email is ${userEmail}.`;
    return encodeURIComponent(baseMessage);
  };

  const whatsappNumbers = [
    { number: "254785760507", label: "Chat Support – Line 1" },
    { number: "254797966709", label: "Chat Support – Line 2" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            Support Center
          </h1>
          <p className="text-gray-600 mt-2">
            Need help? We're here to assist you with any payment or order-related issues.
          </p>
        </div>

        {/* Main Support Message */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Get Instant Help via WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 mb-4">
              If your payment has not reflected, or your order is taking longer than expected, 
              please contact our support team directly via WhatsApp. We're here to help!
            </p>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">
                📱 Please include your email and order reference (if available) when messaging.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* When to Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-orange-600" />
              When to Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-orange-900">Payment Issues</h3>
                  <p className="text-sm text-orange-700">
                    Your payment has not reflected after a successful transaction
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-900">Order Delays</h3>
                  <p className="text-sm text-purple-700">
                    Your order is taking unusually long to be fulfilled
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Contact Options */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Our Support Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whatsappNumbers.map((contact, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-semibold text-green-700 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {contact.label}
                  </h3>
                  <div className="space-y-2">
                    <a
                      href={`https://wa.me/${contact.number}?text=${createWhatsAppMessage("payment")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-center font-medium"
                    >
                      💳 Payment Support
                    </a>
                    <a
                      href={`https://wa.me/${contact.number}?text=${createWhatsAppMessage("order")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center font-medium"
                    >
                      📦 Order Support
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <p className="text-yellow-800">
                <strong>Payment Confirmation:</strong> Payment reflection may take up to 10 minutes after a successful transaction.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <p className="text-yellow-800">
                <strong>Support Eligibility:</strong> Support is only available for users who have made a successful payment or placed a real order.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">How long does payment confirmation take?</h3>
                <p className="text-gray-600 text-sm">
                  Payment confirmation typically takes 5-10 minutes. If it takes longer, please contact support.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">When will my order be completed?</h3>
                <p className="text-gray-600 text-sm">
                  Order completion times vary by service type. Check your order details for estimated completion time.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">What information should I include when contacting support?</h3>
                <p className="text-gray-600 text-sm">
                  Please include your email address, order reference (if available), and a clear description of the issue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Support;
