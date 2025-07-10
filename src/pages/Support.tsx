
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

  const WhatsAppIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.515"/>
    </svg>
  );

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
              <WhatsAppIcon />
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
            <CardTitle className="flex items-center gap-2">
              <WhatsAppIcon />
              Contact Our Support Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whatsappNumbers.map((contact, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-semibold text-green-700 flex items-center gap-2">
                    <WhatsAppIcon />
                    {contact.label}
                  </h3>
                  <div className="space-y-2">
                    <a
                      href={`https://wa.me/${contact.number}?text=${createWhatsAppMessage("payment")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                    >
                      <WhatsAppIcon />
                      💳 Payment Support
                    </a>
                    <a
                      href={`https://wa.me/${contact.number}?text=${createWhatsAppMessage("order")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                    >
                      <WhatsAppIcon />
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
