'use client';

import React from 'react';

const colors = {
  teal: '#005F63',
  gold: '#E3B65B',
};

const TheTeam = () => {
  return (
    <section className="w-full py-20 px-4" style={{ backgroundColor: '#F8FAF8' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: colors.teal }}
          >
            Meet the Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate people behind JuriLingo — dedicated to making legal
            education accessible, engaging, and empowering for everyone.
          </p>
          <div
            className="mt-6 mx-auto h-1 w-20 rounded-full"
            style={{ backgroundColor: colors.gold }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Image Section */}
              <div className="w-full h-[450px] bg-gray-200 relative">
                {/* 
                  To show their real pictures, save the images in your 'public' folder 
                  with the exact filenames below (e.g., jurilingo/public/srineetha.jpg) 
                */}
                <img
                  src={member.imagePath}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image is not found yet
                    e.target.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=' + member.name.split(' ')[0];
                  }}
                />
              </div>

              {/* Text Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-1 text-gray-900">{member.name}</h3>
                <p className="text-[#E3B65B] font-bold tracking-wide uppercase text-sm mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Data array for team members
const teamMembers = [
  {
    name: 'TVS Srineetha',
    role: 'Growth and Strategy Partner',
    imagePath: '/srineetha.jpg',
    bio: 'Srineetha, the Growth & Strategy Partner at JuriLingo, drives the platform’s outreach, growth, and strategic initiatives. With a naturally curious and analytical mindset, she brings a thoughtful approach to understanding challenges, identifying opportunities, and supporting the platform’s evolving vision. Srineetha values integrity, adaptability, and meaningful collaboration in her work, helping her contribute to strengthening the platform’s reach while supporting opportunities for sustainable and impactful growth.',
  },
  {
    name: 'Ananya R S',
    role: 'Web Development Consultant',
    imagePath: '/ananya.jpg',
    bio: 'Ananya serves as the Web Development Consultant at JuriLingo, contributing to the platform’s digital development and web experience. Through frontend development, website enhancement, and optimisation efforts, Ananya supports the creation of an intuitive and student-friendly platform designed to make legal learning more accessible and easy to navigate. As part of the JuriLingo team, she contributes to building a responsive and seamless digital environment that supports meaningful engagement and an improved learning experience for students and aspiring legal professionals.',
  },
  {
    name: 'Chhavi Agarwal',
    role: 'Digital Content Coordinator',
    imagePath: '/chhavi.jpg',
    bio: 'Chhavi Agarwal is the Digital Content Coordinator at JuriLingo, where she contributes to the platform’s digital and creative initiatives. Through visual storytelling and content coordination, Chhavi plays a key role in maintaining JuriLingo’s presence across digital platforms, helping ensure that legal discussions are presented in a manner that is accessible, engaging, and easy to follow. Her work reflects a thoughtful approach to creating content that connects with students while supporting the platform’s broader educational vision.',
  },
  {
    name: 'Aanchal Singh',
    role: 'Media Production Coordinator',
    imagePath: '/aanchal.jpg',
    bio: 'Aanchal Singh is the Media Production Coordinator at JuriLingo, contributing to the platform through videography and podcast production. Working behind the camera, Aanchal plays a role in bringing meaningful legal discussions to audiences through thoughtfully produced visual content. Her work contributes to creating an interactive and engaging learning environment that encourages students to connect with ideas, experiences, and conversations within the legal field.',
  },
];

export default TheTeam;
