
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import OrderModal from "@/components/OrderModal";

const Services = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const services = {
    tiktok: {
      name: "TikTok",
      icon: "🎵",
      services: {
        followers: [
          { quantity: 100, price: 40 },
          { quantity: 200, price: 80 },
          { quantity: 300, price: 130 },
          { quantity: 500, price: 200 },
          { quantity: 1000, price: 400 },
        ],
        likes: [
          { quantity: 100, price: 35 },
          { quantity: 1000, price: 300 },
          { quantity: 5000, price: 1500 },
          { quantity: 10000, price: 2500 },
          { quantity: 100000, price: 6700 },
        ],
        views: [
          { quantity: 100, price: 10 },
          { quantity: 5000, price: 200 },
          { quantity: 10000, price: 300 },
          { quantity: 100000, price: 600 },
        ],
      }
    },
    instagram: {
      name: "Instagram",
      icon: "📸",
      services: {
        followers: [
          { quantity: 100, price: 40 },
          { quantity: 200, price: 80 },
          { quantity: 300, price: 130 },
          { quantity: 500, price: 200 },
          { quantity: 1000, price: 400 },
        ],
        likes: [
          { quantity: 100, price: 35 },
          { quantity: 1000, price: 300 },
          { quantity: 5000, price: 1500 },
          { quantity: 10000, price: 2500 },
          { quantity: 100000, price: 6700 },
        ],
      }
    },
    facebook: {
      name: "Facebook",
      icon: "👍",
      services: {
        followers: [
          { quantity: 200, price: 100 },
          { quantity: 1000, price: 400 },
          { quantity: 10000, price: 3500 },
          { quantity: 100000, price: 32150 },
          { quantity: 1000000, price: 320400 },
        ],
        likes: [
          { quantity: 100, price: 40 },
          { quantity: 200, price: 80 },
          { quantity: 1000, price: 300 },
          { quantity: 2000, price: 600 },
          { quantity: 3000, price: 800 },
          { quantity: 4000, price: 1000 },
          { quantity: 5000, price: 1500 },
        ],
      }
    }
  };

  const handleOrderClick = (service: any) => {
    setSelectedService(service);
    setIsOrderModalOpen(true);
  };

  const formatQuantity = (quantity: number) => {
    if (quantity >= 1000000) return `${(quantity / 1000000).toFixed(1)}M`;
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(0)}K`;
    return quantity.toString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Choose from our premium social media services</p>
        </div>

        <Tabs defaultValue="tiktok" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(services).map(([key, platform]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <span>{platform.icon}</span>
                {platform.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(services).map(([platformKey, platform]) => (
            <TabsContent key={platformKey} value={platformKey} className="space-y-6">
              {Object.entries(platform.services).map(([serviceType, serviceList]) => (
                <Card key={serviceType}>
                  <CardHeader>
                    <CardTitle className="capitalize">
                      {platform.name} {serviceType}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {serviceList.map((service, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-lg">
                                {formatQuantity(service.quantity)} {serviceType}
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                KSh {service.price}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleOrderClick({
                              platform: platform.name,
                              type: serviceType,
                              quantity: service.quantity,
                              price: service.price,
                            })}
                            className="w-full"
                          >
                            Order Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        service={selectedService}
      />
    </DashboardLayout>
  );
};

export default Services;
