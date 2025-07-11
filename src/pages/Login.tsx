
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!isLogin && (!formData.fullName || formData.fullName.trim().length < 2)) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "Welcome back!",
            description: "Login successful. Redirecting to dashboard...",
          });
          navigate("/dashboard");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;

        if (data.user) {
          setUserEmail(formData.email);
          setShowEmailVerification(true);
          setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
        }
      }
    } catch (error: any) {
      toast({
        title: isLogin ? "Login Failed" : "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setShowEmailVerification(false);
  };

  const handleBackToLogin = () => {
    setShowEmailVerification(false);
    setIsLogin(true);
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  if (showEmailVerification) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2339&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-md w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Account Created!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Welcome to NeuotechGains! Your account has been successfully created.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Check Your Email</h3>
              </div>
              <p className="text-blue-700 text-sm">
                We've sent a verification link to <strong>{userEmail}</strong>. 
                Please check your email and click the link to verify your account.
              </p>
            </div>
            
            <div className="text-sm text-gray-500 mb-6">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-blue-600 hover:underline font-medium"
              >
                try again
              </button>
            </div>
            
            <button
              onClick={handleBackToLogin}
              className="w-full font-semibold py-3 rounded-xl text-white transition-all duration-300 hover:shadow-xl"
              style={{ 
                background: 'linear-gradient(135deg, #00d8ff 0%, #0099cc 100%)'
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2339&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-md w-full">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mb-4">
              <div className="text-white font-bold text-xl">NG</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? "Welcome Back" : "Join NeuotechGains"}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? "Sign in to boost your social media presence" 
                : "Start growing your social media today"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border ${errors.fullName ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your full name"
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  />
                  {errors.fullName && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                  )}
                </div>
                {errors.fullName && (
                  <p id="fullName-error" className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter your email"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {isLogin ? "Password" : "Create Password"}
                </label>
                {isLogin && (
                  <Link
                    to="/forgot-password"
                    className="text-sm hover:underline transition-colors"
                    style={{ color: '#00d8ff' }}
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword || ""}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Confirm your password"
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold py-3 rounded-xl text-white transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              style={{ 
                background: isLoading ? '#gray' : 'linear-gradient(135deg, #00d8ff 0%, #0099cc 100%)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                isLogin ? "Log In to NeuotechGains" : "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleForm}
                className="font-semibold hover:underline transition-colors"
                style={{ color: '#00d8ff' }}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
