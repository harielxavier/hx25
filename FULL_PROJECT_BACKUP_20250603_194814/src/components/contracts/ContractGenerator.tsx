import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContractManager } from '../../lib/integrations/docusign';

const contractSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Valid email is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  price: z.number().min(1, 'Price is required'),
  terms: z.string().min(1, 'Terms are required')
});

type ContractForm = z.infer<typeof contractSchema>;

export default function ContractGenerator() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ContractForm>({
    resolver: zodResolver(contractSchema)
  });

  const onSubmit = async (data: ContractForm) => {
    setLoading(true);
    try {
      const contractManager = new ContractManager({
        accessToken: process.env.DOCUSIGN_ACCESS_TOKEN!,
        accountId: process.env.DOCUSIGN_ACCOUNT_ID!,
        basePath: process.env.DOCUSIGN_BASE_PATH!
      });

      // Generate PDF from contract data
      const contractPdf = await generateContractPdf(data);

      // Send for signature
      await contractManager.createEnvelope({
        documentBase64: contractPdf,
        signerEmail: data.clientEmail,
        signerName: data.clientName,
        contractName: `Photography Contract - ${data.serviceType}`
      });

      setSuccess(true);
    } catch (error) {
      console.error('Contract generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Generate Contract</h2>
      
      {success ? (
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-800">Contract has been sent for signature!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Name</label>
              <input
                type="text"
                {...register('clientName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Client Email</label>
              <input
                type="email"
                {...register('clientEmail')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.clientEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.clientEmail.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Service Type</label>
            <select
              {...register('serviceType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a service</option>
              <option value="wedding">Wedding Photography</option>
              <option value="engagement">Engagement Session</option>
              <option value="portrait">Portrait Session</option>
            </select>
            {errors.serviceType && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Event Date</label>
            <input
              type="date"
              {...register('eventDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.eventDate && (
              <p className="mt-1 text-sm text-red-600">{errors.eventDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Terms & Conditions</label>
            <textarea
              {...register('terms')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate & Send Contract'}
          </button>
        </form>
      )}
    </div>
  );
}