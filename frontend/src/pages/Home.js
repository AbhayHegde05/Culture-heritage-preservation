import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  HeartIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { heritage, explore } from '../services/api';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured heritage sites
  const { data: featuredSites, isLoading: featuredLoading } = useQuery(
    'featuredSites',
    () => explore.getTopDestinations({ limit: 6 }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch statistics from the new endpoint
  const { data: stats } = useQuery(
    'heritageStats',
    () => heritage.getStats(),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  // Hero slider data - Indian Heritage Focus
  const heroSlides = [
    {
      title: 'Taj Mahal - Symbol of Eternal Love',
      description: 'Explore the crown jewel of Indian architecture, a UNESCO World Heritage site and testament to eternal love.',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      cta: 'Explore Taj Mahal',
      link: '/explore?category=temple',
    },
    {
      title: 'Varanasi - The Spiritual Capital',
      description: 'Experience the ancient ghats and spiritual aura of India\'s holiest city on the banks of the sacred Ganges.',
      image: 'https://images.unsplash.com/photo-1561361058-4f4f93480940?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      cta: 'Discover Varanasi',
      link: '/explore?category=lake',
    },
    {
      title: 'Amer Fort - Rajasthan\'s Royal Glory',
      description: 'Step back in time and witness the grandeur of Rajasthan\'s majestic hill forts and palaces.',
      image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      cta: 'View Forts',
      link: '/explore?category=fort',
    },
  ];

  // Auto-rotate hero slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const features = [
    {
      icon: BuildingLibraryIcon,
      title: 'Rich Heritage Database',
      description: 'Comprehensive information about thousands of heritage sites with detailed historical context.',
    },
    {
      icon: MapPinIcon,
      title: 'Interactive Maps',
      description: 'Navigate and explore heritage sites with our advanced mapping and location services.',
    },
    {
      icon: HeartIcon,
      title: 'Preservation Efforts',
      description: 'Support and contribute to the preservation of our cultural heritage for future generations.',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Join a community of heritage enthusiasts and contribute your knowledge and experiences.',
    },
  ];

  const statsData = [
    { label: 'Heritage Sites', value: stats?.data?.totalVerified || 0, icon: BuildingLibraryIcon },
    { label: 'Categories', value: stats?.data?.categoryBreakdown?.length || 0, icon: GlobeAltIcon },
    { label: 'Contributors', value: stats?.data?.totalContributors || 0, icon: UserGroupIcon },
    { label: 'Preserved', value: stats?.data?.totalVerified || 0, icon: HeartIcon },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Hero Slider */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(153, 27, 27, 0.5)' }}></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-display text-shadow">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 animate-slide-up" style={{ color: '#ffedd5' }}>
              {heroSlides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to={heroSlides[currentSlide].link}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                {heroSlides[currentSlide].cta}
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/about"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center" style={{ borderColor: '#ffedd5', color: '#ffedd5' }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #b91c1c, #ea580c)', color: '#fff9f0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4" style={{ color: '#fdba74' }} />
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div style={{ color: '#ffedd5' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ backgroundColor: '#fff9f0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-secondary-800 mb-4">
              Discover India\'s Rich Heritage
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto font-serif">
              Explore the land of ancient traditions, magnificent architecture, and diverse cultural treasures that span millennia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 shadow-inner" style={{ backgroundColor: '#ffedd5' }}>
                    <Icon className="w-8 h-8 group-hover:text-white transition-colors duration-300" style={{ color: '#ea580c' }} />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-secondary-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed font-serif">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Sites Section */}
      <section className="py-20" style={{ backgroundColor: '#ffedd5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-secondary-800 mb-4">
              Featured Indian Heritage Sites
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto font-serif">
              Discover India\'s UNESCO World Heritage Sites and architectural wonders from Kashmir to Kanyakumari.
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-secondary-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-secondary-200 rounded mb-3"></div>
                    <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                    <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(featuredSites?.data) ? featuredSites.data.slice(0, 6).map((site) => (
                <div key={site._id} className="card group hover:scale-105 transition-transform duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={site.images?.[0]?.url || 'https://images.unsplash.com/photo-1488282396544-0d9114f9f9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={site.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full border" style={{ backgroundColor: 'rgba(255, 249, 240, 0.9)', borderColor: '#fdba74' }}>
                      <div className="flex items-center space-x-1">
                        <StarIconSolid className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{site.ratings.average.toFixed(1)}</span>
                      </div>
                    </div>
                    {site.status === 'active' && (
                      <div className="absolute top-4 left-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <ShieldCheckIcon className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium font-sans capitalize" style={{ color: '#c2410c' }}>
                        {site.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center text-secondary-500 text-sm font-sans">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {site.location.city}
                      </div>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-secondary-800 mb-2 transition-colors" style={{ color: '#2d2d3a' }}>
                      {site.name}
                    </h3>
                    <p className="text-secondary-600 mb-4 line-clamp-2 font-serif leading-relaxed">
                      {site.description}
                    </p>
                    <Link
                      to={`/heritage/${site._id}`}
                      className="inline-flex items-center font-medium font-sans" style={{ color: '#ea580c' }}
                    >
                      Explore Site
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <p className="text-secondary-600 font-serif">No heritage sites available at the moment.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/explore" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              View All Sites
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)', color: '#fff9f0' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Preserve India\'s Cultural Heritage
          </h2>
          <p className="text-xl mb-8 font-serif leading-relaxed" style={{ color: '#ffedd5' }}>
            Join us in protecting India\'s timeless treasures for future generations. 
            Your contribution helps safeguard our shared heritage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="hover:bg-white font-bold font-sans py-4 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center justify-center shadow-lg" style={{ backgroundColor: '#fff9f0', color: '#b91c1c' }}
            >
              Make a Donation
              <HeartIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/care-the-culture"
              className="font-bold font-sans py-4 px-8 rounded-lg text-lg transition-all duration-200 inline-flex items-center justify-center" style={{ border: '2px solid #ffedd5', color: '#ffedd5' }}
            >
              Contribute Information
              <PlayIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
