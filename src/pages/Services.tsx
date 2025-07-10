
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
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

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
        verification: [
          { name: "Instagram Verification (Blue Tick)", minOrder: 1, pricePerUnit: 1700, unit: "verification" },
        ],
        followers: [
          { name: "Instagram Followers", minOrder: 10, pricePerUnit: 0.3, unit: "follower" },
        ],
        likes: [
          { name: "Instagram Likes", minOrder: 10, pricePerUnit: 0.0103, unit: "like" },
        ],
        views: [
          { name: "Instagram Video Views", minOrder: 100, pricePerUnit: 0.003528, unit: "view" },
        ],
        mentions: [
          { name: "Instagram Mentions", minOrder: 50, pricePerUnit: 9, unit: "mention" },
        ],
        storyViews: [
          { name: "Instagram Story Views", minOrder: 20, pricePerUnit: 0.07267, unit: "story view" },
        ],
        commentsLikes: [
          { name: "Instagram Comments + Likes", minOrder: 20, pricePerUnit: 0.6, unit: "combo engagement" },
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

  const handleQuantityChange = (serviceKey: string, value: number, minOrder: number) => {
    if (value >= minOrder) {
      setQuantities(prev => ({ ...prev, [serviceKey]: value }));
    }
  };

  const calculateTotalPrice = (pricePerUnit: number, quantity: number) => {
    return (pricePerUnit * quantity).toFixed(4);
  };

  const formatQuantity = (quantity: number) => {
    if (quantity >= 1000000) return `${(quantity / 1000000).toFixed(1)}M`;
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(0)}K`;
    return quantity.toString();
  };

  const renderInstagramServices = () => {
    return Object.entries(services.instagram.services).map(([serviceKey, serviceList]) => (
      <Card key={serviceKey} className="mb-6">
        <CardHeader>
          <CardTitle className="capitalize">
            {serviceKey === 'storyViews' ? 'Story Views' : 
             serviceKey === 'commentsLikes' ? 'Comments + Likes' : serviceKey}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceList.map((service: any, index: number) => {
              const serviceId = `${serviceKey}-${index}`;
              const currentQuantity = quantities[serviceId] || service.minOrder;
              const totalPrice = calculateTotalPrice(service.pricePerUnit, currentQuantity);

              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Minimum Order: {service.minOrder} {service.unit}{service.minOrder > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: KSh {service.pricePerUnit} per {service.unit}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={serviceId}>Quantity ({service.unit}{currentQuantity > 1 ? 's' : ''})</Label>
                      <Input
                        id={serviceId}
                        type="number"
                        min={service.minOrder}
                        step={1}
                        value={currentQuantity}
                        onChange={(e) => handleQuantityChange(serviceId, parseInt(e.target.value) || service.minOrder, service.minOrder)}
                        className="w-full"
                        placeholder={`Enter minimum ${service.minOrder}`}
                      />
                      <p className="text-xs text-gray-500">
                        Minimum: {service.minOrder} {service.unit}{service.minOrder > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Total Cost:</p>
                      <p className="text-2xl font-bold text-blue-600">
                        KSh {totalPrice}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentQuantity} × KSh {service.pricePerUnit} = KSh {totalPrice}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleOrderClick({
                        platform: "Instagram",
                        type: service.name,
                        quantity: currentQuantity,
                        price: parseFloat(totalPrice),
                      })}
                      className="w-full"
                    >
                      Order Now - KSh {totalPrice}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderOtherPlatformServices = (platformKey: string, platform: any) => {
    return Object.entries(platform.services).map(([serviceType, serviceList]: [string, any]) => (
      <Card key={serviceType}>
        <CardHeader>
          <CardTitle className="capitalize">
            {platform.name} {serviceType}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceList.map((service: any, index: number) => (
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
    ));
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

          <TabsContent value="instagram" className="space-y-6">
            {renderInstagramServices()}
          </TabsContent>

          {Object.entries(services).filter(([key]) => key !== 'instagram').map(([platformKey, platform]) => (
            <TabsContent key={platformKey} value={platformKey} className="space-y-6">
              {renderOtherPlatformServices(platformKey, platform)}
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
