import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  HeartIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { heritage } from '../services/api';
import { teamMembers } from '../config/constants';

const About = () => {
  // Fetch dynamic stats
  const { data: stats } = useQuery('heritageStats', () => heritage.getStats(), {
    staleTime: 10 * 60 * 1000,
  });

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Preservation First',
      description: 'We prioritize the protection and conservation of heritage sites above all else.',
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to make heritage accessible to everyone.',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Empowering local communities to take ownership of their cultural heritage.',
    },
    {
      icon: GlobeAltIcon,
      title: 'National Reach',
      description: 'Connecting Indians from Kashmir to Kanyakumari through shared cultural heritage.',
    },
  ];

  const achievements = [
    { label: 'Indian Heritage Sites', value: stats?.data?.totalVerified || 0, icon: BuildingLibraryIcon },
    { label: 'Active Contributors', value: stats?.data?.totalContributors || 0, icon: UserGroupIcon },
    { label: 'States Covered', value: '28+', icon: GlobeAltIcon },
    { label: 'Categories', value: stats?.data?.categoryBreakdown?.length || 0, icon: AcademicCapIcon },
  ];

  const partners = [
    { name: 'UNESCO', logo: '🏛️' },
    { name: 'World Monuments Fund', logo: '🏺' },
    { name: 'National Geographic', logo: '📸' },
    { name: 'Heritage Foundation', logo: '🏛️' },
    { name: 'Cultural Ministry', logo: '🏛️' },
    { name: 'Archaeological Society', logo: '🏺' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 to-accent-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Preserving India's Cultural Heritage
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-100">
              We are dedicated to preserving, documenting, and sharing India's magnificent cultural 
              heritage through innovative digital solutions and community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-parchment border-2 border-accent-500/30 rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Gold decorative border */}
            <div className="absolute inset-0 border-4 border-accent-500/20 rounded-2xl pointer-events-none"></div>
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-primary-800 mb-6 font-display">Our Mission</h2>
                  <p className="text-lg text-charcoal mb-6 leading-relaxed serif">
                    Our mission is to create a comprehensive digital platform that preserves and showcases
                    India's rich cultural heritage for future generations. We believe that by making heritage
                    accessible, we can foster greater appreciation and understanding of our shared Indian history.
                  </p>
                  <p className="text-lg text-charcoal mb-8 leading-relaxed serif">
                    Through advanced technology, community collaboration, and partnerships with ASI and cultural
                    institutions, we work tirelessly to document, protect, and promote India's most precious
                    temples, forts, monuments, and traditions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/care-the-culture" className="btn-royal inline-flex items-center justify-center">
                      Explore Our Work
                      <HeartIcon className="w-5 h-5 ml-2" />
                    </Link>
                    <Link to="/donate" className="btn-outline inline-flex items-center justify-center">
                      Support Our Mission
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1488282396544-0d9114f9f9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Heritage preservation"
                    className="rounded-2xl shadow-2xl border-2 border-accent-500/20"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-primary-800 text-white p-6 rounded-xl shadow-xl border-2 border-accent-500/30">
                    <div className="flex items-center space-x-3">
                      <BuildingLibraryIcon className="w-8 h-8 text-accent-500" />
                      <div>
                        <div className="text-2xl font-bold font-display">{stats?.data?.totalVerified || '0'}</div>
                        <div className="text-accent-400">Indian Sites</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and shape our approach to heritage preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Numbers that reflect our commitment to preserving cultural heritage worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-primary-200" />
                  <div className="text-3xl md:text-4xl font-bold mb-2">{achievement.value}</div>
                  <div className="text-primary-200">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate professionals dedicated to preserving our cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 right-1/2 transform translate-x-16 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Collaborating with leading organizations to advance heritage preservation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="text-center group">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {partner.logo}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{partner.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or want to contribute to our mission? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">info@cultureheritage.org</p>
              <p className="text-gray-600">support@cultureheritage.org</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-gray-600">Mon-Fri 9AM-6PM EST</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Heritage Street</p>
              <p className="text-gray-600">Cultural District, CD 12345</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/donate" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              Support Our Work
              <HeartIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
