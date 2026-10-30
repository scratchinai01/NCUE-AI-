import React from 'react';
import { Skill } from '../types';
import { Star, ArrowUpRight, Award } from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (skill: Skill) => void;
  categoryName: string;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  isFavorite,
  onToggleFavorite,
  onOpen,
  categoryName,
}) => {
  return (
    <div
      onClick={() => onOpen(skill)}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer group flex flex-col justify-between h-full relative"
    >
      <div>
        {/* Top bar with clean unboxed metadata and actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
              Skill {skill.id}
            </span>
            <span aria-hidden="true">·</span>
            <span>{categoryName}</span>
            {skill.top && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 inline text-amber-500" />
                  研習核心
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(skill.id);
              }}
              title={isFavorite ? '取消收藏' : '加入收藏'}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                  : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-amber-400 text-amber-500' : ''
                }`}
              />
            </button>
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-900 group-hover:text-white transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors">
          {skill.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {skill.desc}
        </p>
      </div>

      {/* Footer tags / cues */}
      {skill.tags && skill.tags.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 overflow-hidden">
          {skill.tags.slice(0, 3).map((tag, i) => (
            <React.Fragment key={tag}>
              {i > 0 && <span aria-hidden="true">/</span>}
              <span className="whitespace-nowrap hover:text-slate-600 transition-colors">
                {tag}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
