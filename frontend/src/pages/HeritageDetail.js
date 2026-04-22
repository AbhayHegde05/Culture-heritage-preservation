import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  MapPinIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  GlobeAltIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon,
  UserIcon,
  ChevronLeftIcon,
  XMarkIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import ImageGallery from 'react-image-gallery';
import { heritage, donations } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HeritageDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch heritage site details
  const { data: site, isLoading, error } = useQuery(
    ['heritageSite', id],
    () => heritage.getById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Add review mutation
  const addReviewMutation = useMutation(heritage.addReview, {
    onSuccess: () => {
      queryClient.invalidateQueries(['heritageSite', id]);
      toast.success('Review added successfully!');
      setShowReviewForm(false);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add review');
    },
  });

  const handleReviewSubmit = (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to add a review');
      return;
    }

    addReviewMutation.mutate({
      id,
      ...data,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: site?.name,
          text: site?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDonate = () => {
    if (!isAuthenticated) {
      toast.error('Please login to make a donation');
      return;
    }
    setShowDonateModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header skeleton */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        {/* Hero skeleton */}
        <div className="h-96 lg:h-[500px] bg-gray-200 animate-pulse"></div>
        {/* Content skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="h-6 w-16 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                      <div className="h-3 w-12 bg-gray-200 rounded mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded mb-2 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 h-48 animate-pulse"></div>
              <div className="bg-white rounded-xl shadow-lg p-6 h-48 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Heritage Site Not Found</h2>
          <p className="text-gray-600 mb-6">The heritage site you're looking for doesn't exist.</p>
          <Link to="/explore" className="btn-primary">
            Explore Other Sites
          </Link>
        </div>
      </div>
    );
  }

  const images = site.images?.length > 0 
    ? site.images.map(img => ({
        original: img.url,
        thumbnail: img.url,
        description: img.caption || site.name,
      }))
    : [{
        original: 'https://images.unsplash.com/photo-1488282396544-0d9114f9f9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1488282396544-0d9114f9f9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        description: site.name,
      }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/explore" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeftIcon className="w-5 h-5 mr-1" />
              Back to Explore
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ShareIcon className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button
                onClick={handleDonate}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
              >
                <HeartIcon className="w-5 h-5" />
                <span>Donate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Gallery */}
      <section className="relative">
        {images.length > 1 ? (
          <div className="relative">
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={true}
              showNav={true}
              showBullets={true}
              onSlide={(currentIndex) => setCurrentImageIndex(currentIndex)}
            />
          </div>
        ) : (
          <div className="relative h-96 lg:h-[500px]">
            <img
              src={images[0].original}
              alt={site.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{site.name}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center space-x-1">
                  <StarIconSolid className="w-5 h-5 text-yellow-400" />
                  <span>{site.ratings.average.toFixed(1)}</span>
                  <span className="text-gray-300">({site.ratings.count} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{site.location.city}, {site.location.state}</span>
                </div>
                {site.verified && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{site.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <span className="block text-2xl font-bold text-primary-600 capitalize">
                    {site.category.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-600">Category</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <span className="block text-2xl font-bold text-primary-600">
                    {site.history.established}
                  </span>
                  <span className="text-sm text-gray-600">Established</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <span className="block text-2xl font-bold text-primary-600">
                    {site.ratings.average.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600">Rating</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <span className="block text-2xl font-bold text-primary-600">
                    {site.ratings.count}
                  </span>
                  <span className="text-sm text-gray-600">Reviews</span>
                </div>
              </div>
            </div>

            {/* Historical Significance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Historical Significance</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {site.history.historicalSignificance}
              </p>
              {site.history.architecture && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Architecture</h3>
                  <p className="text-gray-700">{site.history.architecture}</p>
                </div>
              )}
              {site.history.culturalImportance && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cultural Importance</h3>
                  <p className="text-gray-700">{site.history.culturalImportance}</p>
                </div>
              )}
            </div>

            {/* Visitor Information */}
            {site.visitorInfo && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Visitor Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {site.visitorInfo.visitingHours && (
                    <div className="flex items-start space-x-3">
                      <ClockIcon className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Visiting Hours</h3>
                        <p className="text-gray-600">
                          {site.visitorInfo.visitingHours.opening} - {site.visitorInfo.visitingHours.closing}
                        </p>
                        {site.visitorInfo.visitingHours.closedDays?.length > 0 && (
                          <p className="text-sm text-gray-500">
                            Closed: {site.visitorInfo.visitingHours.closedDays.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {site.visitorInfo.entryFee && (
                    <div className="flex items-start space-x-3">
                      <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Entry Fee</h3>
                        <p className="text-gray-600">
                          Adults: ₹{site.visitorInfo.entryFee.adults || 0}
                        </p>
                        {site.visitorInfo.entryFee.children && (
                          <p className="text-gray-600">
                            Children: ₹{site.visitorInfo.entryFee.children}
                          </p>
                        )}
                        {site.visitorInfo.entryFee.foreigners && (
                          <p className="text-gray-600">
                            Foreigners: ${site.visitorInfo.entryFee.foreigners}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {site.visitorInfo.bestTimeToVisit && (
                    <div className="flex items-start space-x-3">
                      <CalendarIcon className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Best Time to Visit</h3>
                        <p className="text-gray-600">{site.visitorInfo.bestTimeToVisit}</p>
                      </div>
                    </div>
                  )}

                  {site.visitorInfo.estimatedDuration && (
                    <div className="flex items-start space-x-3">
                      <ClockIcon className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Estimated Duration</h3>
                        <p className="text-gray-600">{site.visitorInfo.estimatedDuration}</p>
                      </div>
                    </div>
                  )}
                </div>

                {site.visitorInfo.facilities?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Available Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {site.visitorInfo.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-700">{site.location.address}</p>
                    <p className="text-gray-600">
                      {site.location.city}, {site.location.state}, {site.location.country}
                    </p>
                  </div>
                </div>

                {site.contact?.phone && (
                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mt-1" />
                    <p className="text-gray-700">{site.contact.phone}</p>
                  </div>
                )}

                {site.contact?.website && (
                  <div className="flex items-start space-x-3">
                    <GlobeAltIcon className="w-5 h-5 text-gray-400 mt-1" />
                    <a
                      href={site.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPinIcon className="w-8 h-8 mx-auto mb-2" />
                  <p>Interactive Map</p>
                  <p className="text-sm">({site.location.coordinates.latitude}, {site.location.coordinates.longitude})</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn-primary"
                >
                  Add Review
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                  <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <select
                        {...register('rating', { required: 'Rating is required' })}
                        className="input-field"
                      >
                        <option value="">Select rating</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                      {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                      </label>
                      <textarea
                        {...register('comment', { required: 'Review comment is required' })}
                        rows={4}
                        className="input-field"
                        placeholder="Share your experience..."
                      />
                      {errors.comment && (
                        <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visit Date (Optional)
                      </label>
                      <input
                        {...register('visitDate')}
                        type="date"
                        className="input-field"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={addReviewMutation.isLoading}
                        className="btn-primary disabled:opacity-50"
                      >
                        {addReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {site.reviews?.length > 0 ? (
                  site.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <StarIconSolid
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.visitDate && (
                                <span>• {new Date(review.visitDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-13">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">{site.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Established</span>
                  <span className="font-medium">{site.history.established}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <StarIconSolid className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">{site.ratings.average.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-medium">{site.ratings.count}</span>
                </div>
              </div>
            </div>

            {/* Donate Card */}
            <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Support Preservation</h3>
              <p className="text-primary-100 mb-6">
                Help us preserve this heritage site for future generations.
              </p>
              <button
                onClick={handleDonate}
                className="w-full bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Donate Now
              </button>
            </div>

            {/* Accessibility */}
            {site.accessibility && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Accessibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${
                      site.accessibility.wheelchairAccess ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-gray-700">Wheelchair Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${
                      site.accessibility.parkingAvailable ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-gray-700">Parking Available</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Make a Donation</h3>
              <button
                onClick={() => setShowDonateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Your donation will help preserve {site.name} for future generations.
            </p>
            <Link
              to="/donate"
              state={{ heritageSite: site }}
              className="btn-primary w-full text-center"
              onClick={() => setShowDonateModal(false)}
            >
              Continue to Donation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeritageDetail;
