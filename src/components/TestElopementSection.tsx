
import React from 'react';
import { Check } from 'lucide-react';

const TestElopementSection = () => {
  return (
    <div style={{ padding: '20px', border: '2px solid red' }}>
      <h2>TEST: Elopement Section</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-4 border">
          <h3>The Intimate</h3>
          <div className="text-3xl">$1,595</div>
          <div className="space-y-2">
            {[
              "3 hours coverage",
              "200 professionally edited images"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestElopementSection;
