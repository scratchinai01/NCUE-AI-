import React from 'react';
import { X, BookOpen, GraduationCap, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-blue-200" />
            <h3 className="text-base sm:text-lg font-bold">
              彰師大師培 AI 實戰工具箱 · 研習使用指引
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div>
            <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              為什麼設計這套工具箱？
            </h4>
            <p className="text-slate-600 leading-relaxed">
              因應 108 課綱核心素養導向與教育部中小學數位教學指引，師培生在準備集中實習、教檢與教師甄試時，常面臨「不知道如何精確向 AI 下提示詞」或「生成的教案脫離台灣課綱結構」等痛點。本工具箱由彰化師範大學師培研習社群提煉，將 30 個高頻教學實戰場景模組化，一鍵生成兼顧「學習表現」、「核心素養」與「具體評量」的專業 Prompt。
            </p>
          </div>

          {/* Section 2: Two Pathways */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
              <span className="font-bold text-blue-900 block mb-2 flex items-center gap-1.5">
                <span>👩‍🏫</span> 師培生推薦通關路徑
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 leading-relaxed">
                <li><strong>Skill 01 課綱解讀</strong>：將課綱條目轉化為 3-5 個具體可評量目標。</li>
                <li><strong>Skill 02 教案生成</strong>：融入特定教學法（如 PBL 或合作學習）。</li>
                <li><strong>Skill 12 差異化教學</strong>：為班級程度落差設計分層鷹架。</li>
                <li><strong>Skill 16 Rubric規準</strong>：制定客觀明確的表現評量向度。</li>
                <li><strong>Skill 19 試教演練</strong>：模擬 15 分鐘教甄板書與評審追問。</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <span className="font-bold text-amber-900 block mb-2 flex items-center gap-1.5">
                <span>👨‍💼</span> 教授與輔導教師路徑
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 leading-relaxed">
                <li><strong>Skill 03 TPACK 架構</strong>：審視師培生科技融入是否流於表面。</li>
                <li><strong>Skill 06 UbD 逆向設計</strong>：引導師培生以終為始檢視評量證據。</li>
                <li><strong>Skill 15 誘答選項</strong>：分析師培生命題之鑑別度與迷思概念。</li>
                <li><strong>Skill 22 教學觀課</strong>：設計入班觀課與議課的專業觀察焦點表。</li>
                <li><strong>Skill 25 行動研究</strong>：指導教學現場實務研究與發表。</li>
              </ol>
            </div>

          </div>

          {/* Section 3: AI Ethics */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <h5 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              教育部 AI 教學倫理三大實踐原則
            </h5>
            <ul className="space-y-1.5 text-xs text-emerald-950">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>保護學生隱私</strong>：切勿將學生的真實姓名、特殊身分或敏感健康資訊輸入提示詞中。</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>教師專業把關</strong>：AI 生成的試題或教案可能存在事實幻覺，教師務必以自身學科專業進行核實修訂。</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>透明揭露原則</strong>：在撰寫教案或教材時，標註使用 AI 輔助之工具與指令，落實負責任的數位素養。</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            我知道了，開始實戰
          </button>
        </div>

      </div>
    </div>
  );
};
