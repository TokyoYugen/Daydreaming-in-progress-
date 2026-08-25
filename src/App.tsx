import React, { useState, useEffect } from 'react';
import { DreamEntry } from './types';
import { loadSavedDreams, syncDreamsWithServer, saveDreams, saveSingleDream, deleteDream } from './utils/storage';
import { getLocalizedDream, getLocalizedDreams } from './data/sampleDreams';
import { Navbar } from './components/Navbar';
import { DreamGallery } from './components/DreamGallery';
import { DreamViewer } from './components/DreamViewer';
import { DreamStats } from './components/DreamStats';
import { VoiceRecorderModal } from './components/VoiceRecorderModal';
import { ManualDreamModal } from './components/ManualDreamModal';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t, language } = useLanguage();
  const [dreams, setDreams] = useState<DreamEntry[]>(() => loadSavedDreams());
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'journal' | 'insights'>('journal');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Sync with persistent server storage on mount
  useEffect(() => {
    syncDreamsWithServer().then((synced) => {
      setDreams(synced);
    });
  }, []);

  const localizedDreams = getLocalizedDreams(dreams, language);

  const rawSelectedDream = selectedDreamId
    ? dreams.find((d) => d.id === selectedDreamId) || null
    : null;

  const currentSelectedDream = rawSelectedDream
    ? getLocalizedDream(rawSelectedDream, language)
    : null;

  const handleDreamCreated = (newDream: DreamEntry) => {
    const updated = saveSingleDream(newDream);
    setDreams(updated);
    setSelectedDreamId(newDream.id);
    setActiveTab('journal');
  };

  const handleUpdateDream = (updatedDream: DreamEntry) => {
    const updatedList = saveSingleDream(updatedDream);
    setDreams(updatedList);
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = dreams.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
    setDreams(updated);
    saveDreams(updated);
  };

  const handleDeleteDream = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.confirmDelete)) {
      const remaining = deleteDream(id);
      setDreams(remaining);
      if (selectedDreamId === id) {
        setSelectedDreamId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      {/* Navigation */}
      <Navbar
        dreams={localizedDreams}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVoiceRecorder={() => setIsVoiceModalOpen(true)}
        onOpenManualEntry={() => setIsManualModalOpen(true)}
        selectedDream={currentSelectedDream}
        onBackToGallery={() => setSelectedDreamId(null)}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {currentSelectedDream ? (
          <DreamViewer
            dream={currentSelectedDream}
            onBack={() => setSelectedDreamId(null)}
            onUpdateDream={handleUpdateDream}
          />
        ) : activeTab === 'insights' ? (
          <DreamStats
            dreams={localizedDreams}
            onSelectDream={(d) => setSelectedDreamId(d.id)}
          />
        ) : (
          <DreamGallery
            dreams={localizedDreams}
            onSelectDream={(d) => setSelectedDreamId(d.id)}
            onToggleFavorite={handleToggleFavorite}
            onDeleteDream={handleDeleteDream}
            onOpenVoiceRecorder={() => setIsVoiceModalOpen(true)}
            onOpenManualEntry={() => setIsManualModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#060911] py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <p>
          <strong className="text-slate-400 font-serif">NOCTURNE</strong> — {t.footerTitle.replace('NOCTURNE — ', '')}
        </p>
        <p className="text-[11px] text-slate-600">
          {t.footerSub}
        </p>
      </footer>

      {/* Modals */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onDreamCreated={handleDreamCreated}
      />

      <ManualDreamModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onDreamCreated={handleDreamCreated}
      />
    </div>
  );
}
