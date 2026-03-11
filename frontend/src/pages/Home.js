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

  // Fetch statistics
  const { data: stats } = useQuery(
    'stats',
    async () => {
      const [sitesResponse, categoriesResponse] = await Promise.all([
        heritage.getAll({ limit: 1 }),
        explore.getCategories(),
      ]);
      return {
        totalSites: sitesResponse.data.total,
        categories: categoriesResponse.data.length,
      };
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Hero slider data
  const heroSlides = [
    {
      title: 'Discover Ancient Temples',
      description: 'Explore the magnificent architecture and spiritual significance of centuries-old temples.',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      cta: 'Explore Temples',
      link: '/explore?category=temple',
    },
    {
      title: 'Serene Heritage Lakes',
      description: 'Experience the tranquility and historical importance of sacred lakes and water bodies.',
      image: 'https://images.unsplash.com/photo-1540206395-68808572332f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      cta: 'Discover Lakes',
      link: '/explore?category=lake',
    },
    {
      title: 'Majestic Forts & Palaces',
      description: 'Step back in time and witness the grandeur of royal forts and palaces.',
      image: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
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
    { label: 'Heritage Sites', value: stats?.totalSites || 5, icon: BuildingLibraryIcon },
    { label: 'Categories', value: stats?.categories || 4, icon: GlobeAltIcon },
    { label: 'Contributors', value: '500+', icon: UserGroupIcon },
    { label: 'Preserved', value: '1000+', icon: HeartIcon },
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
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-slide-up">
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
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center border-white text-white hover:bg-white hover:text-gray-900"
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
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-primary-200" />
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-primary-200">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Culture Heritage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect platform to explore, learn, and contribute to preserving our rich cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Sites Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Heritage Sites
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore some of the most remarkable heritage sites from our collection.
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center space-x-1">
                        <StarIconSolid className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{site.ratings.average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-primary-600 font-medium capitalize">
                        {site.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {site.location.city}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {site.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {site.description}
                    </p>
                    <Link
                      to={`/heritage/${site._id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Explore Site
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No heritage sites available at the moment.</p>
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
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Help Preserve Our Cultural Heritage
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join us in our mission to protect and share the world's cultural treasures. 
            Your contribution makes a real difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              Make a Donation
              <HeartIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/care-the-culture"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 inline-flex items-center justify-center"
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
