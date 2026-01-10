import React from 'react';
import icon1 from "../../assets/images/landing/feature-1.png";
import icon2 from "../../assets/images/landing/feature-2.png";
import icon3 from "../../assets/images/landing/feature-3.png";
import icon4 from "../../assets/images/landing/feature-4.png";

export default function Features() {
  const features = [
    {
      img: icon1,
      title: "Smart Task Management",
      desc: "Create, track your simple meet cascade totally your that set at a of chance."
    },
    {
      img: icon2,
      title: "Secure Authentication",
      desc: "Undertaken you several run to account your early data in anyplace."
    },
    {
      img: icon3,
      title: "Real-Time Collaboration",
      desc: "Set Dont task down that features to organized your remotely."
    },
    {
      img: icon4,
      title: "Clean & Intuitive Design",
      desc: "Unturned user's reside shop minimized hanging use all to the issues."
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose TaskFlow?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features to enhance your productivity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-8"
            >
              {/* Icon Image */}
              <div className="w-full h-40 mb-6 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="h-full object-contain"
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}