import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useExperienceDetail } from "../../hooks/useExperiences";
import { Schedule } from "../../services/experiencesService";
import { Input } from "../../components/ui/input";

export const ExperienceDetail = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { experience, loading, error } = useExperienceDetail(id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // Set default selected schedule when experience loads
  useEffect(() => {
    if (experience?.schedules && experience.schedules.length > 0 && !selectedSchedule) {
      setSelectedSchedule(experience.schedules[0]);
    }
  }, [experience, selectedSchedule]);

  const basePrice = experience?.price || 0;
  const taxes = Math.round(basePrice * 0.18); // 18% tax
  const subtotal = basePrice * quantity;
  const total = subtotal + taxes;

  const handleConfirm = () => {
    if (!experience || !selectedSchedule) return;
    
    // Store booking data in sessionStorage for checkout
    const bookingData = {
      experienceId: experience.id,
      experienceName: experience.name,
      scheduleId: selectedSchedule.id,
      date: selectedSchedule.date,
      time: selectedSchedule.time,
      quantity,
      basePrice,
      subtotal,
      taxes,
      total
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Experience Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The experience you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/')} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Group schedules by date
  const schedulesByDate = experience.schedules.reduce((acc, schedule) => {
    const date = new Date(schedule.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative">
              <img
                src={experience.image_url || "/frame-9.png"}
                alt={experience.name}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>

            <div>
              <h1 className="text-3xl font-medium mb-4">{experience.name}</h1>
              <p className="text-gray-600">
                {experience.description || experience.short_description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-medium mb-4">Choose date</h2>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(schedulesByDate).map(([date, schedules]) => (
                  <button
                    key={date}
                    onClick={() => setSelectedSchedule(schedules[0])}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSchedule && schedules.some(s => s.id === selectedSchedule.id)
                        ? "bg-[#FFD700] border-[#FFD700] font-semibold"
                        : "bg-white border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium mb-4">Choose time</h2>
              <div className="flex gap-2 flex-wrap">
                {selectedSchedule && 
                  schedulesByDate[
                    new Date(selectedSchedule.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  ]?.map((schedule) => (
                    <button
                      key={schedule.id}
                      onClick={() => schedule.slots_available > 0 && setSelectedSchedule(schedule)}
                      disabled={schedule.slots_available === 0}
                      className={`px-4 py-2 rounded-lg border relative ${
                        schedule.slots_available === 0
                          ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                          : selectedSchedule?.id === schedule.id
                          ? "bg-[#FFD700] border-[#FFD700] font-semibold"
                          : "bg-white border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {schedule.time}
                      {schedule.slots_available > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {schedule.slots_available} left
                        </span>
                      )}
                      {schedule.slots_available === 0 && (
                        <span className="ml-2 text-xs">Sold out</span>
                      )}
                    </button>
                  ))
                }
              </div>
              <p className="text-xs text-gray-500 mt-2">
                All times are in IST (GMT +5:30)
              </p>
            </div>

            <div>
              <h2 className="text-xl font-medium mb-4">About</h2>
              <p className="text-gray-600 bg-[#ececec] p-4 rounded-lg">
                {experience.description || "Scenic routes, trained guides, and safety briefing."}
                {experience.min_age && ` Minimum age ${experience.min_age}.`}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#ececec] p-6 rounded-lg shadow-sm sticky top-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Starts at</span>
                  <span className="text-lg font-medium">₹{basePrice}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">₹{taxes}</span>
                </div>

                <div className="pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-medium">₹{total}</span>
                  </div>
                  <Button 
                    onClick={handleConfirm}
                    disabled={!selectedSchedule || selectedSchedule.slots_available === 0}
                    className="w-full bg-[#FFD700] hover:bg-[#FFC700] text-gray-800 font-medium py-6 text-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl"
                  >
                    {!selectedSchedule 
                      ? "Select Date & Time" 
                      : selectedSchedule.slots_available === 0 
                      ? "Sold Out" 
                      : "Confirm"
                    }
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
