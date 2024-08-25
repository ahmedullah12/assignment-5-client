import { FaCheckCircle } from "react-icons/fa";

const features = [
  {
    title: "Seamless Booking Experience",
    points: [
      "Easy-to-use booking interface",
      "Real-time availability updates",
      "Instant booking confirmation",
      "Flexible rescheduling options",
    ],
  },
  {
    title: "Secure Transactions",
    points: [
      "Encrypted payment processing",
      "Multiple payment options",
      "No hidden fees",
      "Data protection and privacy",
    ],
  },
];

const WhyChooseUs = () => {
  return (
    <div className="py-20">
      <div className="lg:container mx-auto px-6 md:px-12">
        <h2 className="text-[32px] md:text-[40px] font-bold text-center text-primary mb-4">
          Why Choose Us?
        </h2>
        <p className="text-xl text-center text-gray-600 mb-8">
          Discover the advantages that make us the best choice for your room bookings.
        </p>
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-[24px] font-semibold text-primary mb-4">
                {feature.title}
              </h3>
              <ul className="space-y-4 text-gray-600">
                {feature.points.map((point, i) => (
                  <li key={i} className="flex items-center text-lg">
                    <FaCheckCircle className="text-secondary mr-3 text-xl" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
