import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2) return "First name must be at least 2 characters";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2) return "Last name must be at least 2 characters";
        return "";
      case "username":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])/.test(value)) return "Password must contain a lowercase letter";
        if (!/(?=.*[A-Z])/.test(value)) return "Password must contain an uppercase letter";
        if (!/(?=.*\d)/.test(value)) return "Password must contain a number";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== form.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  // Password strength calculator
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score: 2, label: "Medium", color: "bg-yellow-500" };
    return { score: 3, label: "Strong", color: "bg-green-500" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError("");
    
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
    
    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({ 
        ...prev, 
        confirmPassword: form.confirmPassword !== value ? "Passwords do not match" : "" 
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      username: true,
      password: true,
      confirmPassword: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword: _, ...registerData } = form;
      await api.post("/auth/register", registerData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      console.error(err);
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        if (status === 409 || data?.message?.toLowerCase().includes("exists")) {
          setServerError("An account with this email already exists. Please try logging in.");
        } else if (status === 400) {
          setServerError("Please check your information and try again.");
        } else {
          setServerError("Unable to create account. Please try again later.");
        }
      } else if (err.request) {
        setServerError("Unable to connect to server. Please check your connection.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return "default";
    return errors[fieldName] ? "error" : "success";
  };

  const passwordStrength = getPasswordStrength(form.password);

  // Success state
  if (success) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
            
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute top-0 right-1/4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">
              Welcome Aboard! 🎉
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your account has been created successfully.<br />
              Get ready to explore amazing content!
            </p>
            
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500 bg-gray-50 rounded-xl py-3 px-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#1a1a2e]" />
              <span>Redirecting to login...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="w-full max-w-5xl flex gap-8 items-center">
        
        {/* Left Side - Features */}
        <div className="hidden lg:flex flex-col flex-1 pr-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4 leading-tight">
              Join Our<br />
              <span className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] bg-clip-text text-transparent">
                Creative Community
              </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Create your account and unlock access to exclusive content, 
              job opportunities, and a vibrant community of professionals.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] mb-1">Exclusive Content</h3>
                <p className="text-gray-500 text-sm">Access premium articles and resources curated for professionals.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] mb-1">Career Opportunities</h3>
                <p className="text-gray-500 text-sm">Discover and apply to top job openings in your field.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e] mb-1">Secure & Private</h3>
                <p className="text-gray-500 text-sm">Your data is protected with industry-standard security.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-8 py-10 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Create Account
                </h1>
                <p className="text-gray-300 text-sm">
                  Start your journey with us today
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* Server Error */}
              {serverError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              )}

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="relative group">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`h-12 pl-4 pr-10 rounded-xl border-2 transition-all duration-200 ${
                        getFieldStatus("firstName") === "error" 
                          ? "border-red-300 bg-red-50/50 focus-visible:border-red-400 focus-visible:ring-red-100" 
                          : getFieldStatus("firstName") === "success"
                          ? "border-green-300 bg-green-50/50 focus-visible:border-green-400 focus-visible:ring-green-100"
                          : "border-gray-200 hover:border-gray-300 focus-visible:border-[#1a1a2e]"
                      }`}
                    />
                    {touched.firstName && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {errors.firstName ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {touched.firstName && errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="relative group">
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`h-12 pl-4 pr-10 rounded-xl border-2 transition-all duration-200 ${
                        getFieldStatus("lastName") === "error" 
                          ? "border-red-300 bg-red-50/50 focus-visible:border-red-400 focus-visible:ring-red-100" 
                          : getFieldStatus("lastName") === "success"
                          ? "border-green-300 bg-green-50/50 focus-visible:border-green-400 focus-visible:ring-green-100"
                          : "border-gray-200 hover:border-gray-300 focus-visible:border-[#1a1a2e]"
                      }`}
                    />
                    {touched.lastName && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {errors.lastName ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {touched.lastName && errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a1a2e] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    name="username"
                    placeholder="you@example.com"
                    value={form.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                    className={`h-12 pl-12 pr-10 rounded-xl border-2 transition-all duration-200 ${
                      getFieldStatus("username") === "error" 
                        ? "border-red-300 bg-red-50/50 focus-visible:border-red-400 focus-visible:ring-red-100" 
                        : getFieldStatus("username") === "success"
                        ? "border-green-300 bg-green-50/50 focus-visible:border-green-400 focus-visible:ring-green-100"
                        : "border-gray-200 hover:border-gray-300 focus-visible:border-[#1a1a2e]"
                    }`}
                  />
                  {touched.username && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {errors.username ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {touched.username && errors.username && (
                  <p className="text-xs text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a1a2e] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                    className={`h-12 pl-12 pr-20 rounded-xl border-2 transition-all duration-200 ${
                      getFieldStatus("password") === "error" 
                        ? "border-red-300 bg-red-50/50 focus-visible:border-red-400 focus-visible:ring-red-100" 
                        : getFieldStatus("password") === "success"
                        ? "border-green-300 bg-green-50/50 focus-visible:border-green-400 focus-visible:ring-green-100"
                        : "border-gray-200 hover:border-gray-300 focus-visible:border-[#1a1a2e]"
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {touched.password && (
                      errors.password ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )
                    )}
                  </div>
                </div>
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.score
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength.score === 1 ? "text-red-500" :
                      passwordStrength.score === 2 ? "text-yellow-600" :
                      "text-green-600"
                    }`}>
                      {passwordStrength.label} password
                    </p>
                  </div>
                )}
                
                {touched.password && errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1a1a2e] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                    className={`h-12 pl-12 pr-20 rounded-xl border-2 transition-all duration-200 ${
                      getFieldStatus("confirmPassword") === "error" 
                        ? "border-red-300 bg-red-50/50 focus-visible:border-red-400 focus-visible:ring-red-100" 
                        : getFieldStatus("confirmPassword") === "success"
                        ? "border-green-300 bg-green-50/50 focus-visible:border-green-400 focus-visible:ring-green-100"
                        : "border-gray-200 hover:border-gray-300 focus-visible:border-[#1a1a2e]"
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {touched.confirmPassword && (
                      errors.confirmPassword ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )
                    )}
                  </div>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-13 bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#1a1a2e]/20 hover:shadow-xl hover:shadow-[#1a1a2e]/30 hover:-translate-y-0.5 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="font-semibold text-[#1a1a2e] hover:text-[#0f3460] hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          {/* Terms note */}
          <p className="text-center text-xs text-gray-500 mt-6 px-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-[#1a1a2e] hover:underline font-medium">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-[#1a1a2e] hover:underline font-medium">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}