import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Phone, Mail, Calendar, DollarSign } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  budget: string;
  stage: 'inquiry' | 'consultation' | 'proposal' | 'booked';
}

export default function LeadPipeline() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Sarah & John',
      email: 'sarah@example.com',
      phone: '(123) 456-7890',
      date: '2024-08-15',
      budget: '$3,500',
      stage: 'inquiry'
    },
    {
      id: '2',
      name: 'Emma & James',
      email: 'emma@example.com',
      phone: '(123) 456-7890',
      date: '2024-09-20',
      budget: '$4,500',
      stage: 'consultation'
    }
  ]);

  const stages = [
    { id: 'inquiry', name: 'New Inquiries' },
    { id: 'consultation', name: 'Consultation' },
    { id: 'proposal', name: 'Proposal Sent' },
    { id: 'booked', name: 'Booked' }
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newLeads = Array.from(leads);
    const [movedLead] = newLeads.splice(result.source.index, 1);
    movedLead.stage = result.destination.droppableId;
    newLeads.splice(result.destination.index, 0, movedLead);

    setLeads(newLeads);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-6">Lead Pipeline</h3>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-4">{stage.name}</h4>
              
              <Droppable droppableId={stage.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3"
                  >
                    {leads
                      .filter((lead) => lead.stage === stage.id)
                      .map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 rounded-lg shadow-sm"
                            >
                              <h5 className="font-medium mb-2">{lead.name}</h5>
                              <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  <span>{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  <span>{lead.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{lead.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{lead.budget}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}