import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { GenerationMode, CarouselSlide } from '@/pages/Index';

interface ProjectData {
  id: string;
  prompt: string;
  mode: GenerationMode;
  slides?: CarouselSlide[];
  timestamp?: { seconds: number };
}

export const useCarouselProjects = (user: User | null) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    if (!user) return;

    try {
      const db = getFirestore();
      const q = query(
        collection(db, 'carousels', user.uid, 'projects')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as ProjectData[];
        
        data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setProjects(data);
      }, (error) => {
        console.error("Firestore Error:", error);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase not configured:", error);
    }
  }, [user]);

  const saveProject = async (
    prompt: string, 
    mode: GenerationMode, 
    slides: CarouselSlide[]
  ) => {
    if (!user) return;

    try {
      const db = getFirestore();
      await addDoc(collection(db, 'carousels', user.uid, 'projects'), {
        prompt,
        mode,
        timestamp: serverTimestamp(),
        slides: slides.map(s => ({ title: s.title, caption: s.caption }))
      });
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return { projects, saveProject };
};
