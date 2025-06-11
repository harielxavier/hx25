import { useState, useRef } from 'react';
import { ArrowRight, Clock, DollarSign, Users, Calendar, PlusCircle, Trash2, Download, FileText, Save, Printer, Image } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEO from '../components/SEO';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Types
interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
}

interface BudgetItem {
  id: string;
  category: string;
  item: string;
  estimated: number;
  actual: number;
  paid: number;
  dueDate: string;
}

interface GuestListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvp: 'pending' | 'confirmed' | 'declined';
  plusOnes: number;
  mealPreference: string;
  notes: string;
}

export function WeddingToolsPage() {
  // Refs for PDF export
  const timelineRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const guestlistRef = useRef<HTMLDivElement>(null);
  
  // State for active tab and PDF export settings
  const [activeTab, setActiveTab] = useState<'timeline' | 'budget' | 'guestlist'>('timeline');
  const [isExporting, setIsExporting] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('/logo.svg'); // Default logo path
  
  // Timeline Builder State
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    { id: '1', time: '3:00 PM', title: 'Ceremony', description: 'Wedding ceremony at the chapel' },
    { id: '2', time: '4:00 PM', title: 'Cocktail Hour', description: 'Drinks and appetizers' },
    { id: '3', time: '5:00 PM', title: 'Reception', description: 'Dinner and dancing' },
    { id: '4', time: '6:00 PM', title: 'First Dance', description: 'Couple\'s first dance' },
  ]);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({ time: '', title: '', description: '' });
  
  // Budget Calculator State
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', category: 'Photography', item: 'Wedding Photographer', estimated: 3000, actual: 3200, paid: 1600, dueDate: '2025-06-15' },
    { id: '2', category: 'Venue', item: 'Reception Hall', estimated: 5000, actual: 5000, paid: 2500, dueDate: '2025-05-30' },
    { id: '3', category: 'Catering', item: 'Dinner Service', estimated: 4000, actual: 4200, paid: 1000, dueDate: '2025-06-01' },
  ]);
  const [newBudgetItem, setNewBudgetItem] = useState<Partial<BudgetItem>>({ category: '', item: '', estimated: 0, actual: 0, paid: 0, dueDate: '' });
  
  // Guest List Manager State
  const [guestList, setGuestList] = useState<GuestListItem[]>([
    { id: '1', name: 'John & Jane Smith', email: 'john@example.com', phone: '555-123-4567', rsvp: 'confirmed', plusOnes: 0, mealPreference: 'Chicken', notes: 'Close friends' },
    { id: '2', name: 'Robert Johnson', email: 'robert@example.com', phone: '555-987-6543', rsvp: 'pending', plusOnes: 1, mealPreference: 'Vegetarian', notes: 'Cousin' },
  ]);
  const [newGuest, setNewGuest] = useState<Partial<GuestListItem>>({ name: '', email: '', phone: '', rsvp: 'pending', plusOnes: 0, mealPreference: '', notes: '' });

  // PDF Export function with branding
  const exportToPDF = async () => {
    setIsExporting(true);
    
    let contentRef;
    let title;
    let subtitle;
    let filename;
    
    switch(activeTab) {
      case 'timeline':
        contentRef = timelineRef.current;
        title = 'Wedding Day Timeline';
        subtitle = 'Your personalized wedding day schedule';
        filename = 'Wedding-Day-Timeline.pdf';
        break;
      case 'budget':
        contentRef = budgetRef.current;
        title = 'Wedding Budget Planner';
        subtitle = 'Financial planning for your special day';
        filename = 'Wedding-Budget-Planner.pdf';
        break;
      case 'guestlist':
        contentRef = guestlistRef.current;
        title = 'Wedding Guest List';
        subtitle = 'Managing your wedding invitations and RSVPs';
        filename = 'Wedding-Guest-List.pdf';
        break;
    }
    
    if (!contentRef) {
      setIsExporting(false);
      return;
    }
    
    try {
      // Create a temporary container for the branded content
      const brandedContainer = document.createElement('div');
      brandedContainer.style.width = '800px';
      brandedContainer.style.padding = '20px';
      brandedContainer.style.backgroundColor = '#ffffff';
      document.body.appendChild(brandedContainer);
      
      // Add header with branding
      const headerDiv = document.createElement('div');
      headerDiv.style.padding = '20px';
      headerDiv.style.borderBottom = '1px solid #e2e2e2';
      headerDiv.style.marginBottom = '20px';
      headerDiv.style.display = 'flex';
      headerDiv.style.alignItems = 'center';
      headerDiv.style.justifyContent = 'space-between';
      brandedContainer.appendChild(headerDiv);
      
      // Add logo
      const logoDiv = document.createElement('div');
      logoDiv.style.maxWidth = '150px';
      headerDiv.appendChild(logoDiv);
      
      if (logoUrl !== '/logo.svg') {
        const logoImg = document.createElement('img');
        logoImg.src = logoUrl;
        logoImg.alt = 'Hariel Xavier Photography';
        logoImg.style.maxWidth = '100%';
        logoImg.style.height = 'auto';
        logoDiv.appendChild(logoImg);
      } else {
        // If no logo uploaded, just show text
        const logoText = document.createElement('h2');
        logoText.textContent = 'Hariel Xavier';
        logoText.style.margin = '0';
        logoText.style.fontSize = '18px';
        logoText.style.fontWeight = 'normal';
        logoDiv.appendChild(logoText);
      }
      
      // Add header text
      const headerTextDiv = document.createElement('div');
      headerTextDiv.style.textAlign = 'right';
      headerDiv.appendChild(headerTextDiv);
      
      const headerTitle = document.createElement('h1');
      headerTitle.textContent = title;
      headerTitle.style.fontSize = '24px';
      headerTitle.style.fontWeight = 'normal';
      headerTitle.style.margin = '0 0 5px 0';
      headerTitle.style.color = '#000';
      headerTextDiv.appendChild(headerTitle);
      
      const headerSubtitle = document.createElement('p');
      headerSubtitle.textContent = subtitle || '';
      headerSubtitle.style.fontSize = '14px';
      headerSubtitle.style.margin = '0';
      headerSubtitle.style.color = '#666';
      headerTextDiv.appendChild(headerSubtitle);
      
      const headerContact = document.createElement('p');
      headerContact.textContent = 'Hariel Xavier Photography | Hi@HarielXavier.com | (862) 290-4349';
      headerContact.style.fontSize = '12px';
      headerContact.style.margin = '5px 0 0 0';
      headerContact.style.color = '#888';
      headerTextDiv.appendChild(headerContact);
      
      // Clone the content
      const contentClone = contentRef.cloneNode(true) as HTMLElement;
      contentClone.style.margin = '20px 0';
      brandedContainer.appendChild(contentClone);
      
      // Add footer
      const footerDiv = document.createElement('div');
      footerDiv.style.padding = '15px 20px';
      footerDiv.style.borderTop = '1px solid #e2e2e2';
      footerDiv.style.marginTop = '20px';
      footerDiv.style.display = 'flex';
      footerDiv.style.alignItems = 'center';
      footerDiv.style.justifyContent = 'space-between';
      footerDiv.style.fontSize = '11px';
      footerDiv.style.color = '#888';
      brandedContainer.appendChild(footerDiv);
      
      const footerDate = document.createElement('div');
      footerDate.textContent = `Generated on ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`;
      footerDiv.appendChild(footerDate);
      
      const footerWebsite = document.createElement('div');
      footerWebsite.textContent = 'harielxavierphotography.com';
      footerDiv.appendChild(footerWebsite);
      
      const footerCopyright = document.createElement('div');
      footerCopyright.textContent = `© ${new Date().getFullYear()} Hariel Xavier Photography`;
      footerDiv.appendChild(footerCopyright);
      
      // Generate PDF from the branded container
      const canvas = await html2canvas(brandedContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Clean up temporary elements
      document.body.removeChild(brandedContainer);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    
    setIsExporting(false);
  };
  
  // Helper functions
  const addTimelineEvent = () => {
    if (newEvent.time && newEvent.title) {
      const event: TimelineEvent = {
        id: Date.now().toString(),
        time: newEvent.time || '',
        title: newEvent.title || '',
        description: newEvent.description || '',
      };
      setTimelineEvents([...timelineEvents, event]);
      setNewEvent({ time: '', title: '', description: '' });
    }
  };

  const removeTimelineEvent = (id: string) => {
    setTimelineEvents(timelineEvents.filter(event => event.id !== id));
  };

  const addBudgetItem = () => {
    if (newBudgetItem.category && newBudgetItem.item) {
      const item: BudgetItem = {
        id: Date.now().toString(),
        category: newBudgetItem.category || '',
        item: newBudgetItem.item || '',
        estimated: newBudgetItem.estimated || 0,
        actual: newBudgetItem.actual || 0,
        paid: newBudgetItem.paid || 0,
        dueDate: newBudgetItem.dueDate || '',
      };
      setBudgetItems([...budgetItems, item]);
      setNewBudgetItem({ category: '', item: '', estimated: 0, actual: 0, paid: 0, dueDate: '' });
    }
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const addGuest = () => {
    if (newGuest.name) {
      const guest: GuestListItem = {
        id: Date.now().toString(),
        name: newGuest.name || '',
        email: newGuest.email || '',
        phone: newGuest.phone || '',
        rsvp: newGuest.rsvp as 'pending' | 'confirmed' | 'declined' || 'pending',
        plusOnes: newGuest.plusOnes || 0,
        mealPreference: newGuest.mealPreference || '',
        notes: newGuest.notes || '',
      };
      setGuestList([...guestList, guest]);
      setNewGuest({ name: '', email: '', phone: '', rsvp: 'pending', plusOnes: 0, mealPreference: '', notes: '' });
    }
  };

  const removeGuest = (id: string) => {
    setGuestList(guestList.filter(guest => guest.id !== id));
  };

  // Calculate budget totals
  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0);
  const totalPaid = budgetItems.reduce((sum, item) => sum + item.paid, 0);
  const totalRemaining = totalActual - totalPaid;

  // Calculate guest totals
  const totalGuests = guestList.reduce((sum, guest) => {
    return sum + 1 + (guest.plusOnes || 0);
  }, 0);
  const confirmedGuests = guestList.filter(guest => guest.rsvp === 'confirmed').reduce((sum, guest) => {
    return sum + 1 + (guest.plusOnes || 0);
  }, 0);

  return (
    <>
      <SEO 
        title="Wedding Planning Tools | Hariel Xavier Photography"
        description="Free interactive wedding planning tools to help you organize your special day. Timeline builder, budget calculator, and guest list manager."
        keywords="wedding planning tools, wedding timeline, wedding budget calculator, wedding guest list, wedding planning"
      />

      <Navigation />
      
      <section className="bg-gradient-to-b from-black to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-4">Wedding Planning Tools</h1>
            <p className="text-gray-300 mb-8 text-lg">
              Exclusive interactive tools to help you plan your perfect wedding day
            </p>
            <div className="flex justify-center space-x-4">
              <span className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <FileText className="w-4 h-4 mr-2" />
                PDF Export
              </span>
              <span className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <Save className="w-4 h-4 mr-2" />
                Auto-Save
              </span>
              <span className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <Printer className="w-4 h-4 mr-2" />
                Print Ready
              </span>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200 mb-8">
              <button 
                className={`py-3 px-6 font-medium flex items-center ${activeTab === 'timeline' ? 'text-white bg-black rounded-t-lg border-b-2 border-rose-400' : 'text-gray-600 hover:text-black hover:bg-gray-100 transition-colors'}`}
                onClick={() => setActiveTab('timeline')}
              >
                <Clock className="w-5 h-5 mr-2" />
                Timeline Builder
              </button>
              <button 
                className={`py-3 px-6 font-medium flex items-center ${activeTab === 'budget' ? 'text-white bg-black rounded-t-lg border-b-2 border-rose-400' : 'text-gray-600 hover:text-black hover:bg-gray-100 transition-colors'}`}
                onClick={() => setActiveTab('budget')}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Budget Calculator
              </button>
              <button 
                className={`py-3 px-6 font-medium flex items-center ${activeTab === 'guestlist' ? 'text-white bg-black rounded-t-lg border-b-2 border-rose-400' : 'text-gray-600 hover:text-black hover:bg-gray-100 transition-colors'}`}
                onClick={() => setActiveTab('guestlist')}
              >
                <Users className="w-5 h-5 mr-2" />
                Guest List Manager
              </button>
              <div className="ml-auto flex items-center">
                <div className="mr-4">
                  <label className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-black transition-colors">
                    <Image className="w-4 h-4 mr-1" />
                    <span className="mr-2">Logo:</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setLogoUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      {logoUrl === '/logo.svg' ? 'Upload' : 'Change'}
                    </span>
                  </label>
                </div>
                <button 
                  className="py-3 px-6 font-medium flex items-center text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={exportToPDF}
                  disabled={isExporting}
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export to PDF'}
                </button>
              </div>
            </div>
            
            {/* Timeline Builder */}
            {activeTab === 'timeline' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light">Wedding Day Timeline</h2>
                  <div className="flex items-center">
                    <button className="text-sm text-gray-600 hover:text-black mr-4">
                      <Calendar className="inline-block w-4 h-4 mr-1" />
                      Save Timeline
                    </button>
                    <button className="text-sm text-gray-600 hover:text-black">
                      <ArrowRight className="inline-block w-4 h-4 mr-1" />
                      Share
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <div className="space-y-6">
                    {timelineEvents.map((event) => (
                      <div key={event.id} className="flex items-start group">
                        <div className="flex-shrink-0 w-24 font-medium">{event.time}</div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-gray-600 text-sm">{event.description}</p>
                        </div>
                        <button 
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                          onClick={() => removeTimelineEvent(event.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Add New Event</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Time</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g. 3:00 PM"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Event Title</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g. First Look"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Description (Optional)</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Brief description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    onClick={addTimelineEvent}
                  >
                    <PlusCircle className="inline-block w-4 h-4 mr-2" />
                    Add Event
                  </button>
                </div>
              </div>
            )}
            
            {/* Budget Calculator */}
            {activeTab === 'budget' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light">Wedding Budget Calculator</h2>
                  <div className="flex items-center">
                    <button className="text-sm text-gray-600 hover:text-black">
                      <ArrowRight className="inline-block w-4 h-4 mr-1" />
                      Export
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Total Budget</p>
                    <p className="text-2xl font-medium">${totalEstimated.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Actual Cost</p>
                    <p className="text-2xl font-medium">${totalActual.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Paid</p>
                    <p className="text-2xl font-medium">${totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Remaining</p>
                    <p className="text-2xl font-medium">${totalRemaining.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Item</th>
                        <th className="text-right py-3 px-4">Estimated</th>
                        <th className="text-right py-3 px-4">Actual</th>
                        <th className="text-right py-3 px-4">Paid</th>
                        <th className="text-left py-3 px-4">Due Date</th>
                        <th className="text-right py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetItems.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50 group">
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4">{item.item}</td>
                          <td className="py-3 px-4 text-right">${item.estimated.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">${item.actual.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">${item.paid.toLocaleString()}</td>
                          <td className="py-3 px-4">{item.dueDate}</td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                              onClick={() => removeBudgetItem(item.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Add Budget Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Category</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g. Photography"
                        value={newBudgetItem.category}
                        onChange={(e) => setNewBudgetItem({...newBudgetItem, category: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Item</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g. Wedding Photographer"
                        value={newBudgetItem.item}
                        onChange={(e) => setNewBudgetItem({...newBudgetItem, item: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Estimated Cost</label>
                      <input 
                        type="number" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="0"
                        value={newBudgetItem.estimated || ''}
                        onChange={(e) => setNewBudgetItem({...newBudgetItem, estimated: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <button 
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    onClick={addBudgetItem}
                  >
                    <PlusCircle className="inline-block w-4 h-4 mr-2" />
                    Add Item
                  </button>
                </div>
              </div>
            )}
            
            {/* Guest List Manager */}
            {activeTab === 'guestlist' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light">Guest List Manager</h2>
                  <div className="flex items-center">
                    <div className="mr-6">
                      <span className="text-sm text-gray-600">Total Guests: </span>
                      <span className="font-medium">{totalGuests}</span>
                    </div>
                    <div className="mr-6">
                      <span className="text-sm text-gray-600">Confirmed: </span>
                      <span className="font-medium">{confirmedGuests}</span>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-black">
                      <ArrowRight className="inline-block w-4 h-4 mr-1" />
                      Export
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Phone</th>
                        <th className="text-left py-3 px-4">RSVP</th>
                        <th className="text-center py-3 px-4">Plus Ones</th>
                        <th className="text-left py-3 px-4">Meal</th>
                        <th className="text-right py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {guestList.map((guest) => (
                        <tr key={guest.id} className="border-b hover:bg-gray-50 group">
                          <td className="py-3 px-4">{guest.name}</td>
                          <td className="py-3 px-4">{guest.email}</td>
                          <td className="py-3 px-4">{guest.phone}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              guest.rsvp === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              guest.rsvp === 'declined' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {guest.rsvp.charAt(0).toUpperCase() + guest.rsvp.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">{guest.plusOnes}</td>
                          <td className="py-3 px-4">{guest.mealPreference}</td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                              onClick={() => removeGuest(guest.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Add Guest</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Name</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Guest name"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Email address"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Phone number"
                        value={newGuest.phone}
                        onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    onClick={addGuest}
                  >
                    <PlusCircle className="inline-block w-4 h-4 mr-2" />
                    Add Guest
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-12">
              <div className="bg-gradient-to-r from-rose-50 to-gray-50 rounded-xl p-8 shadow-sm border border-rose-100">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-3/4 mb-6 md:mb-0 md:pr-8">
                    <h3 className="text-2xl font-light mb-3">Ready to capture your special day?</h3>
                    <p className="text-gray-600 mb-4">
                      These tools are provided as a complimentary service for couples planning their wedding.
                      Your data is saved locally in your browser and is not shared with anyone.
                    </p>
                    <p className="text-gray-600 mb-4">
                      As your wedding photographer, I'll help you create a custom timeline that ensures we capture
                      all your special moments while keeping your day stress-free and enjoyable.
                    </p>
                    <h3 className="text-xl font-medium mb-4">Book Your Wedding Photography</h3>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <iframe 
                        height="450" 
                        style={{width: '100%', border: 0, margin: '0 auto'}} 
                        id="sn-form-tools"
                        src="https://app.studioninja.co/contactform/parser/0a800fc8-7fbb-1621-817f-cbe6e7e26016/0a800fc8-7fbb-1621-817f-d37610217750"
                        allowFullScreen
                      ></iframe>
                      <script 
                        type="text/javascript" 
                        data-iframe-id="sn-form-tools"
                        src="https://app.studioninja.co/client-assets/form-render/assets/scripts/iframeResizer.js"
                      ></script>
                    </div>
                  </div>
                  <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-lg font-medium mb-3 text-center">Why work with me?</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-2 mt-1">•</span>
                        <span>Personalized timeline planning assistance</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-2 mt-1">•</span>
                        <span>Expert advice on lighting and locations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-2 mt-1">•</span>
                        <span>Coordination with your other vendors</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-rose-500 mr-2 mt-1">•</span>
                        <span>Stress-free photography experience</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default WeddingToolsPage;
