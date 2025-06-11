import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Camera, Heart, Users, Music, Cake } from 'lucide-react';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  icon: React.ElementType;
  duration: string;
}

export default function WeddingTimeline() {
  const timeline: TimelineEvent[] = [
    {
      time: "10:00 AM",
      title: "Getting Ready",
      description: "Bride and bridesmaids hair and makeup, candid moments",
      icon: Clock,
      duration: "3 hours"
    },
    {
      time: "1:00 PM",
      title: "First Look",
      description: "Private moment between bride and groom",
      icon: Heart,
      duration: "30 minutes"
    },
    {
      time: "1:30 PM",
      title: "Wedding Party Photos",
      description: "Group photos with bridesmaids and groomsmen",
      icon: Camera,
      duration: "1 hour"
    },
    {
      time: "3:00 PM",
      title: "Ceremony",
      description: "Wedding ceremony and vow exchange",
      icon: Heart,
      duration: "45 minutes"
    },
    {
      time: "4:00 PM",
      title: "Family Photos",
      description: "Formal family group portraits",
      icon: Users,
      duration: "45 minutes"
    },
    {
      time: "5:00 PM",
      title: "Reception",
      description: "Dinner, speeches, and celebrations",
      icon: Music,
      duration: "4 hours"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {timeline.map((event, index) => {
          const Icon = event.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex gap-6"
            >
              <div className="flex-none">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-medium">{event.title}</h3>
                    <span className="text-gray-500">{event.time}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{event.description}</p>
                  <p className="text-sm text-gray-500">Duration: {event.duration}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}