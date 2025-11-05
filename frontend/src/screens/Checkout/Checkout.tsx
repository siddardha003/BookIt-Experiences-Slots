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
    if (!bookingData || !validateForm() || !formData.agreeToTerms) return;

    try {
      const finalAmount = bookingData.total - promoDiscount;
      
      const result = await createBooking({
        experienceId: bookingData.experienceId,
        scheduleId: bookingData.scheduleId,
        fullName: formData.fullName,
        email: formData.email,
        quantity: bookingData.quantity,
        promoCode: promoApplied ? formData.promoCode : undefined,
        totalAmount: finalAmount
      });

      // Store result for the result page
      sessionStorage.setItem('bookingResult', JSON.stringify(result));
      sessionStorage.removeItem('bookingData'); // Clean up
      
      navigate("/result");
    } catch (error) {
      console.error("Booking failed:", error);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 mb-8 hover:text-gray-800"
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
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name *
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full ${formErrors.fullName ? 'border-red-500' : ''}`}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full ${formErrors.email ? 'border-red-500' : ''}`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    name="promoCode"
                    placeholder="Enter promo code (e.g., SAVE10, FLAT100)"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="flex-1"
                    disabled={promoApplied}
                  />
                  <Button
                    onClick={handleApplyPromo}
                    disabled={!formData.promoCode.trim() || promoLoading || promoApplied}
                    className="bg-black hover:bg-gray-800 text-white px-6 disabled:bg-gray-400"
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
                  className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the terms and safety policy *
                </label>
              </div>
            </div>
          </div>

          {/* Right Section - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-gray-600">Experience</span>
                    <p className="font-semibold">{bookingData.experienceName}</p>
                  </div>
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

                <hr className="border-gray-200" />

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

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold">₹{finalTotal}</span>
                </div>

                <Button
                  onClick={handlePayAndConfirm}
                  disabled={!formData.agreeToTerms || bookingLoading || !validateForm()}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 mt-6 disabled:bg-gray-300 disabled:text-gray-500"
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