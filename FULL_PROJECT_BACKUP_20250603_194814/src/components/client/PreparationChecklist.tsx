import React from 'react';
import { Check, Clock } from 'lucide-react';

interface ChecklistItem {
  title: string;
  description: string;
  timing: string;
  completed: boolean;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

export default function PreparationChecklist() {
  const [checklist, setChecklist] = React.useState<ChecklistSection[]>([
    {
      title: "12+ Months Before",
      items: [
        {
          title: "Book Your Photographer",
          description: "Research and secure your wedding photographer",
          timing: "12+ months before",
          completed: false
        },
        {
          title: "Choose Your Venue",
          description: "Select and book your ceremony and reception venues",
          timing: "12+ months before",
          completed: false
        }
      ]
    },
    {
      title: "6-12 Months Before",
      items: [
        {
          title: "Schedule Engagement Session",
          description: "Plan and book your engagement photo session",
          timing: "6-12 months before",
          completed: false
        },
        {
          title: "Create Shot List",
          description: "List must-have photos for your wedding day",
          timing: "6-12 months before",
          completed: false
        }
      ]
    },
    {
      title: "1-3 Months Before",
      items: [
        {
          title: "Timeline Planning",
          description: "Finalize your wedding day photography timeline",
          timing: "1-3 months before",
          completed: false
        },
        {
          title: "Family Photo List",
          description: "Create list of family groupings for formal photos",
          timing: "1-3 months before",
          completed: false
        }
      ]
    }
  ]);

  const toggleItem = (sectionIndex: number, itemIndex: number) => {
    const newChecklist = [...checklist];
    newChecklist[sectionIndex].items[itemIndex].completed = 
      !newChecklist[sectionIndex].items[itemIndex].completed;
    setChecklist(newChecklist);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {checklist.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              {section.title}
            </h3>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`p-4 border rounded-lg transition-colors
                    ${item.completed ? 'bg-gray-50 border-gray-200' : 'border-gray-200'}`}
                >
                  <label className="flex items-start gap-4 cursor-pointer">
                    <div className="flex-none pt-1">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center
                          ${item.completed 
                            ? 'bg-black border-black' 
                            : 'border-gray-300'}`}
                      >
                        {item.completed && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-none">
                      <span className="text-sm text-gray-500">{item.timing}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}