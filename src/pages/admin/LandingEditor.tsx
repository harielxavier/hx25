import { useEffect, useState } from 'react';
// REMOVED FIREBASE: import { doc, getDoc, updateDoc // REMOVED FIREBASE
// REMOVED FIREBASE: import { db, storage } from '../../firebase/config';
// REMOVED FIREBASE: import { ref, uploadBytes, getDownloadURL // REMOVED FIREBASE
import { useToast } from '../../hooks/useToast';

export default function LandingEditor() {
  const { toast } = useToast();
  const [content, setContent] = useState<{
    heroImage: string;
    portraitImage: string;
    weddingGuideImage: string;
    testimonialImages: string[];
  }>({
    heroImage: '',
    portraitImage: '',
    weddingGuideImage: '',
    testimonialImages: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const docRef = doc(db, 'landing', 'content');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data() as {
        heroImage: string;
        portraitImage: string; 
        weddingGuideImage: string;
        testimonialImages: string[];
      });
      }
    };
    fetchContent();
  }, []);

  const handleImageUpload = async (file: File, field: string) => {
    if (!file) return;
    setLoading(true);
    try {
      const storageRef = ref(storage, `landing/${field}/${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await updateDoc(doc(db, 'landing', 'content'), {
        [field]: url
      });
      
      setContent(prev => ({...prev, [field]: url}));
      toast({ message: 'Image updated successfully', type: 'success' });
    } catch (error) {
      toast({ message: 'Error updating image', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Landing Page Editor</h1>
      
      <div className="space-y-8">
        {/* Hero Image Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hero Section Image</h2>
          <img src={content.heroImage} className="mb-4 max-h-64 object-cover rounded" />
          <input
            type="file"
            onChange={(e) => handleImageUpload(e.target.files?.[0]!, 'heroImage')}
            disabled={loading}
          />
        </div>

        {/* Portrait Image Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Portrait Image</h2>
          <img src={content.portraitImage} className="mb-4 max-h-64 object-cover rounded" />
          <input
            type="file"
            onChange={(e) => handleImageUpload(e.target.files?.[0]!, 'portraitImage')}
            disabled={loading}
          />
        </div>

        {/* Wedding Guide Image Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Wedding Guide Image</h2>
          <img src={content.weddingGuideImage} className="mb-4 max-h-64 object-cover rounded" />
          <input
            type="file"
            onChange={(e) => handleImageUpload(e.target.files?.[0]!, 'weddingGuideImage')}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
