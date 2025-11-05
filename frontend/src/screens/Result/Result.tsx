import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";

interface BookingResult {
  bookingId: string;
  referenceId: string;
  message: string;
}

export const Result = (): JSX.Element => {
  const navigate = useNavigate();
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('bookingResult');
    if (storedResult) {
      setBookingResult(JSON.parse(storedResult));
      // Clean up
      sessionStorage.removeItem('bookingResult');
    } else {
      // If no booking result, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleBackToHome = () => {
    navigate("/");
  };

  if (!bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">H</span>
                </div>
                <span className="text-black font-semibold">highway</span>
                <span className="text-gray-500 text-sm">delhi</span>
              </div>
            </div>
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6">
              Search
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center max-w-md w-full">
          {/* Green Checkmark */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Booking Confirmed Text */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Confirmed
          </h1>

          {/* Reference ID */}
          <p className="text-gray-600 mb-8">
            Ref ID: {bookingResult.referenceId}
          </p>

          {/* Back to Home Button */}
          <Button
            onClick={handleBackToHome}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-8 py-2 rounded-md"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};