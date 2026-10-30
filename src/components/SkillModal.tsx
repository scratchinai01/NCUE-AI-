import React, { useState, useEffect } from 'react';
import { Skill, Role, TeachingContext } from '../types';
import { promptHeaders } from '../data/skills';
import { 
  scenarioPresets, 
  pedagogyOptions, 
  assessmentOptions, 
  stageOptions, 
  commonSubjects 
} from '../data/presets';
import { 
  X, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  ExternalLink, 
  Sliders, 
  Play, 
  Terminal, 
  BookmarkCheck, 
  Loader2, 
  FileDown,
  Info,
  ChevronRight
} from 'lucide-react';

interface SkillModalProps {
  skill: Skill | null;
  currentRole: Role;
  onClose: () => void;
  context: TeachingContext;
  onUpdateContext: (context: Partial<TeachingContext>) => void;
  onResetContext: () => void;
}

export const SkillModal: React.FC<SkillModalProps> = ({
  skill,
  currentRole,
  onClose,
  context,
  onUpdateContext,
  onResetContext,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'output'>('prompt');
  
  // AI generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!skill) return null;

  // Toggle pedagogy
  const handleTogglePedagogy = (p: string) => {
    const current = [...context.pedagogies];
    const exists = current.includes(p);
    const updated = exists ? current.filter((item) => item !== p) : [...current, p];
    onUpdateContext({ pedagogies: updated });
  };

  // Toggle assessment
  const handleToggleAssessment = (a: string) => {
    const current = [...context.assessments];
    const exists = current.includes(a);
    const updated = exists ? current.filter((item) => item !== a) : [...current, a];
    onUpdateContext({ assessments: updated });
  };

  // Apply a preset
  const handleApplyPreset = (presetId: string) => {
    const preset = scenarioPresets.find((p) => p.id === presetId);
    if (!preset) return;
    onUpdateContext({
      stage: preset.stage,
      subject: preset.subject,
      topic: preset.topic,
      pedagogies: preset.pedagogies,
      assessments: preset.assessments,
      extra: preset.extra,
      pedagogyCustom: '',
      assessmentCustom: '',
    });
  };

  // Build the complete prompt
  const stage = context.stage.trim() || '[未指定階段]';
  const subject = context.subject.trim() || '[未指定科目]';
  const topic = context.topic.trim() || '[未指定單元]';

  const finalPedagogy = [
    ...context.pedagogies,
    context.pedagogyCustom.trim(),
  ].filter(Boolean).join('、') || '[未指定教學法]';

  const finalAssessment = [
    ...context.assessments,
    context.assessmentCustom.trim(),
  ].filter(Boolean).join('、') || '[未指定評量型態]';

  const extra = context.extra.trim() || '無特殊補充';

  const baseHeader = promptHeaders[currentRole];
  const finalPrompt = baseHeader
    .replace(/\[教育階段\]/g, stage)
    .replace(/\[科目\]/g, subject)
    .replace(/\[單元主題\]/g, topic)
    .replace(/\[教學法\]/g, finalPedagogy)
    .replace(/\[評量型態\]/g, finalAssessment)
    .replace(/\[補充說明\]/g, extra) + skill.prompt;

  // Copy to clipboard
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = finalPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyOutput = async () => {
    if (!aiOutput) return;
    try {
      await navigator.clipboard.writeText(aiOutput);
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2500);
    } catch {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2500);
    }
  };

  // Live generate with Gemini
  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setActiveTab('output');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          systemInstruction: currentRole === 'student'
            ? '你是一位台灣資深師資培育輔導教授與教學卓越獲獎教師。請以 108 課綱精神與標準教育術語，針對師培生的教案、評量與試教需求，輸出結構清晰、條理分明、具體可落地的繁體中文範例。'
            : '你是一位高等教育師資培育審查委員與教學設計專家。請站在大學師培教授的高度，提供具備理論深度 (如 TPACK, UbD, Bloom, ORID)、評量規準嚴謹度與教學示範價值的繁體中文成果。',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '生成失敗');
      }

      setAiOutput(data.text);
    } catch (err: any) {
      setErrorMessage(err.message || '生成失敗，請確認網路或複製至外部 AI 工具使用。');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Output as text / markdown
  const handleDownloadOutput = () => {
    const textToDownload = activeTab === 'output' && aiOutput ? aiOutput : finalPrompt;
    const blob = new Blob([textToDownload], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NCUE_AI_${skill.id}_${skill.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col h-[96vh] sm:h-[92vh] relative overflow-hidden border border-slate-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-bold text-white bg-blue-900 px-3 py-1 rounded-lg">
              Skill {skill.id}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {skill.title}
            </h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
              currentRole === 'student'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              {currentRole === 'student' ? '👩‍🏫 師培生視角' : '👨‍💼 教授 / 指導視角'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors rounded-xl w-9 h-9 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Column Layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* Left Column: Context Configuration */}
          <div className="w-full lg:w-5/12 border-r border-slate-200 p-5 sm:p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-5">
            
            {/* Skill Description */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1.5">
                技能說明
              </span>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {skill.desc}
              </p>

              {skill.links && skill.links.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  {skill.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>{link.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Video demonstration if available */}
            {skill.video && (
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900">
                <div className="bg-slate-800 px-3 py-1.5 text-xs text-slate-200 font-medium flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  研習操作示範影片
                </div>
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={skill.video}
                    title="研習示範影片"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Quick Scenario Preset Chips */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                  快速帶入研習範例情境
                </span>
                <span className="text-[11px] text-slate-400">點擊即自動套入</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {scenarioPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-700 transition-colors border border-slate-200 font-medium text-left"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: Setting Context Parameters */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  STEP 1：設定通用教學情境
                </h4>
                <button
                  onClick={onResetContext}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  重置
                </button>
              </div>

              {/* Stage & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    教育階段
                  </label>
                  <select
                    value={context.stage}
                    onChange={(e) => onUpdateContext({ stage: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none"
                  >
                    <option value="">請選擇</option>
                    {stageOptions.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    任教科目
                  </label>
                  <input
                    type="text"
                    value={context.subject}
                    onChange={(e) => onUpdateContext({ subject: e.target.value })}
                    placeholder="例如：國中數學、高中英文"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Common Subject Quick Chips */}
              <div className="flex flex-wrap gap-1">
                {commonSubjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => onUpdateContext({ subject: sub })}
                    className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                      context.subject === sub
                        ? 'bg-blue-100 text-blue-900 border-blue-300 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Unit / Topic */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  單元 / 教學主題
                </label>
                <input
                  type="text"
                  value={context.topic}
                  onChange={(e) => onUpdateContext({ topic: e.target.value })}
                  placeholder="例如：畢氏定理的應用、光合作用與呼吸作用"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none"
                />
              </div>

              {/* Pedagogies Toggle Chips */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  預計採用教學法 (可多選)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {pedagogyOptions.map((ped) => {
                    const isSelected = context.pedagogies.includes(ped);
                    return (
                      <button
                        key={ped}
                        type="button"
                        onClick={() => handleTogglePedagogy(ped)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-blue-900 text-white border-blue-900 shadow-xs font-medium'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-blue-900 hover:text-blue-900'
                        }`}
                      >
                        {ped}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={context.pedagogyCustom}
                  onChange={(e) => onUpdateContext({ pedagogyCustom: e.target.value })}
                  placeholder="其他自訂教學法填寫..."
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none bg-slate-50/50"
                />
              </div>

              {/* Assessment Formats Toggle Chips */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  預期評量 / 作業型態 (可多選)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {assessmentOptions.map((asm) => {
                    const isSelected = context.assessments.includes(asm);
                    return (
                      <button
                        key={asm}
                        type="button"
                        onClick={() => handleToggleAssessment(asm)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-blue-900 text-white border-blue-900 shadow-xs font-medium'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-blue-900 hover:text-blue-900'
                        }`}
                      >
                        {asm}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={context.assessmentCustom}
                  onChange={(e) => onUpdateContext({ assessmentCustom: e.target.value })}
                  placeholder="其他自訂評量型態填寫..."
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none bg-slate-50/50"
                />
              </div>

              {/* Special Needs & Situation */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  學生狀況與特殊需求 (選填)
                </label>
                <textarea
                  value={context.extra}
                  onChange={(e) => onUpdateContext({ extra: e.target.value })}
                  placeholder="例如：班上有雙峰學習落差、需融入 SDGs 議題、需提供具體評量規準表格..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none resize-none h-18"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Prompt & AI Generation Preview */}
          <div className="w-full lg:w-7/12 p-5 sm:p-6 flex flex-col bg-slate-50/40 overflow-y-auto">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 shrink-0">
              
              {/* Segmented Tab */}
              <div className="flex bg-slate-200/80 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'prompt'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Prompt 提示詞
                </button>
                <button
                  onClick={() => setActiveTab('output')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'output'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  AI 生成成果
                  {aiOutput && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                
                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60 whitespace-nowrap cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>正在生成中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>即時 AI 生成示範</span>
                    </>
                  )}
                </button>

                {/* Copy Button */}
                {activeTab === 'prompt' ? (
                  <button
                    onClick={handleCopyPrompt}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>已複製！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>一鍵複製 Prompt</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleCopyOutput}
                    disabled={!aiOutput}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap disabled:opacity-50 ${
                      copiedOutput
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                    }`}
                  >
                    {copiedOutput ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>成果已複製！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>複製生成文字</span>
                      </>
                    )}
                  </button>
                )}

                {/* Export Markdown */}
                <button
                  onClick={handleDownloadOutput}
                  title="匯出為 Markdown 檔案"
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 shadow-xs transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Display Area */}
            <div className="flex-1 min-h-[350px] relative rounded-xl overflow-hidden border border-slate-300 bg-white flex flex-col shadow-inner">
              
              {activeTab === 'prompt' ? (
                /* Prompt Display */
                <div className="flex-1 flex flex-col h-full">
                  <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                    <span className="font-mono">
                      字數：{finalPrompt.length} 字 · 格式：繁體中文 (108課綱標準)
                    </span>
                    <span className="text-slate-400">即時組合完畢</span>
                  </div>
                  <textarea
                    readOnly
                    value={finalPrompt}
                    className="flex-1 w-full p-4 text-xs sm:text-sm font-mono text-slate-800 resize-none outline-none leading-relaxed bg-white selection:bg-blue-200"
                  />
                </div>
              ) : (
                /* AI Output Display */
                <div className="flex-1 flex flex-col h-full overflow-y-auto">
                  <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span className="font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Gemini 2.5 Flash 生成結果
                    </span>
                    {aiOutput && (
                      <span className="text-slate-400 font-mono">
                        {aiOutput.length} 字
                      </span>
                    )}
                  </div>

                  {isGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                      <p className="text-sm font-semibold text-slate-800">
                        正在依據 108 課綱與情境規劃生成中...
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        為您整合教學法、評量規準與具體課堂師生流程
                      </p>
                    </div>
                  ) : errorMessage ? (
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                        <Info className="w-6 h-6" />
                      </div>
                      <h5 className="text-sm font-bold text-slate-800 mb-1">
                        提示訊息
                      </h5>
                      <p className="text-xs text-slate-600 max-w-md leading-relaxed mb-4">
                        {errorMessage}
                      </p>
                      <button
                        onClick={handleCopyPrompt}
                        className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        複製 Prompt 前往外部 AI 使用
                      </button>
                    </div>
                  ) : aiOutput ? (
                    <div className="p-5 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap select-text">
                      {aiOutput}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                      <Sparkles className="w-10 h-10 text-slate-200 mb-2" />
                      <p className="text-sm font-medium text-slate-600">
                        尚未進行即時生成
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        點擊右上角「即時 AI 生成示範」按鈕，立即預覽教案或教材成果，或點擊「一鍵複製 Prompt」貼到外部 AI。
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick External Tools Navigation */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                複製後，可直接前往常用 AI 平台貼上使用：
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://chatgpt.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium transition-colors flex items-center gap-1"
                >
                  <span>ChatGPT</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <a
                  href="https://claude.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium transition-colors flex items-center gap-1"
                >
                  <span>Claude</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <a
                  href="https://gemini.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium transition-colors flex items-center gap-1"
                >
                  <span>Gemini</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
