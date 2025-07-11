
import { Link } from "react-router-dom";
import { LogIn, UserPlus, MessageCircle, TrendingUp, Users, Heart, Eye, Play } from "lucide-react";

const Index = () => {
  const WhatsAppIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.515"/>
    </svg>
  );

  const features = [
    { icon: Users, title: "Real Followers", description: "Grow your audience with genuine followers" },
    { icon: Heart, title: "Instant Likes", description: "Boost engagement on your posts immediately" },
    { icon: Eye, title: "Story Views", description: "Increase visibility on your stories" },
    { icon: Play, title: "Video Views", description: "Get more views on your video content" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Neurotech<span style={{ color: '#00d8ff' }}>Gains</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2 font-medium">
            Accelerate Your Growth — One Click at a Time
          </p>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Boost your social media presence instantly. Get real followers, likes, views, and engagement on Instagram, TikTok, Facebook, and YouTube — no password required!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
              <feature.icon className="w-8 h-8 text-white mx-auto mb-2" style={{ color: '#00d8ff' }} />
              <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-white/70 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Auth Options */}
        <div className="space-y-4 mb-8">
          <Link
            to="/login"
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 block hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #00d8ff, #0099cc)' }}>
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Sign In</h3>
                <p className="text-white/70">Access your boosting dashboard</p>
              </div>
            </div>
          </Link>

          <Link
            to="/register"
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 block hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Create Account</h3>
                <p className="text-white/70">Start boosting your social media today</p>
              </div>
            </div>
          </Link>
        </div>

        {/* WhatsApp Support */}
        <div className="bg-green-600/20 backdrop-blur-lg border border-green-400/30 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <WhatsAppIcon />
            <h3 className="text-white font-semibold text-lg mb-2 flex items-center justify-center gap-2">
              <WhatsAppIcon />
              24/7 WhatsApp Support
            </h3>
            <p className="text-white/80 mb-4">
              Need help or have a question? Chat with us on WhatsApp anytime.
            </p>
            <a
              href="https://wa.me/254785760507?text=Hi%20NeurotechGains,%20I%20need%20help%20with%20social%20media%20boosting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <WhatsAppIcon />
              Chat with Support
            </a>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-8">
          <p className="text-white/90 text-lg font-medium mb-2">
            Get real engagement. Real fast.
          </p>
          <p className="text-white/70">
            Boost your social presence today — no password required
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            Safe • Fast • Real Results • 24/7 Support
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
