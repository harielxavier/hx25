import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Save, X, Clock, ArrowDown } from 'lucide-react';
import { EmailSequence, EmailTemplate, getEmailTemplates, createEmailSequence } from '../../lib/email';

const sequenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  trigger_event: z.string().min(1, 'Trigger event is required'),
  is_active: z.boolean().optional()
});

type SequenceFormData = z.infer<typeof sequenceSchema>;

interface EmailSequenceBuilderProps {
  sequence?: EmailSequence;
  onSave: () => void;
  onClose: () => void;
}

export default function EmailSequenceBuilder({ sequence, onSave, onClose }: EmailSequenceBuilderProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [steps, setSteps] = useState<Array<{
    template_id: string;
    delay_hours: number;
    order_index: number;
  }>>(sequence?.steps || []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SequenceFormData>({
    resolver: zodResolver(sequenceSchema),
    defaultValues: sequence || {
      is_active: true
    }
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const templates = await getEmailTemplates();
      setTemplates(templates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  }

  const addStep = () => {
    setSteps([
      ...steps,
      {
        template_id: '',
        delay_hours: 24,
        order_index: steps.length
      }
    ]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, updates: Partial<typeof steps[0]>) => {
    setSteps(steps.map((step, i) => 
      i === index ? { ...step, ...updates } : step
    ));
  };

  const onSubmit = async (data: SequenceFormData) => {
    try {
      await createEmailSequence({
        ...data,
        steps
      });
      onSave();
    } catch (error) {
      console.error('Error saving sequence:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-medium">
          {sequence ? 'Edit Email Sequence' : 'New Email Sequence'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Sequence Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Welcome Sequence"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trigger Event</label>
            <select
              {...register('trigger_event')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select trigger event...</option>
              <option value="new_inquiry">New Inquiry</option>
              <option value="booking_confirmed">Booking Confirmed</option>
              <option value="session_completed">Session Completed</option>
              <option value="gallery_delivered">Gallery Delivered</option>
            </select>
            {errors.trigger_event && (
              <p className="mt-1 text-sm text-red-600">{errors.trigger_event.message}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Describe the purpose of this sequence..."
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Sequence Steps</h3>
            <button
              type="button"
              onClick={addStep}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Template</label>
                      <select
                        value={step.template_id}
                        onChange={(e) => updateStep(index, { template_id: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select template...</option>
                        {templates.map(template => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Delay</label>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={step.delay_hours}
                          onChange={(e) => updateStep(index, { delay_hours: parseInt(e.target.value) })}
                          className="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          min="0"
                        />
                        <span className="text-sm text-gray-500">hours</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}

            {steps.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <ArrowDown className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Add steps to your sequence</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('is_active')}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">Activate sequence</span>
          </label>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Sequence'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}