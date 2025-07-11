
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
        verification: [
          { 
            name: "TikTok Verification (Blue Tick)", 
            minOrder: 1, 
            pricePerUnit: 1700, 
            unit: "verification",
            icon: <Badge className="h-5 w-5" />
          },
        ],
        followers: [
          { 
            name: "TikTok Followers", 
            minOrder: 50, 
            pricePerUnit: 0.46, 
            unit: "follower",
            icon: <Users className="h-5 w-5" />
          },
        ],
        likes: [
          { 
            name: "TikTok Likes", 
            minOrder: 10, 
            pricePerUnit: 0.0103, 
            unit: "like",
            icon: <Heart className="h-5 w-5" />
          },
        ],
        views: [
          { 
            name: "TikTok Video Views", 
            minOrder: 100, 
            pricePerUnit: 0.003528, 
            unit: "view",
            icon: <Eye className="h-5 w-5" />
          },
        ],
        mentions: [
          { 
            name: "TikTok Mentions", 
            minOrder: 50, 
            pricePerUnit: 9, 
            unit: "mention",
            icon: <AtSign className="h-5 w-5" />
          },
        ],
        storyViews: [
          { 
            name: "TikTok Story Views", 
            minOrder: 20, 
            pricePerUnit: 0.07267, 
            unit: "story view",
            icon: <Play className="h-5 w-5" />
          },
        ],
        commentsLikes: [
          { 
            name: "TikTok Comments + Likes", 
            minOrder: 20, 
            pricePerUnit: 0.6, 
            unit: "combo engagement",
            icon: <MessageCircle className="h-5 w-5" />
          },
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
        verification: [
          { 
            name: "Facebook Verification (Blue Tick)", 
            minOrder: 1, 
            pricePerUnit: 1700, 
            unit: "verification",
            icon: <Badge className="h-5 w-5" />
          },
        ],
        followers: [
          { 
            name: "Facebook Followers", 
            minOrder: 50, 
            pricePerUnit: 0.46, 
            unit: "follower",
            icon: <Users className="h-5 w-5" />
          },
        ],
        likes: [
          { 
            name: "Facebook Likes", 
            minOrder: 10, 
            pricePerUnit: 0.0103, 
            unit: "like",
            icon: <Heart className="h-5 w-5" />
          },
        ],
        views: [
          { 
            name: "Facebook Video Views", 
            minOrder: 100, 
            pricePerUnit: 0.003528, 
            unit: "view",
            icon: <Eye className="h-5 w-5" />
          },
        ],
        mentions: [
          { 
            name: "Facebook Mentions", 
            minOrder: 50, 
            pricePerUnit: 9, 
            unit: "mention",
            icon: <AtSign className="h-5 w-5" />
          },
        ],
        storyViews: [
          { 
            name: "Facebook Story Views", 
            minOrder: 20, 
            pricePerUnit: 0.07267, 
            unit: "story view",
            icon: <Play className="h-5 w-5" />
          },
        ],
        commentsLikes: [
          { 
            name: "Facebook Comments + Likes", 
            minOrder: 20, 
            pricePerUnit: 0.6, 
            unit: "combo engagement",
            icon: <MessageCircle className="h-5 w-5" />
          },
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

  const renderTikTokServices = () => {
    return Object.entries(services.tiktok.services).map(([serviceKey, serviceList]) => (
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
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4">
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
                        KSh {service.pricePerUnit.toFixed(4)} per {service.unit}
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
                          {currentQuantity} × KSh {service.pricePerUnit.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOrderClick({
                        platform: "TikTok",
                        type: service.name,
                        quantity: currentQuantity,
                        price: parseFloat(totalPrice),
                      })}
                      disabled={inputValue !== '' && Number(inputValue) < service.minOrder}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

  const renderFacebookServices = () => {
    return Object.entries(services.facebook.services).map(([serviceKey, serviceList]) => (
      <div key={serviceKey} className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 capitalize">
          {serviceKey === 'storyViews' ? 'Story Views' : 
           serviceKey === 'commentsLikes' ? 'Comments + Likes' : serviceKey}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceList.map((service: any, index: number) => {
            const serviceId = `facebook-${serviceKey}-${index}`;
            const inputValue = quantities[serviceId] || '';
            const currentQuantity = inputValue === '' ? service.minOrder : Math.max(Number(inputValue) || service.minOrder, service.minOrder);
            const displayValue = inputValue === '' ? '' : inputValue;
            const totalPrice = calculateTotalPrice(service.pricePerUnit, currentQuantity);

            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4">
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
                        KSh {service.pricePerUnit.toFixed(4)} per {service.unit}
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

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                        <p className="text-2xl font-bold text-blue-600">
                          KSh {totalPrice}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {currentQuantity} × KSh {service.pricePerUnit.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOrderClick({
                        platform: "Facebook",
                        type: service.name,
                        quantity: currentQuantity,
                        price: parseFloat(totalPrice),
                      })}
                      disabled={inputValue !== '' && Number(inputValue) < service.minOrder}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Premium Services</h1>
          <p className="text-gray-600 text-lg">Boost your social media presence with our professional services</p>
        </div>

        <Tabs defaultValue="tiktok" className="space-y-6">
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

          <TabsContent value="tiktok" className="space-y-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Music className="h-8 w-8" />
                <h2 className="text-3xl font-bold">TikTok Services</h2>
              </div>
              <p className="text-pink-100">Professional TikTok growth solutions</p>
            </div>
            {renderTikTokServices()}
          </TabsContent>

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

          <TabsContent value="facebook" className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 text-white text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <ThumbsUp className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Facebook Services</h2>
              </div>
              <p className="text-blue-100">Professional Facebook growth solutions</p>
            </div>
            {renderFacebookServices()}
          </TabsContent>
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
