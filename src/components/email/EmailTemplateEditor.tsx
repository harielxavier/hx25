import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X, Code, Eye } from 'lucide-react';
import { EmailTemplate, createEmailTemplate, updateEmailTemplate, parseTemplate } from '../../lib/email';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  category: z.string().min(1, 'Category is required')
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface EmailTemplateEditorProps {
  template?: EmailTemplate;
  onSave: () => void;
  onClose: () => void;
}

export default function EmailTemplateEditor({ template, onSave, onClose }: EmailTemplateEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, string>>({
    first_name: 'John',
    last_name: 'Doe',
    business_name: 'Studio Name',
    sender_name: 'Your Name',
    session_type: 'Wedding',
    session_date: '2024-05-15',
    session_time: '2:00 PM',
    location: 'Central Park'
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: template || {
      category: 'general'
    }
  });

  const currentBody = watch('body');

  const onSubmit = async (data: TemplateFormData) => {
    try {
      if (template) {
        await updateEmailTemplate(template.id, data);
      } else {
        await createEmailTemplate(data);
      }
      onSave();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const previewContent = previewMode ? parseTemplate(currentBody, previewData) : currentBody;

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-medium">
          {template ? 'Edit Email Template' : 'New Email Template'}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            {previewMode ? (
              <>
                <Code className="w-4 h-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Template Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Welcome Email"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              {...register('category')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="general">General</option>
              <option value="welcome">Welcome</option>
              <option value="booking">Booking</option>
              <option value="follow-up">Follow-up</option>
              <option value="reminder">Reminder</option>
              <option value="thank-you">Thank You</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Subject Line</label>
          <input
            type="text"
            {...register('subject')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter email subject"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Email Body</label>
          <div className="relative">
            <textarea
              {...register('body')}
              rows={12}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
              placeholder="Enter email content..."
              style={{ display: previewMode ? 'none' : 'block' }}
            />
            {previewMode && (
              <div className="w-full px-4 py-2 border rounded-lg min-h-[20rem] prose max-w-none">
                {previewContent.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </div>
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
          )}
        </div>

        {previewMode && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Preview Data</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(previewData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setPreviewData(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    className="w-full px-3 py-1 text-sm border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
            {isSubmitting ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </form>
    </div>
  );
}