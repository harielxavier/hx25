import React, { useState, useEffect } from 'react';
import { FileEdit, Save, Plus, Trash2, Upload, ArrowRight } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

// Define types for our content
interface StyleOption {
  id: string;
  value: number;
  label: string;
  description: string;
  examples: string[];
}

interface BespokeSliderContent {
  sectionTitle: string;
  sectionSubtitle: string;
  sliderTitle: string;
  sliderSubtitle: string;
  leftImage: string;
  rightImage: string;
  buttonText: string;
  buttonLink: string;
  styleOptions: StyleOption[];
}

// Mock initial data - in a real app, this would come from your backend
const initialContent: BespokeSliderContent = {
  sectionTitle: "No Two Weddings Are The Same",
  sectionSubtitle: "Your photography experience should be as unique as your love story. Our approach adapts seamlessly to your style, creating a bespoke service tailored exclusively to you.",
  sliderTitle: "Your Story, Your Style",
  sliderSubtitle: "Move the slider to discover your perfect photography approach",
  leftImage: "/images/placeholders/documentary.jpg",
  rightImage: "/images/placeholders/directed.jpg",
  buttonText: "Find Your Perfect Style",
  buttonLink: "/#contact-form",
  styleOptions: [
    {
      id: "style-1",
      value: 0,
      label: "Documentary Style",
      description: "For couples who prefer a completely unobtrusive approach with minimal interaction from the photographer.",
      examples: [
        "Fly-on-the-wall approach",
        "Candid moments",
        "Natural interactions",
        "Unobtrusive presence",
        "Capturing real emotions",
        "Storytelling through observation",
        "Life as it unfolds"
      ]
    },
    {
      id: "style-2",
      value: 25,
      label: "Light Guidance",
      description: "For couples who want mostly candid photos but appreciate occasional subtle guidance for better results.",
      examples: [
        "Gentle suggestions for better lighting",
        "Minimal posing with focus on natural moments",
        "Quiet direction only when beneficial",
        "Creating opportunities for authentic moments"
      ]
    },
    {
      id: "style-3",
      value: 50,
      label: "Balanced Approach",
      description: "The perfect middle ground combining documentary coverage with some directed portraits and group photos.",
      examples: [
        "Best of both worlds",
        "Guided when needed",
        "Natural with direction",
        "Balanced documentation",
        "Flexible approach",
        "Mixture of styles"
      ]
    },
    {
      id: "style-4",
      value: 75,
      label: "Creative Direction",
      description: "For couples who want artistic portraits and are comfortable with more photographer involvement.",
      examples: [
        "Artistic portrait sessions with clear guidance",
        "Creative compositions and setups",
        "Direction for more dramatic moments",
        "Still capturing candid moments throughout the day"
      ]
    },
    {
      id: "style-5",
      value: 100,
      label: "Directed Style",
      description: "For couples who want the complete photography experience with poses, prompts, and creative direction.",
      examples: [
        "Artistic direction",
        "Multiple angles",
        "Planned portraits",
        "Creative poses",
        "Detailed shot lists",
        "Magazine-worthy moments",
        "Every angle captured"
      ]
    }
  ]
};

export default function WebsiteContentView() {
  const [content, setContent] = useState<BespokeSliderContent>(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // In a real app, you would fetch this data from your backend
  useEffect(() => {
    // Simulating data fetch
    setIsLoading(true);
    setTimeout(() => {
      setContent(initialContent);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSave = () => {
    setIsLoading(true);
    // In a real app, you would save this to your backend
    setTimeout(() => {
      setIsLoading(false);
      showToast({
        type: 'success',
        message: 'Content saved successfully!'
      });
    }, 1000);
  };

  const handleImageUpload = (type: 'left' | 'right') => {
    // In a real app, this would open a file picker and upload the image
    const newImagePath = `/images/placeholders/${type === 'left' ? 'new-documentary.jpg' : 'new-directed.jpg'}`;
    setContent({
      ...content,
      [type === 'left' ? 'leftImage' : 'rightImage']: newImagePath
    });
    
    showToast({
      type: 'info',
      message: 'In a production app, this would open a file upload dialog'
    });
  };

  const addStyleOption = () => {
    const newOption: StyleOption = {
      id: `style-${content.styleOptions.length + 1}`,
      value: content.styleOptions.length * 25,
      label: "New Style Option",
      description: "Description for this style option",
      examples: ["Example 1", "Example 2"]
    };
    
    setContent({
      ...content,
      styleOptions: [...content.styleOptions, newOption]
    });
  };

  const removeStyleOption = (id: string) => {
    setContent({
      ...content,
      styleOptions: content.styleOptions.filter(option => option.id !== id)
    });
  };

  const updateStyleOption = (id: string, field: string, value: any) => {
    setContent({
      ...content,
      styleOptions: content.styleOptions.map(option => {
        if (option.id === id) {
          return { ...option, [field]: value };
        }
        return option;
      })
    });
  };

  const addExample = (styleId: string) => {
    setContent({
      ...content,
      styleOptions: content.styleOptions.map(option => {
        if (option.id === styleId) {
          return { 
            ...option, 
            examples: [...option.examples, "New example"]
          };
        }
        return option;
      })
    });
  };

  const updateExample = (styleId: string, index: number, value: string) => {
    setContent({
      ...content,
      styleOptions: content.styleOptions.map(option => {
        if (option.id === styleId) {
          const newExamples = [...option.examples];
          newExamples[index] = value;
          return { ...option, examples: newExamples };
        }
        return option;
      })
    });
  };

  const removeExample = (styleId: string, index: number) => {
    setContent({
      ...content,
      styleOptions: content.styleOptions.map(option => {
        if (option.id === styleId) {
          const newExamples = [...option.examples];
          newExamples.splice(index, 1);
          return { ...option, examples: newExamples };
        }
        return option;
      })
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileEdit className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-light tracking-wide text-white">Website Content Management</h1>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gold text-black px-4 py-2 rounded hover:bg-gold/80 transition-colors"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="bg-dark-100 border border-dark-200 rounded-lg p-6 space-y-8">
        <h2 className="text-xl font-light text-white border-b border-dark-200 pb-2">
          Bespoke Experience Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.sectionTitle}
              onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
              className="w-full bg-dark-200 border border-dark-300 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Section Subtitle
            </label>
            <textarea
              value={content.sectionSubtitle}
              onChange={(e) => setContent({ ...content, sectionSubtitle: e.target.value })}
              rows={3}
              className="w-full bg-dark-200 border border-dark-300 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slider Title
            </label>
            <input
              type="text"
              value={content.sliderTitle}
              onChange={(e) => setContent({ ...content, sliderTitle: e.target.value })}
              className="w-full bg-dark-200 border border-dark-300 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slider Subtitle
            </label>
            <input
              type="text"
              value={content.sliderSubtitle}
              onChange={(e) => setContent({ ...content, sliderSubtitle: e.target.value })}
              className="w-full bg-dark-200 border border-dark-300 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Left Image (Documentary Style)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={content.leftImage}
                onChange={(e) => setContent({ ...content, leftImage: e.target.value })}
                className="flex-1 bg-dark-200 border border-dark-300 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                onClick={() => handleImageUpload('left')}
                className="flex items-center gap-1 bg-dark-300 text-white px-3 py-2 rounded hover:bg-dark-400 transition-colors"
              >
                <Upload size={16} />
                Upload
              </button>
            </div>
            <div className="mt-2 h-32 bg-dark-200 rounded overflow-hidden">
              <img 
                src={content.leftImage} 
                alt="Documentary Style Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Right Image (Directed Style)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={content.rightImage}
                onChange={(e) => setContent({ ...content, rightImage: e.target.value })}
                className="flex-1 bg-dark-200 border border-dark-300 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                onClick={() => handleImageUpload('right')}
                className="flex items-center gap-1 bg-dark-300 text-white px-3 py-2 rounded hover:bg-dark-400 transition-colors"
              >
                <Upload size={16} />
                Upload
              </button>
            </div>
            <div className="mt-2 h-32 bg-dark-200 rounded overflow-hidden">
              <img 
                src={content.rightImage} 
                alt="Directed Style Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Button Text
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={content.buttonText}
                onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                className="flex-1 bg-dark-200 border border-dark-300 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <ArrowRight size={18} className="text-white" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Button Link
            </label>
            <input
              type="text"
              value={content.buttonLink}
              onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
              className="w-full bg-dark-200 border border-dark-300 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-white">
              Style Options
            </h3>
            <button
              onClick={addStyleOption}
              className="flex items-center gap-1 bg-dark-300 text-white px-3 py-1 rounded hover:bg-dark-400 transition-colors"
            >
              <Plus size={16} />
              Add Style Option
            </button>
          </div>

          {content.styleOptions.map((option, index) => (
            <div key={option.id} className="bg-dark-200 border border-dark-300 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Style {index + 1}</h4>
                <button
                  onClick={() => removeStyleOption(option.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => updateStyleOption(option.id, 'label', e.target.value)}
                    className="w-full bg-dark-300 border border-dark-400 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Value (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={option.value}
                    onChange={(e) => updateStyleOption(option.id, 'value', parseInt(e.target.value))}
                    className="w-full bg-dark-300 border border-dark-400 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={option.description}
                  onChange={(e) => updateStyleOption(option.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full bg-dark-300 border border-dark-400 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Examples
                  </label>
                  <button
                    onClick={() => addExample(option.id)}
                    className="flex items-center gap-1 text-sm text-gold hover:text-gold/80 transition-colors"
                  >
                    <Plus size={14} />
                    Add Example
                  </button>
                </div>
                
                <div className="space-y-2">
                  {option.examples.map((example, exIndex) => (
                    <div key={exIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={example}
                        onChange={(e) => updateExample(option.id, exIndex, e.target.value)}
                        className="flex-1 bg-dark-300 border border-dark-400 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                      <button
                        onClick={() => removeExample(option.id, exIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
