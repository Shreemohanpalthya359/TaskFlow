import React from 'react';

export default function CTA() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center">
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12">
            Start organizing your tasks today
          </h2>

          {/* CTA Button */}
          <button className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  );
}