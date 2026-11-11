
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
                <img
                  src={member.imagePath}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://placehold.co/400x400/e2e8f0/64748b?text=' +
                      member.name.split(' ')[0];
                  }}
                />
              </div>

              {/* Text Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-1 text-gray-900">
                  {member.name}
                </h3>
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
  {
    name: 'Sarvesh R',
    role: 'Growth, Partnerships & Community Associate | Web Development Consultant',
    imagePath: '/sarvesh.jpg',
    bio: 'Sarvesh R serves as the Growth, Partnerships & Community Associate and Web Development Consultant at JuriLingo, contributing to the platform’s strategic growth, partnerships, community engagement, and digital development. Through building collaborative relationships, supporting outreach initiatives, and working on the development and enhancement of the website, Sarvesh contributes to strengthening JuriLingo’s digital presence and expanding its reach among students and aspiring legal professionals. His work brings together an interest in legal technology, digital innovation, and community building, supporting JuriLingo’s vision of making legal education more accessible, engaging, and impactful.',
  },
];

export default TheTeam;
