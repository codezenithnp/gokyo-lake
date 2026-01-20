import { FiInfo } from "react-icons/fi";

const PoliciesPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
            Our Policies
          </h1>
        </div>

        {/* Highlighted Info Box */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-12">
          <div className="flex">
            <div className="py-1"><FiInfo className="h-6 w-6 text-yellow-500 mr-4" /></div>
            <div>
              <h3 className="font-bold text-yellow-800">Booking Information</h3>
              <p className="text-yellow-700 text-sm">
                Please note that we do not process payments online. All bookings are handled as inquiries via WhatsApp, email, or phone. Confirmation is subject to availability.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10 text-gray-700">
          {/* Check-in & Check-out */}
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-4 border-b pb-2">Check-in & Check-out</h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Check-in Time:</strong> From 2:00 PM</li>
              <li><strong>Check-out Time:</strong> Until 12:00 PM (noon)</li>
              <li>A valid government-issued photo ID (passport for foreigners, citizenship/license for Nepalis) is required upon check-in.</li>
              <li>Late check-out may be available upon request and is subject to availability and additional charges.</li>
            </ul>
          </div>

          {/* Cancellation Policy */}
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-4 border-b pb-2">Cancellation Policy</h2>
            <p className="mb-2">Our cancellation policy is designed to be fair to both our guests and our establishment:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Full Refund:</strong> Cancellations made more than 7 days prior to the check-in date.</li>
              <li><strong>50% Refund:</strong> Cancellations made between 3 to 7 days prior to the check-in date.</li>
              <li><strong>No Refund:</strong> Cancellations made within 48 hours of the check-in date.</li>
              <li>No-shows will be charged the full amount of the reservation.</li>
            </ul>
          </div>

          {/* House Rules */}
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-4 border-b pb-2">House Rules</h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Smoking is strictly prohibited inside all rooms and enclosed public areas. Designated smoking areas are available outside.</li>
              <li><strong>Quiet hours</strong> are observed from 10:00 PM to 7:00 AM to ensure a peaceful environment for all guests.</li>
              <li>Guests are responsible for any damage to hotel property and will be charged accordingly.</li>
              <li>Please conserve energy and water to help us protect our beautiful environment.</li>
            </ul>
          </div>

          {/* Children & Extra Beds */}
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-4 border-b pb-2">Children & Extra Beds</h2>
            <p>
              Children are welcome at our hotel. Policies regarding extra beds are dependent on the room type booked. Please contact us directly for specific inquiries about accommodating children or for requests for extra bedding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;
