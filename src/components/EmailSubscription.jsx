import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { subscribe } from "@/api/apiService";

export default function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  // Email validation function
  const validateEmail = (value) => {
    if (!value || value.trim() === "") {
      return "Email is required";
    }
    if (value.length < 6) {
      return "Email must be at least 6 characters";
    }
    if (value.length > 254) {
      return "Email must be less than 254 characters";
    }
    if (value.includes(" ")) {
      return "Email cannot contain spaces";
    }
    if (!value.includes("@")) {
      return "Email must contain @";
    }
    if (value.startsWith("@") || value.startsWith(".") || value.endsWith("@") || value.endsWith(".")) {
      return "Email cannot start or end with @ or .";
    }
    // RFC 5322 simplified regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Only validate if user has touched the field
    if (touched) {
      setValidationError(validateEmail(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setValidationError(validateEmail(email));
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit called", e);
    e.preventDefault();
    e.stopPropagation();
    
    console.log("After preventDefault, email:", email);
    setTouched(true);
    
    const error = validateEmail(email);
    if (error) {
      setValidationError(error);
      inputRef.current?.focus();
      return;
    }
    
    setValidationError("");
    setStatus("loading");
    setMessage("");
    
    try {
      const response = await subscribe(email);
      setStatus("success");
      setMessage(response.data?.message || "Please check your email to verify your subscription!");
      setEmail("");
      setTouched(false);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error("Subscribe error:", err);
      setStatus("error");
      if (err.response?.status === 409) {
        setMessage("This email is already subscribed!");
      } else if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else if (err.message) {
        setMessage(err.message);
      } else {
        setMessage("Failed to subscribe. Please try again.");
      }
    }
  };

  const isValid = touched && !validationError && email.length > 0;

  return (
    <section id="email-subscription" className="bg-[#1a1a2e] py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-6">
          <Mail className="h-8 w-8 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Stay Updated with Latest Content
        </h2>
        
        {/* Description */}
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and get the latest Java tutorials, Spring Boot guides, 
          and job opportunities delivered directly to your inbox.
        </p>

        {/* Form */}
        {status !== "success" ? (
          <form onSubmit={handleSubmit} noValidate className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  ref={inputRef}
                  type="email"
                  placeholder="Enter your email (e.g., name@example.com)"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={touched && !!validationError}
                  aria-describedby={validationError ? "email-error" : undefined}
                  className={`pl-12 h-14 bg-white/10 border text-white placeholder:text-gray-400 rounded-full focus:bg-white/20 transition-all duration-200 ${
                    touched && validationError 
                      ? "border-red-500/60 focus:border-red-500" 
                      : isValid 
                        ? "border-green-500/60 focus:border-green-500" 
                        : "border-white/20 focus:border-indigo-500"
                  }`}
                />
                {/* Valid indicator */}
                {isValid && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400 animate-in fade-in duration-200" />
                )}
              </div>
              <Button
                type="submit"
                disabled={status === "loading"}
                className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                {status === "loading" ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    Subscribe <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Custom Validation Message */}
            <div 
              className="h-8 mt-3 flex items-start justify-center"
              aria-live="polite"
            >
              {touched && validationError && (
                <div 
                  id="email-error"
                  role="alert"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-lg text-sm animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <span className="text-gray-200">{validationError}</span>
                </div>
              )}
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 text-green-400">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">{message}</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              📧 Check your inbox and click the verification link to complete your subscription.
            </p>
          </div>
        )}

        {/* API Error Message */}
        {status === "error" && message && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-lg text-sm animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <span className="text-gray-200">{message}</span>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Weekly Newsletter</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Job Alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Email Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Unsubscribe Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
