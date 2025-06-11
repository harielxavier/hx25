import React, { useState } from 'react';
import './WeddingBookingSystem.css';

interface Package {
  id: string;
  name: string;
  price: number;
  hours: number;
  description: string;
  features: string[];
  popular?: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  weddingDate: string;
  venue: string;
  packageId: string;
  message: string;
}

const WeddingBookingSystem: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    weddingDate: '',
    venue: '',
    packageId: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const packages: Package[] = [
    {
      id: 'essential',
      name: 'Essential Collection',
      price: 2800,
      hours: 6,
      description: 'Perfect for intimate weddings with coverage of key moments.',
      features: [
        '6 hours of wedding day coverage',
        'One photographer',
        'Online gallery with digital downloads',
        'Engagement session',
        'Wedding day timeline consultation'
      ]
    },
    {
      id: 'signature',
      name: 'Signature Collection',
      price: 3800,
      hours: 8,
      description: 'Our most popular package with comprehensive coverage.',
      features: [
        '8 hours of wedding day coverage',
        'Two photographers',
        'Online gallery with digital downloads',
        'Engagement session',
        'Wedding day timeline consultation',
        'Custom USB with high-resolution images',
        '10x10 wedding album (20 pages)'
      ],
      popular: true
    },
    {
      id: 'luxury',
      name: 'Luxury Collection',
      price: 5200,
      hours: 10,
      description: 'The ultimate wedding experience with premium coverage and products.',
      features: [
        '10 hours of wedding day coverage',
        'Two photographers',
        'Second day coverage (2 hours)',
        'Online gallery with digital downloads',
        'Engagement session',
        'Bridal boudoir session',
        'Wedding day timeline consultation',
        'Custom USB with high-resolution images',
        '12x12 premium wedding album (30 pages)',
        'Two 8x8 parent albums'
      ]
    }
  ];

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setFormData({
      ...formData,
      packageId
    });
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.weddingDate.trim()) newErrors.weddingDate = 'Wedding date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the data to your backend
      // await createBooking(formData);
      
      setStep(3);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedPackage('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      weddingDate: '',
      venue: '',
      packageId: '',
      message: ''
    });
  };

  return (
    <div className="wedding-booking-container">
      <h2>Book Your Wedding Photography</h2>
      <p className="booking-intro">Reserve your booking and start the journey to beautiful wedding memories</p>
      
      <div className="booking-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>Choose Package</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>Your Details</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Confirmation</span>
        </div>
      </div>
      
      {step === 1 && (
        <div className="booking-step package-selection">
          <h3>Select Your Wedding Package</h3>
          
          <div className="packages-container">
            {packages.map(pkg => (
              <div 
                key={pkg.id} 
                className={`package-card ${pkg.popular ? 'popular' : ''}`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                {pkg.popular && <div className="popular-tag">Most Popular</div>}
                <h4>{pkg.name}</h4>
                <div className="package-price">${pkg.price}</div>
                <div className="package-hours">{pkg.hours} hours coverage</div>
                <p className="package-description">{pkg.description}</p>
                <ul className="package-features">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="select-package-button">Select Package</button>
              </div>
            ))}
          </div>
          
          <div className="custom-package-note">
            <p>Need a custom package? <button className="text-button">Contact me</button> to create something tailored to your needs.</p>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="booking-step details-form">
          <h3>Your Wedding Details</h3>
          <p className="selected-package-info">
            Selected: <strong>{packages.find(pkg => pkg.id === selectedPackage)?.name}</strong> - 
            ${packages.find(pkg => pkg.id === selectedPackage)?.price}
            <button 
              className="change-package-button"
              onClick={() => setStep(1)}
            >
              Change
            </button>
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weddingDate">Wedding Date *</label>
                <input
                  type="date"
                  id="weddingDate"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleInputChange}
                  className={errors.weddingDate ? 'error' : ''}
                />
                {errors.weddingDate && <div className="error-message">{errors.weddingDate}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="venue">Venue *</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className={errors.venue ? 'error' : ''}
                />
                {errors.venue && <div className="error-message">{errors.venue}</div>}
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="message">Additional Information</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell me more about your wedding plans, questions, or special requests..."
              ></textarea>
            </div>
            
            <div className="booking-actions">
              <button 
                type="button" 
                className="back-button"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Reserve My Date'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {step === 3 && (
        <div className="booking-step confirmation">
          <div className="confirmation-icon">✓</div>
          <h3>Booking Request Received!</h3>
          <p>Thank you, {formData.firstName}! I've received your wedding photography booking request for {formData.weddingDate}.</p>
          <p>I'll review your details and get back to you within 24 hours to confirm availability and next steps.</p>
          
          <div className="confirmation-details">
            <h4>Booking Summary</h4>
            <ul>
              <li><strong>Package:</strong> {packages.find(pkg => pkg.id === selectedPackage)?.name}</li>
              <li><strong>Wedding Date:</strong> {new Date(formData.weddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
              <li><strong>Venue:</strong> {formData.venue}</li>
              <li><strong>Total:</strong> ${packages.find(pkg => pkg.id === selectedPackage)?.price}</li>
            </ul>
          </div>
          
          <p className="next-steps">
            <strong>What happens next?</strong><br />
            1. You'll receive a confirmation email shortly<br />
            2. We'll schedule a consultation call to discuss your wedding details<br />
            3. I'll send a contract and invoice for the deposit (25% to reserve your booking)
          </p>
          
          <button 
            className="new-booking-button"
            onClick={resetForm}
          >
            Make Another Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default WeddingBookingSystem;
