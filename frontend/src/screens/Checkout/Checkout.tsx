import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useBooking, usePromoCode } from "../../hooks/useBooking";

interface BookingData {
  experienceId: string;
  experienceName: string;
  scheduleId: string;
  date: string;
  time: string;
  quantity: number;
  basePrice: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export const Checkout = (): JSX.Element => {
  const navigate = useNavigate();
  const { createBooking, loading: bookingLoading, error: bookingError } = useBooking();
  const { validatePromoCode, loading: promoLoading, error: promoError } = usePromoCode();
  
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    promoCode: "",
    agreeToTerms: false,
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
  });

  // Load booking data from sessionStorage
  useEffect(() => {
    const storedBookingData = sessionStorage.getItem('bookingData');
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    } else {
      // Redirect to home if no booking data
      navigate('/');
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = { fullName: "", email: "" };
    let isValid = true;

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = "Full name is required (minimum 2 characters)";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = "Valid email address is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear errors on input change
    if (name === 'fullName' && formErrors.fullName) {
      setFormErrors(prev => ({ ...prev, fullName: "" }));
    }
    if (name === 'email' && formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: "" }));
    }
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim() || !bookingData) return;

    try {
      const result = await validatePromoCode({
        promoCode: formData.promoCode,
        amount: bookingData.total
      });
      
      setPromoDiscount(result.discount);
      setPromoApplied(true);
    } catch (error) {
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  const handlePayAndConfirm = async () => {
    console.log('Pay and Confirm clicked');
    console.log('Booking data:', bookingData);
    console.log('Form data:', formData);
    console.log('Terms agreed:', formData.agreeToTerms);
    
    if (!bookingData || !validateForm() || !formData.agreeToTerms) {
      console.log('Validation failed');
      // Show validation error if terms not agreed
      if (!formData.agreeToTerms) {
        alert('Please agree to the terms and safety policy to continue.');
      }
      return;
    }

    try {
      console.log('Starting booking process...');
      const finalAmount = bookingData.total - promoDiscount;
      
      const bookingRequest = {
        experienceId: bookingData.experienceId,
        scheduleId: bookingData.scheduleId,
        fullName: formData.fullName,
        email: formData.email,
        quantity: bookingData.quantity,
        promoCode: promoApplied ? formData.promoCode : undefined,
        totalAmount: finalAmount
      };
      
      console.log('Booking request:', bookingRequest);
      
      const result = await createBooking(bookingRequest);
      console.log('Booking result:', result);

      // Store result for the result page
      const resultData = {
        bookingId: result?.bookingId || 'BK' + Date.now(),
        referenceId: result?.referenceId || 'REF' + Date.now(),
        message: result?.message || 'Booking confirmed successfully'
      };
      
      console.log('Storing result data:', resultData);
      
      // Store in both sessionStorage and localStorage for reliability
      sessionStorage.setItem('bookingResult', JSON.stringify(resultData));
      localStorage.setItem('bookingResult', JSON.stringify(resultData));
      sessionStorage.removeItem('bookingData'); // Clean up
      
      console.log('SessionStorage after setting:', sessionStorage.getItem('bookingResult'));
      console.log('LocalStorage after setting:', localStorage.getItem('bookingResult'));
      
      // Also store individual components for debugging
      sessionStorage.setItem('bookingId', resultData.bookingId);
      sessionStorage.setItem('referenceId', resultData.referenceId);
      
      console.log('Individual storage items:');
      console.log('- bookingId:', sessionStorage.getItem('bookingId'));
      console.log('- referenceId:', sessionStorage.getItem('referenceId'));
      
      console.log('Navigating to result page...');
      
      // Use React Router navigation
      navigate("/result", { 
        replace: true,
        state: { bookingResult: resultData }
      });
    } catch (error) {
      console.error("Booking failed:", error);
      alert('Booking failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      // Don't navigate if booking fails
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const finalTotal = bookingData.total - promoDiscount;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-black mb-8 hover:text-gray-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Checkout
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Messages */}
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                <p>Booking Error: {bookingError}</p>
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-[#EFEFEFFF] rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full h-[40px] bg-[#DFDFDFFF] ${formErrors.fullName ? 'border-red-500' : ''}`}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full h-[40px] bg-[#DFDFDFFF] ${formErrors.email ? 'border-red-500' : ''}`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    name="promoCode"
                    placeholder="Promo code"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="flex-1 w-full h-[40px] bg-[#DFDFDFFF]"
                    disabled={promoApplied}
                  />
                  <Button
                    onClick={handleApplyPromo}
                    disabled={!formData.promoCode.trim() || promoLoading || promoApplied}
                    className="bg-black hover:bg-gray-800 text-white px-6"
                  >
                    {promoLoading ? "..." : promoApplied ? "Applied" : "Apply"}
                  </Button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs mt-1">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="text-green-600 text-xs mt-1">
                    Promo code applied! Discount: ₹{promoDiscount}
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-0.5 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the terms and safety policy
                </label>
              </div>

              {/* Error message for terms */}
              {!formData.agreeToTerms && bookingError && (
                <div className="text-red-500 text-sm">
                  Please agree to the terms and conditions to proceed with booking.
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#EFEFEFFF] rounded-lg p-6 shadow-sm sticky top-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="font-medium">{bookingData.experienceName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date</span>
                  <span className="text-sm font-medium">
                    {new Date(bookingData.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time</span>
                  <span className="text-sm font-medium">{bookingData.time}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Qty</span>
                  <span className="text-sm font-medium">{bookingData.quantity}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">₹{bookingData.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxes</span>
                  <span className="text-sm font-medium">₹{bookingData.taxes}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Promo Discount</span>
                    <span className="text-sm font-medium">-₹{promoDiscount}</span>
                  </div>
                )}

                <hr className="border-gray-300" />

                <div className="flex justify-between items-center">
                  <span className="text-xl font-medium">Total</span>
                  <span className="text-lg font-medium">₹{finalTotal}</span>
                </div>

                <Button
                  onClick={handlePayAndConfirm}
                  className="w-full h-[44px] rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium text-md py-3 mt-6"
                >
                  {bookingLoading ? "Processing..." : "Pay and Confirm"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};