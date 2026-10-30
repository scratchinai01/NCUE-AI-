import React from 'react';
import { Role } from '../types';
import { GraduationCap, ExternalLink, BookOpen, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenGuide,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white shadow-md z-20 relative border-b border-blue-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-blue-200 shadow-inner">
            <GraduationCap className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
                NCUE 未來教師 AI 力
              </span>
              <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30 font-medium hidden sm:inline-block">
                Skills 設計與教學創新
              </span>
            </div>
            <p className="text-xs text-blue-200/80 hidden md:block">
              彰化師範大學 師資培育研習專用 · 108課綱實戰教學技能
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Role Segmented Switcher */}
          <div className="flex bg-black/30 p-1 rounded-xl backdrop-blur-md border border-white/10">
            <button
              onClick={() => onRoleChange('student')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                currentRole === 'student'
                  ? 'bg-white text-blue-900 shadow-md font-semibold'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>👩‍🏫</span>
              <span>師培生</span>
            </button>
            <button
              onClick={() => onRoleChange('professor')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                currentRole === 'professor'
                  ? 'bg-amber-400 text-slate-900 shadow-md font-semibold'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>👨‍💼</span>
              <span>教授 / 輔導</span>
            </button>
          </div>

          {/* Quick Guide Trigger */}
          <button
            onClick={onOpenGuide}
            title="研習使用指引與提示"
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm transition-colors border border-white/10 flex items-center gap-1.5 whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">使用指引</span>
          </button>

          {/* 108 Curriculum Official Portal */}
          <a
            href="https://www.naer.edu.tw/PageSyllabus?fid=52"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 hover:text-blue-200 text-white text-xs sm:text-sm transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>國教院 108課綱</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
};
