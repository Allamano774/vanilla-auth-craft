import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Users, Heart, Eye, AtSign, Play, MessageCircle, Music, ThumbsUp, Video } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import OrderModal from "@/components/OrderModal";

const Services = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [quantities, setQuantities] = useState<{[key: string]: string}>({});

  const services = {
    tiktok: {
      name: "TikTok",
      icon: <Music className="h-6 w-6" />,
      color: "from-pink-500 to-purple-600",
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
      icon: <Instagram className="h-6 w-6" />,
      color: "from-purple-500 to-pink-600",
      services: {
        verification: [
          { 
            name: "Instagram Verification (Blue Tick)", 
            minOrder: 1, 
            pricePerUnit: 1700, 
            unit: "verification",
            icon: <Badge className="h-5 w-5" />
          },
        ],
        followers: [
          { 
            name: "Instagram Followers", 
            minOrder: 10, 
            pricePerUnit: 0.30, 
            unit: "follower",
            icon: <Users className="h-5 w-5" />
          },
        ],
        likes: [
          { 
            name: "Instagram Likes", 
            minOrder: 10, 
            pricePerUnit: 0.01, 
            unit: "like",
            icon: <Heart className="h-5 w-5" />
          },
        ],
        views: [
          { 
            name: "Instagram Video Views", 
            minOrder: 100, 
            pricePerUnit: 0.004, 
            unit: "view",
            icon: <Eye className="h-5 w-5" />
          },
        ],
        mentions: [
          { 
            name: "Instagram Mentions", 
            minOrder: 50, 
            pricePerUnit: 9, 
            unit: "mention",
            icon: <AtSign className="h-5 w-5" />
          },
        ],
        storyViews: [
          { 
            name: "Instagram Story Views", 
            minOrder: 20, 
            pricePerUnit: 0.07, 
            unit: "story view",
            icon: <Play className="h-5 w-5" />
          },
        ],
        commentsLikes: [
          { 
            name: "Instagram Comments + Likes", 
            minOrder: 20, 
            pricePerUnit: 0.60, 
            unit: "combo engagement",
            icon: <MessageCircle className="h-5 w-5" />
          },
        ],
      }
    },
    facebook: {
      name: "Facebook",
      icon: <ThumbsUp className="h-6 w-6" />,
      color: "from-blue-500 to-blue-700",
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

  const handleQuantityChange = (serviceKey: string, value: string, minOrder: number) => {
    // Allow empty string or valid numbers
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setQuantities(prev => ({ ...prev, [serviceKey]: value }));
    }
  };

  const getQuantityValue = (serviceKey: string, minOrder: number) => {
    const value = quantities[serviceKey];
    if (value === '' || value === undefined) return '';
    const numValue = Number(value);
    return numValue >= minOrder ? numValue : minOrder;
  };

  const calculateTotalPrice = (pricePerUnit: number, quantity: number | string) => {
    const numQuantity = typeof quantity === 'string' ? Number(quantity) : quantity;
    if (isNaN(numQuantity) || numQuantity <= 0) return '0.00';
    return (pricePerUnit * numQuantity).toFixed(2);
  };

  const formatQuantity = (quantity: number) => {
    if (quantity >= 1000000) return `${(quantity / 1000000).toFixed(1)}M`;
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(0)}K`;
    return quantity.toString();
  };

  const renderInstagramServices = () => {
    return Object.entries(services.instagram.services).map(([serviceKey, serviceList]) => (
      <div key={serviceKey} className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 capitalize">
          {serviceKey === 'storyViews' ? 'Story Views' : 
           serviceKey === 'commentsLikes' ? 'Comments + Likes' : serviceKey}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceList.map((service: any, index: number) => {
            const serviceId = `${serviceKey}-${index}`;
            const inputValue = quantities[serviceId] || '';
            const currentQuantity = inputValue === '' ? service.minOrder : Math.max(Number(inputValue) || service.minOrder, service.minOrder);
            const displayValue = inputValue === '' ? '' : inputValue;
            const totalPrice = calculateTotalPrice(service.pricePerUnit, currentQuantity);

            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
                  <div className="flex items-center gap-3 text-white">
                    {service.icon}
                    <h4 className="font-semibold text-lg">{service.name}</h4>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">
                        Min: {service.minOrder} {service.unit}{service.minOrder > 1 ? 's' : ''}
                      </Badge>
                      <span className="text-sm font-medium text-gray-600">
                        KSh {service.pricePerUnit.toFixed(2)} per {service.unit}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={serviceId} className="text-sm font-medium">
                        Quantity ({service.unit}{currentQuantity > 1 ? 's' : ''})
                      </Label>
                      <Input
                        id={serviceId}
                        type="number"
                        min={service.minOrder}
                        step={1}
                        value={displayValue}
                        onChange={(e) => handleQuantityChange(serviceId, e.target.value, service.minOrder)}
                        className="w-full"
                        placeholder={`Min ${service.minOrder}`}
                      />
                      {inputValue !== '' && Number(inputValue) < service.minOrder && (
                        <p className="text-xs text-red-500">
                          Minimum order is {service.minOrder} {service.unit}{service.minOrder > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                        <p className="text-2xl font-bold text-purple-600">
                          KSh {totalPrice}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {currentQuantity} × KSh {service.pricePerUnit.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOrderClick({
                        platform: "Instagram",
                        type: service.name,
                        quantity: currentQuantity,
                        price: parseFloat(totalPrice),
                      })}
                      disabled={inputValue !== '' && Number(inputValue) < service.minOrder}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Order Now - KSh {totalPrice}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    ));
  };

  const renderOtherPlatformServices = (platformKey: string, platform: any) => {
    return Object.entries(platform.services).map(([serviceType, serviceList]: [string, any]) => (
      <Card key={serviceType} className="overflow-hidden shadow-md">
        <div className={`bg-gradient-to-r ${platform.color} p-4`}>
          <div className="flex items-center gap-3 text-white">
            {serviceType === 'followers' ? <Users className="h-5 w-5" /> : 
             serviceType === 'likes' ? <Heart className="h-5 w-5" /> : 
             serviceType === 'views' ? <Eye className="h-5 w-5" /> : 
             <Video className="h-5 w-5" />}
            <CardTitle className="text-lg capitalize text-white">
              {platform.name} {serviceType}
            </CardTitle>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceList.map((service: any, index: number) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="text-center space-y-3">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      {formatQuantity(service.quantity)} {serviceType}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      KSh {service.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOrderClick({
                      platform: platform.name,
                      type: serviceType,
                      quantity: service.quantity,
                      price: service.price,
                    })}
                    className={`w-full bg-gradient-to-r ${platform.color} hover:opacity-90 text-white font-medium transition-all duration-300`}
                  >
                    Order Now
                  </Button>
                </div>
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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Premium Services</h1>
          <p className="text-gray-600 text-lg">Boost your social media presence with our professional services</p>
        </div>

        <Tabs defaultValue="instagram" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
            {Object.entries(services).map(([key, platform]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className={`flex items-center gap-3 px-6 py-3 rounded-md font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:${platform.color} data-[state=active]:text-white`}
              >
                {platform.icon}
                <span className="hidden sm:inline">{platform.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="instagram" className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Instagram className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Instagram Services</h2>
              </div>
              <p className="text-purple-100">Professional Instagram growth solutions</p>
            </div>
            {renderInstagramServices()}
          </TabsContent>

          {Object.entries(services).filter(([key]) => key !== 'instagram').map(([platformKey, platform]) => (
            <TabsContent key={platformKey} value={platformKey} className="space-y-6">
              <div className={`bg-gradient-to-r ${platform.color} rounded-lg p-6 text-white text-center`}>
                <div className="flex items-center justify-center gap-3 mb-2">
                  {platform.icon}
                  <h2 className="text-3xl font-bold">{platform.name} Services</h2>
                </div>
                <p className="opacity-90">Grow your {platform.name} presence effectively</p>
              </div>
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
