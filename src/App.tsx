import React, { useState, useEffect, useMemo } from 'react';
import { Role, CategoryId, Skill, TeachingContext } from './types';
import { skillsData, categories } from './data/skills';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SkillCard } from './components/SkillCard';
import { SkillModal } from './components/SkillModal';
import { QuickGuideModal } from './components/QuickGuideModal';
import { BANNER_IMAGE_BASE64 } from './components/HeroBanner';
import { Search, X, Award, Sparkles, BookOpen, Layers, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';

const initialContext: TeachingContext = {
  stage: '',
  subject: '',
  topic: '',
  pedagogies: [],
  pedagogyCustom: '',
  assessments: [],
  assessmentCustom: '',
  extra: '',
};

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('student');
  const [currentCategory, setCurrentCategory] = useState<CategoryId>('top5');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandAll, setExpandAll] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ncue_ai_favorites');
      return saved ? JSON.parse(saved) : ['02', '10', '12', '19', '23'];
    } catch {
      return ['02', '10', '12', '19', '23'];
    }
  });

  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [teachingContext, setTeachingContext] = useState<TeachingContext>(initialContext);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ncue_ai_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const updateTeachingContext = (updates: Partial<TeachingContext>) => {
    setTeachingContext((prev) => ({ ...prev, ...updates }));
  };

  const resetTeachingContext = () => {
    setTeachingContext(initialContext);
  };

  // Filter skills by category and search
  const filteredSkills = useMemo(() => {
    return skillsData.filter((skill) => {
      // 1. Category filter (if expandAll is true, ignore category filter and show all matching search)
      if (!expandAll) {
        if (currentCategory === 'top5' && !skill.top) return false;
        if (currentCategory === 'favorites' && !favorites.includes(skill.id)) return false;
        if (currentCategory !== 'top5' && currentCategory !== 'favorites' && currentCategory !== 'all') {
          if (skill.cat !== currentCategory) return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = skill.title.toLowerCase().includes(q);
        const matchesDesc = skill.desc.toLowerCase().includes(q);
        const matchesTags = skill.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesPrompt = skill.prompt.toLowerCase().includes(q);
        const matchesId = skill.id.includes(q);
        return matchesTitle || matchesDesc || matchesTags || matchesPrompt || matchesId;
      }

      return true;
    });
  }, [currentCategory, searchQuery, favorites, expandAll]);

  // Current category metadata
  const activeCategoryMeta = useMemo(() => {
    return categories.find((c) => c.id === currentCategory) || categories[0];
  }, [currentCategory]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Hero Banner Image Section */}
      <div className="w-full bg-slate-900 border-b border-slate-200 shadow-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full overflow-hidden rounded-2xl shadow-xl border border-blue-500/25 relative group">
            <img
              src={BANNER_IMAGE_BASE64}
              alt="NCUE 未來教師 AI 力 橫幅"
              className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-[1.01]"
            />
            {/* Overlay Action Button on Banner */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
              <button
                onClick={() => {
                  setExpandAll(!expandAll);
                  if (!expandAll) setCurrentCategory('all');
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center gap-2 border ${
                  expandAll
                    ? 'bg-amber-400 text-slate-900 border-amber-300'
                    : 'bg-blue-900 hover:bg-blue-800 text-white border-blue-400/40 backdrop-blur-md'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-300" />
                <span>{expandAll ? '已全部展開顯示' : '橫幅全部展開分類'}</span>
                {expandAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Sidebar */}
        <Sidebar
          currentCategory={currentCategory}
          onSelectCategory={(id) => {
            setExpandAll(false);
            setCurrentCategory(id);
          }}
          favoritesCount={favorites.length}
          totalSkillsCount={skillsData.length}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          
          {/* Header Bar with Search & Category Info */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {expandAll ? '全部技能總覽（已展開全部類別）' : activeCategoryMeta.name}
                </h2>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  {filteredSkills.length} 個技能
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {expandAll ? '展示所有分類底下的 30 個精選 AI 實戰教學技能' : activeCategoryMeta.description}
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋技能名稱、課綱、標籤..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Notice Banner for Top 5 */}
          {currentCategory === 'top5' && !expandAll && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    師資培育研習必修 Top 5 核心技能
                  </h4>
                  <p className="text-xs text-blue-200/90">
                    教案生成、數位互動、差異化分層、15分鐘試教演練與 ORID 反思日誌
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setExpandAll(true);
                  setCurrentCategory('all');
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors whitespace-nowrap text-white border border-white/20"
              >
                橫幅全部展開 →
              </button>
            </div>
          )}

          {/* Skills Grid (Grouped by Category if expandAll is true, else flat) */}
          {expandAll && !searchQuery ? (
            <div className="space-y-10">
              {categories.filter(c => c.id !== 'all' && c.id !== 'favorites' && c.id !== 'top5').map((cat) => {
                const catSkills = filteredSkills.filter(s => s.cat === cat.id);
                if (catSkills.length === 0) return null;
                return (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                      <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                        <span>📌</span> {cat.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        {catSkills.length} 個模組
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                      {catSkills.map((skill) => (
                        <SkillCard
                          key={skill.id}
                          skill={skill}
                          isFavorite={favorites.includes(skill.id)}
                          onToggleFavorite={toggleFavorite}
                          onOpen={setActiveSkill}
                          categoryName={cat.name}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : filteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 flex-1">
              {filteredSkills.map((skill) => {
                const catMeta = categories.find((c) => c.id === skill.cat);
                return (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    isFavorite={favorites.includes(skill.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpen={setActiveSkill}
                    categoryName={catMeta?.name || '教學模組'}
                  />
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                找不到相符的技能模組
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4">
                試試清除搜尋關鍵字「{searchQuery}」，或切換至其他研習分類。
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setExpandAll(false);
                  setCurrentCategory('top5');
                }}
                className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors"
              >
                重置分類與搜尋
              </button>
            </div>
          )}

          {/* Footer note */}
          <footer className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>
              國立彰化師範大學 師資培育與教學中心 · NCUE Future Teacher AI Skills
            </span>
            <span>
              108 課綱素養導向 · 生成式 AI 教學輔助應用
            </span>
          </footer>

        </main>
      </div>

      {/* Interactive Modal */}
      <SkillModal
        skill={activeSkill}
        currentRole={currentRole}
        onClose={() => setActiveSkill(null)}
        context={teachingContext}
        onUpdateContext={updateTeachingContext}
        onResetContext={resetTeachingContext}
      />

      {/* Guide Modal */}
      <QuickGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
