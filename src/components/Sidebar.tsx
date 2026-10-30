import React from 'react';
import { CategoryId } from '../types';
import { categories } from '../data/skills';
import { 
  Award, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles, 
  Star, 
  LayoutGrid, 
  ExternalLink,
  BookMarked,
  Laptop,
  Tv,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  currentCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  favoritesCount: number;
  totalSkillsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  onSelectCategory,
  favoritesCount,
  totalSkillsCount,
}) => {
  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'top5': return <Award className="w-4 h-4 text-amber-500" />;
      case 'cat1': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'cat2': return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'cat3': return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
      case 'cat4': return <GraduationCap className="w-4 h-4 text-orange-600" />;
      case 'cat5': return <Sparkles className="w-4 h-4 text-rose-600" />;
      case 'favorites': return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
      case 'all': return <LayoutGrid className="w-4 h-4 text-slate-600" />;
      default: return <BookMarked className="w-4 h-4" />;
    }
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200 md:shrink-0 flex flex-col z-10 md:h-full overflow-y-auto">
      
      {/* Category Navigation */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            研習技能分類
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {totalSkillsCount} 模組
          </span>
        </div>

        <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            const isFav = cat.id === 'favorites';
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 flex items-center justify-between gap-3 min-w-[160px] md:min-w-0 ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`shrink-0 ${isActive ? 'text-white' : ''}`}>
                    {getCategoryIcon(cat.id)}
                  </span>
                  <span className="truncate">{cat.name}</span>
                </div>

                {isFav && favoritesCount > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {favoritesCount}
                  </span>
                )}
                {cat.id === 'top5' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-amber-300 text-slate-900' : 'bg-amber-100 text-amber-700'
                  }`}>
                    必學
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Useful Taiwan Educational Portals */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 hidden md:block">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <BookMarked className="w-3.5 h-3.5 text-blue-600" />
            必備教學資料庫
          </span>
        </div>
        
        <ul className="space-y-1.5 text-xs text-slate-600">
          <li>
            <a
              href="https://www.naer.edu.tw/PageSyllabus?fid=52"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg hover:bg-white hover:text-blue-900 flex items-center justify-between group transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                108 課綱官方條目查詢
              </span>
              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-600" />
            </a>
          </li>
          <li>
            <a
              href="https://adl.edu.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg hover:bg-white hover:text-blue-900 flex items-center justify-between group transition-colors"
            >
              <span className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                教育部因材網 (適性教學)
              </span>
              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-600" />
            </a>
          </li>
          <li>
            <a
              href="https://coacts.tp.edu.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg hover:bg-white hover:text-blue-900 flex items-center justify-between group transition-colors"
            >
              <span className="flex items-center gap-2">
                <Tv className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                臺北酷課雲 (教學影音)
              </span>
              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-600" />
            </a>
          </li>
          <li>
            <a
              href="https://depart.moe.edu.tw/ED2700/News.aspx?n=8BCBC308AE7B28A2&sms=E430155A46CD9DC1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg hover:bg-white hover:text-blue-900 flex items-center justify-between group transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                中小學數位教學 AI 指引
              </span>
              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-600" />
            </a>
          </li>
        </ul>
      </div>

      {/* Workshop Tips */}
      <div className="p-4 hidden md:block text-xs text-slate-500 mt-auto bg-blue-50/50 border-t border-blue-100/50 m-3 rounded-xl">
        <p className="font-semibold text-blue-900 mb-1 flex items-center gap-1.5">
          <span>💡</span> 研習實戰小技巧
        </p>
        <p className="leading-relaxed text-blue-950/80">
          點開任一技能卡片後，可點選上方「快速帶入範例情境」或手動設定教學法與評量，系統會將 108 課綱與情境組裝為最佳 Prompt，可一鍵複製或直接線上 AI 試算！
        </p>
      </div>
    </aside>
  );
};
