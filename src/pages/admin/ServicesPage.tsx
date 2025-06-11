import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Search, Filter, Edit2, Trash2, Clock, DollarSign, Camera, Check } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  deposit_amount: number;
  duration: number;
  photographer_count: number;
  max_image_count: number;
  gallery_hosting_duration: string;
  delivery_time: string;
  is_popular: boolean;
  is_active: boolean;
  features: string[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 'essential',
      name: 'The Essential',
      description: 'Single photographer, 6 hours coverage',
      price: 1995,
      deposit_amount: 500,
      duration: 360, // 6 hours
      photographer_count: 1,
      max_image_count: 400,
      gallery_hosting_duration: '3 months',
      delivery_time: '6 weeks',
      is_popular: false,
      is_active: true,
      features: [
        '400 edited images',
        'Online gallery with digital download',
        '3-month gallery hosting',
        '5 sneak peeks within 48 hours',
        'Delivery in 6 weeks'
      ]
    },
    {
      id: 'timeless',
      name: 'The Timeless',
      description: 'Single photographer, 8 hours coverage',
      price: 2595,
      deposit_amount: 750,
      duration: 480, // 8 hours
      photographer_count: 1,
      max_image_count: 600,
      gallery_hosting_duration: '1 year',
      delivery_time: '4 weeks',
      is_popular: true,
      is_active: true,
      features: [
        '600 edited images',
        'Online gallery with digital download',
        '1-year gallery hosting',
        '10 sneak peeks within 24 hours',
        'Engagement session',
        'Delivery in 4 weeks'
      ]
    },
    {
      id: 'heritage',
      name: 'The Heritage',
      description: '9 hours with 2 photographers',
      price: 3495,
      deposit_amount: 1000,
      duration: 540, // 9 hours
      photographer_count: 2,
      max_image_count: 800,
      gallery_hosting_duration: 'lifetime',
      delivery_time: '3 weeks',
      is_popular: false,
      is_active: true,
      features: [
        '800 edited images',
        'Online gallery with digital download',
        'Lifetime gallery hosting',
        '15 sneak peeks within 24 hours',
        'Engagement session',
        'Luxury print box with 30 prints + USB',
        'Delivery in 3 weeks'
      ]
    },
    {
      id: 'masterpiece',
      name: 'The Masterpiece',
      description: '10 hours with 2 photographers',
      price: 4995,
      deposit_amount: 1500,
      duration: 600, // 10 hours
      photographer_count: 2,
      max_image_count: 1000,
      gallery_hosting_duration: 'lifetime',
      delivery_time: '2 weeks',
      is_popular: false,
      is_active: true,
      features: [
        '1000 edited images',
        'Engagement session',
        'Luxury album',
        'Parent albums',
        'Large print box with 50 prints',
        'Premium USB box',
        'Rehearsal dinner coverage (2 hours)',
        'Next day preview blog post',
        'Lifetime gallery hosting',
        'Priority editing'
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const q = query(collection(db, 'services'), orderBy('price'));
      const querySnapshot = await getDocs(q);
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      if (servicesData.length > 0) {
        setServices(servicesData);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  }

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light mb-1">Services & Packages</h1>
            <p className="text-gray-500">Manage your photography packages and pricing</p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Package
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white p-6 rounded-lg shadow-sm border-2 ${
                service.is_popular ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium">{service.name}</h3>
                  <p className="text-2xl text-primary mb-2">${service.price}</p>
                  <p className="text-gray-600">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setShowEditModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration / 60} hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Camera className="w-4 h-4" />
                  <span>{service.photographer_count} photographer{service.photographer_count > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Deposit: ${service.deposit_amount}</span>
                </div>
              </div>

              <div className="space-y-2">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={service.is_active}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
