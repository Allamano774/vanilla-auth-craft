
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-white/80 text-lg">Secure authentication system</p>
        </div>

        {/* Auth Options */}
        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 block hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Sign In</h3>
                <p className="text-white/70">Access your account</p>
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
                <p className="text-white/70">Join our community</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Secure • Fast • Modern
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
