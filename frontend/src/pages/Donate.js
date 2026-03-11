import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { donations, heritage } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Load Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Donation Form Component
const DonationForm = ({ selectedSite, onDonationSuccess }) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('general');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (amount) => {
    setCustomAmount(amount);
    setDonationAmount('');
  };

  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      return;
    }

    const finalAmount = customAmount || donationAmount;
    if (!finalAmount || parseFloat(finalAmount) < 1) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await donations.createPaymentIntent({
        amount: parseFloat(finalAmount),
        currency: 'INR',
      });

      const { clientSecret, paymentIntentId } = response.data;

      // Confirm payment
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.name || data.name,
            email: user?.email || data.email,
          },
        },
      });

      if (paymentError) {
        toast.error(paymentError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Process donation
        await donations.processDonation({
          amount: parseFloat(finalAmount),
          currency: 'INR',
          paymentMethod: 'card',
          paymentId: paymentIntentId,
          donationType,
          heritageSite: selectedSite?._id,
          isAnonymous,
          message: data.message,
        });

        toast.success('Thank you for your generous donation!');
        reset();
        setDonationAmount('');
        setCustomAmount('');
        onDonationSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Donation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Donation Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Donation Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDonationType('general')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              donationType === 'general'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="w-6 h-6 text-primary-600" />
              <div>
                <div className="font-medium">General Fund</div>
                <div className="text-sm text-gray-600">Support overall preservation efforts</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDonationType('site_specific')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              donationType === 'site_specific'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${!selectedSite ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedSite}
          >
            <div className="flex items-center space-x-3">
              <BuildingLibraryIcon className="w-6 h-6 text-primary-600" />
              <div>
                <div className="font-medium">Site Specific</div>
                <div className="text-sm text-gray-600">
                  {selectedSite ? selectedSite.name : 'Select a heritage site'}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Donation Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Amount (INR)
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleAmountSelect(amount)}
              className={`py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                donationAmount === amount
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              ₹{amount}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            ₹
          </span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            min="1"
          />
        </div>
      </div>

      {/* Personal Information (for non-logged in users) */}
      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="input-field"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="input-field"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Payment Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information *
        </label>
        <div className="p-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Anonymous Donation */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="anonymous" className="text-sm text-gray-700">
          Make this donation anonymous
        </label>
      </div>

      {/* Message (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message (Optional)
        </label>
        <textarea
          {...register('message')}
          rows={3}
          className="input-field"
          placeholder="Share why you're supporting heritage preservation..."
          maxLength={500}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || (!donationAmount && !customAmount)}
        className="w-full btn-primary py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <div className="loading-spinner w-5 h-5 mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <HeartIcon className="w-5 h-5 mr-2" />
            Donate ₹{customAmount || donationAmount || '0'}
          </>
        )}
      </button>

      {/* Security Note */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <ShieldCheckIcon className="w-4 h-4" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
};

const Donate = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  // Fetch heritage sites for site-specific donations
  const { data: sitesData } = useQuery(
    'heritageSitesForDonation',
    () => heritage.getAll({ limit: 10 }),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  const handleDonationSuccess = () => {
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 5000);
  };

  const impactAreas = [
    {
      icon: BuildingLibraryIcon,
      title: 'Site Restoration',
      description: 'Fund restoration projects for endangered heritage sites',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Programs',
      description: 'Support local communities in preserving their cultural heritage',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: GlobeAltIcon,
      title: 'Digital Documentation',
      description: 'Help digitize and document heritage sites for future generations',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: SparklesIcon,
      title: 'Education & Awareness',
      description: 'Fund educational programs and awareness campaigns',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Heritage Enthusiast',
      content: 'I\'m proud to support the preservation of our cultural heritage. Every contribution helps protect these treasures for future generations.',
      amount: '₹5,000',
    },
    {
      name: 'Raj Kumar',
      role: 'Regular Donor',
      content: 'The transparency and impact of this platform convinced me to contribute regularly. Seeing the restoration progress is truly rewarding.',
      amount: '₹2,000/month',
    },
    {
      name: 'Maria Fernandez',
      role: 'International Supporter',
      content: 'As someone who loves Indian culture, I\'m happy to support the preservation of these magnificent heritage sites from abroad.',
      amount: '₹10,000',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 to-accent-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Support Heritage Preservation
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-100 mb-8">
              Your generous contribution helps protect and preserve our invaluable cultural heritage 
              for future generations to cherish and learn from.
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-6 h-6" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-6 h-6" />
                <span>Tax Deductible</span>
              </div>
              <div className="flex items-center space-x-2">
                <HeartIcon className="w-6 h-6" />
                <span>Transparent Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You Message */}
      {showThankYou && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white p-6 rounded-lg shadow-xl max-w-sm animate-slide-up">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-8 h-8" />
            <div>
              <h3 className="font-bold">Thank You!</h3>
              <p className="text-sm">Your donation has been processed successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Impact Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Where Your Donation Goes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every contribution makes a real difference in preserving our cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${area.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.title}</h3>
                  <p className="text-gray-600 text-sm">{area.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Make Your Donation</h2>
              <p className="text-gray-600">
                Choose your donation amount and help preserve our cultural heritage.
              </p>
            </div>

            {/* Site Selection (Optional) */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Support a Specific Heritage Site (Optional)
              </label>
              <select
                value={selectedSite?._id || ''}
                onChange={(e) => {
                  const site = sitesData?.data?.find(s => s._id === e.target.value);
                  setSelectedSite(site || null);
                }}
                className="input-field"
              >
                <option value="">Support general fund</option>
                {Array.isArray(sitesData?.data) ? sitesData.data.map((site) => (
                  <option key={site._id} value={site._id}>
                    {site.name} - {site.location.city}
                  </option>
                )) : null}
              </select>
            </div>

            <Elements stripe={stripePromise}>
              <DonationForm 
                selectedSite={selectedSite} 
                onDonationSuccess={handleDonationSuccess}
              />
            </Elements>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Donors Say</h2>
            <p className="text-xl text-gray-600">
              Join thousands of supporters who are making a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="text-sm font-medium text-primary-600">
                  Donated: {testimonial.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Every Contribution Counts
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Whether big or small, your donation helps protect our shared cultural heritage 
            and ensures it survives for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#donation-form" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Donate Now
            </a>
            <a href="/about" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 inline-flex items-center justify-center">
              Learn More
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
