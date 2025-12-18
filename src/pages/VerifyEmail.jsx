import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState(() => token ? "loading" : "error");
  const [message, setMessage] = useState(() => token ? "" : "Invalid verification link. No token provided.");

  useEffect(() => {
    if (!token) return;

    // Call verify API
    api.get(`/api/subscribers/verify?token=${token}`)
      .then((response) => {
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. Please try again.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You are now subscribed to INTWORK newsletter. You'll receive weekly updates about Java tutorials, Spring Boot guides, and job opportunities.
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white rounded-full px-8"
            >
              Go to Homepage
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/")}
                className="w-full bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white rounded-full"
              >
                Go to Homepage
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document.getElementById('email-subscription')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }, 100);
                }}
                className="w-full rounded-full"
              >
                Subscribe Again
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
