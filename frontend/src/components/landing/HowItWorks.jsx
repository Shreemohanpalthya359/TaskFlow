import React from 'react';
import step1 from "../../assets/images/landing/how-1.png";
import step2 from "../../assets/images/landing/how-2.png";
import step3 from "../../assets/images/landing/how-3.png";

export default function HowItWorks() {
  const steps = [
    {
      img: step1,
      title: "Create an Account",
      desc: "Create an account completes, than and your finalize your footsteping tasks most phase."
    },
    {
      img: step2,
      title: "Add Your Tasks",
      desc: "Your made largest slwards an trimpade hayors then to sphere tasks ways ua secure."
    },
    {
      img: step3,
      title: "Track Your Progress Daily",
      desc: "Prede tour tasclass mains account thur tasks your make tash an tasks thouk."
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in 3 simple steps. Productivity.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-2xl p-8 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Step Image */}
              <img
                src={step.img}
                alt={step.title}
                className="w-full h-52 object-contain mb-6"
              />

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {[0, 1, 2, 3, 4].map((dot, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === 0 ? 'bg-indigo-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}