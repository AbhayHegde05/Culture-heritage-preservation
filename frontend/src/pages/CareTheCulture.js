import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  MapPinIcon,
  StarIcon,
  CameraIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { heritage, explore } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CareTheCulture = () => {
  const { isAuthenticated, user } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch heritage sites
  const { data: sitesData, isLoading, refetch } = useQuery(
    ['heritageSites', selectedCategory, searchQuery],
    () => heritage.getAll({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      limit: 20,
    }),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    explore.getCategories,
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🏛️' },
    { value: 'temple', label: 'Temples', icon: '🛕' },
    { value: 'lake', label: 'Lakes', icon: '🏞️' },
    { value: 'monument', label: 'Monuments', icon: '🗿' },
    { value: 'fort', label: 'Forts', icon: '🏰' },
    { value: 'palace', label: 'Palaces', icon: '🏛️' },
    { value: 'museum', label: 'Museums', icon: '🏛️' },
    { value: 'natural_site', label: 'Natural Sites', icon: '🌿' },
    { value: 'archaeological_site', label: 'Archaeological Sites', icon: '⛏️' },
    { value: 'other', label: 'Other', icon: '📍' },
  ];

  const handleUploadSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to contribute heritage information');
      return;
    }

    try {
      const formData = {
        ...data,
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country || 'India',
          coordinates: {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
          },
        },
        history: {
          established: data.established,
          historicalSignificance: data.historicalSignificance,
          architecture: data.architecture,
          culturalImportance: data.culturalImportance,
        },
        visitorInfo: {
          visitingHours: {
            opening: data.openingTime,
            closing: data.closingTime,
            closedDays: data.closedDays ? data.closedDays.split(',').map(d => d.trim()) : [],
          },
          entryFee: {
            adults: data.adultFee ? parseFloat(data.adultFee) : 0,
            children: data.childFee ? parseFloat(data.childFee) : 0,
            foreigners: data.foreignerFee ? parseFloat(data.foreignerFee) : 0,
          },
          bestTimeToVisit: data.bestTimeToVisit,
          estimatedDuration: data.estimatedDuration,
          facilities: data.facilities ? data.facilities.split(',').map(f => f.trim()) : [],
        },
        images: [], // Will be handled separately with image upload
      };

      await heritage.create(formData);
      toast.success('Heritage site submitted successfully! It will be reviewed by our team.');
      reset();
      setShowUploadForm(false);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit heritage site');
    }
  };

  const filteredSites = Array.isArray(sitesData?.data) ? sitesData.data.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 to-accent-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Care for Our Culture
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-100 mb-8">
              Explore heritage sites shared by our community and contribute your knowledge 
              to help preserve our cultural legacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                Contribute Heritage Site
              </button>
              <Link
                to="/donate"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-6 rounded-lg text-lg transition-all duration-200 inline-flex items-center justify-center"
              >
                <HeartIcon className="w-5 h-5 mr-2" />
                Support Preservation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Contribute Heritage Site</h2>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleUploadSubmit)} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name *
                    </label>
                    <input
                      {...register('name', { required: 'Site name is required' })}
                      className="input-field"
                      placeholder="Enter heritage site name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select {...register('category', { required: 'Category is required' })} className="input-field">
                      <option value="">Select category</option>
                      {categories.slice(1).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={3}
                      className="input-field"
                      placeholder="Describe the heritage site and its significance"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      {...register('address', { required: 'Address is required' })}
                      className="input-field"
                      placeholder="Complete address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      className="input-field"
                      placeholder="City name"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      {...register('state', { required: 'State is required' })}
                      className="input-field"
                      placeholder="State name"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      {...register('latitude', { required: 'Latitude is required' })}
                      type="number"
                      step="any"
                      className="input-field"
                      placeholder="e.g., 28.6139"
                    />
                    {errors.latitude && (
                      <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      {...register('longitude', { required: 'Longitude is required' })}
                      type="number"
                      step="any"
                      className="input-field"
                      placeholder="e.g., 77.2090"
                    />
                    {errors.longitude && (
                      <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Historical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Establishment Period *
                    </label>
                    <input
                      {...register('established', { required: 'Establishment period is required' })}
                      className="input-field"
                      placeholder="e.g., 12th Century, 1850, Ancient"
                    />
                    {errors.established && (
                      <p className="text-red-500 text-sm mt-1">{errors.established.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Historical Significance *
                    </label>
                    <textarea
                      {...register('historicalSignificance', { required: 'Historical significance is required' })}
                      rows={3}
                      className="input-field"
                      placeholder="Describe the historical importance of this site"
                    />
                    {errors.historicalSignificance && (
                      <p className="text-red-500 text-sm mt-1">{errors.historicalSignificance.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Architecture (Optional)
                    </label>
                    <input
                      {...register('architecture')}
                      className="input-field"
                      placeholder="Architectural style and features"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cultural Importance (Optional)
                    </label>
                    <textarea
                      {...register('culturalImportance')}
                      rows={2}
                      className="input-field"
                      placeholder="Cultural significance and traditions"
                    />
                  </div>
                </div>
              </div>

              {/* Visitor Information (Optional) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Information (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Time
                    </label>
                    <input
                      {...register('openingTime')}
                      className="input-field"
                      placeholder="e.g., 9:00 AM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closing Time
                    </label>
                    <input
                      {...register('closingTime')}
                      className="input-field"
                      placeholder="e.g., 6:00 PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adult Fee (INR)
                    </label>
                    <input
                      {...register('adultFee')}
                      type="number"
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child Fee (INR)
                    </label>
                    <input
                      {...register('childFee')}
                      type="number"
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Best Time to Visit
                    </label>
                    <input
                      {...register('bestTimeToVisit')}
                      className="input-field"
                      placeholder="e.g., October to March"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facilities (comma-separated)
                    </label>
                    <input
                      {...register('facilities')}
                      className="input-field"
                      placeholder="e.g., Parking, Restrooms, Guide Service"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit Heritage Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search heritage sites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Sites Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
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
          ) : filteredSites.length === 0 ? (
            <div className="text-center py-12">
              <BuildingLibraryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No heritage sites found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'Be the first to contribute a heritage site!'}
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Heritage Site
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Heritage Sites ({filteredSites.length})
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Contributed by community</span>
                  <HeartIcon className="w-4 h-4 text-red-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSites.map((site) => (
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
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {site.category.replace('_', ' ')}
                        </span>
                      </div>
                      {!site.verified && (
                        <div className="absolute bottom-4 left-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          Pending Review
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {site.location.city}, {site.location.state}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {site.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {site.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/heritage/${site._id}`}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Explore Site
                          <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </Link>
                        {site.contributedBy && (
                          <div className="text-xs text-gray-500">
                            by {site.contributedBy.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CareTheCulture;
