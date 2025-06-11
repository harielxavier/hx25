import React from 'react';
import { Settings, Users, Building, Calendar, Mail, CreditCard, Globe, MessageSquare, BookOpen, Tags, Link, FileText, Package, Contact as FileContract, ClipboardList, Workflow, Layout, Image } from 'lucide-react';

interface SettingSection {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
}

const fundamentals: SettingSection[] = [
  {
    icon: Globe,
    title: 'Currency & Taxes',
    description: 'View currency, change tax name and tax rate.',
    path: '/settings/currency'
  },
  {
    icon: Calendar,
    title: 'Date, Time & Calendar',
    description: 'Google Calendar integration, date and time format.',
    path: '/settings/datetime'
  },
  {
    icon: Mail,
    title: 'Email Settings',
    description: 'Set up email, email signature and notifications.',
    path: '/settings/email'
  },
  {
    icon: CreditCard,
    title: 'Invoice & Payment Settings',
    description: 'Payment schedules, reminders, receipts and ID format.',
    path: '/settings/payments'
  }
];

const advanced: SettingSection[] = [
  {
    icon: MessageSquare,
    title: 'Client Portal',
    description: 'Set up the portal where clients view quotes, contracts and invoices.',
    path: '/settings/portal'
  },
  {
    icon: BookOpen,
    title: 'Contact Form',
    description: 'Create and embed contact forms.',
    path: '/settings/forms'
  },
  {
    icon: Calendar,
    title: 'Online Booking',
    description: 'Automatically book clients based on your availability.',
    path: '/settings/booking'
  },
  {
    icon: Tags,
    title: 'Lead Sources',
    description: 'Track where your leads come from.',
    path: '/settings/leads'
  },
  {
    icon: Link,
    title: 'Integrations',
    description: 'Connect with Xero, QuickBooks and more.',
    path: '/settings/integrations'
  }
];

const templates: SettingSection[] = [
  {
    icon: Mail,
    title: 'Email Templates',
    description: 'Customize your email templates.',
    path: '/settings/email-templates'
  },
  {
    icon: Package,
    title: 'Products & Packages',
    description: 'Create products and packages that you sell.',
    path: '/settings/products'
  },
  {
    icon: FileText,
    title: 'Quote & Invoice Templates',
    description: 'Customize your quote and invoice templates.',
    path: '/settings/invoice-templates'
  },
  {
    icon: FileContract,
    title: 'Contract Templates',
    description: 'Customize your contract templates.',
    path: '/settings/contract-templates'
  },
  {
    icon: ClipboardList,
    title: 'Questionnaire Templates',
    description: 'Customize your questionnaire templates.',
    path: '/settings/questionnaire-templates'
  },
  {
    icon: Workflow,
    title: 'Workflow Templates',
    description: 'Create workflows and automation.',
    path: '/settings/workflow-templates'
  }
];

const websiteContent: SettingSection[] = [
  {
    icon: Layout,
    title: 'Homepage Content',
    description: 'Edit homepage sections, sliders, and featured content.',
    path: '/admin/content/homepage'
  },
  {
    icon: Image,
    title: 'Bespoke Experience Slider',
    description: 'Customize the bespoke photography style slider and content.',
    path: '/admin/content/bespoke-slider'
  }
];

const SettingCard = ({ section }: { section: SettingSection }) => {
  const Icon = section.icon;
  return (
    <div className="group bg-dark-100 border border-dark-200 rounded-lg p-4 hover:border-white transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-dark-200 rounded-lg group-hover:bg-dark-300 transition-colors">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-light text-white mb-1">{section.title}</h3>
          <p className="text-sm text-gray-400">{section.description}</p>
        </div>
      </div>
    </div>
  );
};

const SettingSection = ({ title, sections }: { title: string; sections: SettingSection[] }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-light tracking-wide text-white border-b border-dark-200 pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <SettingCard key={section.path} section={section} />
        ))}
      </div>
    </div>
  );
};

export default function SettingsView() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-light tracking-wide text-white">Settings</h1>
        </div>
      </div>

      <div className="space-y-12">
        <SettingSection title="Fundamentals" sections={fundamentals} />
        <SettingSection title="Advanced" sections={advanced} />
        <SettingSection title="Templates" sections={templates} />
        <SettingSection title="Website Content" sections={websiteContent} />
      </div>
    </div>
  );
}