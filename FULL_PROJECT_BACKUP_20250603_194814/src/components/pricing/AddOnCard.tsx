import React from 'react';

interface AddOn {
  name: string;
  items: {
    title: string;
    price: string;
    note?: string;
  }[];
}

interface AddOnCardProps {
  section: AddOn;
}

const AddOnCard: React.FC<AddOnCardProps> = ({ section }) => {
  return (
    <div className="bg-white p-8 border border-gray-200">
      <h3 className="font-serif text-2xl mb-6">{section.name}</h3>
      <div className="space-y-6">
        {section.items.map((item, index) => (
          <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-100">
            <div>
              <h4 className="font-medium mb-1">{item.title}</h4>
              {item.note && <p className="text-sm text-gray-500">{item.note}</p>}
            </div>
            <div className="text-xl font-light">${item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOnCard;
