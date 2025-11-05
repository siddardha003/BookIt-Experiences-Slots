import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
interface BookingResult {
  bookingId: string;
  referenceId: string;
  message: string;
}

export const Result = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Result component mounted');
    console.log('Location state:', location.state);
    
    const checkForBookingResult = () => {
      // Method 1: Check React Router state
      if (location.state?.bookingResult) {
        console.log('Found booking result in location state:', location.state.bookingResult);
        setBookingResult(location.state.bookingResult);
        setLoading(false);
        return;
      }
      
      // Method 2: Check sessionStorage
      const storedResult = sessionStorage.getItem('bookingResult');
      console.log('Stored result from sessionStorage:', storedResult);
      
      if (storedResult) {
        try {
          const parsedResult = JSON.parse(storedResult);
          console.log('Parsed result from sessionStorage:', parsedResult);
          setBookingResult(parsedResult);
          setLoading(false);
          // Clean up after successfully setting the result
          sessionStorage.removeItem('bookingResult');
          console.log('Successfully loaded booking result from sessionStorage');
          return;
        } catch (error) {
          console.error('Error parsing booking result from sessionStorage:', error);
        }
      }
      
      // Method 3: Check localStorage
      const localStoredResult = localStorage.getItem('bookingResult');
      console.log('Stored result from localStorage:', localStoredResult);
      
      if (localStoredResult) {
        try {
          const parsedResult = JSON.parse(localStoredResult);
          console.log('Parsed result from localStorage:', parsedResult);
          setBookingResult(parsedResult);
          setLoading(false);
          // Clean up after successfully setting the result
          localStorage.removeItem('bookingResult');
          console.log('Successfully loaded booking result from localStorage');
          return;
        } catch (error) {
          console.error('Error parsing booking result from localStorage:', error);
        }
      }
      
      // Method 4: Check individual sessionStorage items
      const bookingId = sessionStorage.getItem('bookingId');
      const referenceId = sessionStorage.getItem('referenceId');
      
      console.log('Individual storage items:', { bookingId, referenceId });
      
      if (bookingId && referenceId) {
        const reconstructedResult = {
          bookingId,
          referenceId,
          message: 'Booking confirmed successfully'
        };
        console.log('Reconstructed booking result from individual items:', reconstructedResult);
        setBookingResult(reconstructedResult);
        setLoading(false);
        // Clean up
        sessionStorage.removeItem('bookingId');
        sessionStorage.removeItem('referenceId');
        return;
      }
      
      console.log('No booking result found anywhere');
      setLoading(false);
      // Only redirect if no data is found anywhere
      navigate('/');
    };

    // Check immediately
    checkForBookingResult();
  }, [navigate, location]);

  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No booking information found.</p>
          <Button onClick={handleBackToHome} className="bg-yellow-400 hover:bg-yellow-500 text-black">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex w-full items-center justify-between px-[124px] py-4 bg-[#f8f8f8] shadow-[0px_2px_16px_#0000001a]">
      <img
        className="w-[100px] h-[55px] object-cover"
        alt="Hdlogo"
        src="/hdlogo-1.png"
      />

        <div className="inline-flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search experiences"
            className="w-[340px] h-[42px] bg-[#ececec] border-0 text-sm text-[#727272] placeholder:text-[#727272] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button className="h-auto bg-[#ffd643] hover:bg-[#ffd643]/90 text-[#161616] font-medium text-sm px-5 py-3 rounded-lg">
            Search
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="text-center bg-white items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-20">
          {/* Green Checkmark */}
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Booking Confirmed Text */}
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Booking Confirmed
          </h1>

          {/* Reference ID */}
          <div className="flex p-2 items-center justify-center gap-2 mb-8">
            <p className="text-2xl text-gray-500">Ref ID:</p>
            <p className="text-2xl text-gray-500">
              {bookingResult.referenceId}
            </p>
          </div>

          {/* Back to Home Button */}
          <Button
            onClick={handleBackToHome}
            className="w-auto bg-gray-200 text-gray-500 text-md font-medium rounded-sm"
          >
            Back to Home
          </Button>
      </div>
    </div>
  );
};