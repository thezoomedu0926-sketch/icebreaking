import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Copy, Check, AlertCircle, Sparkles as SparklesIcon } from 'lucide-react';
import QuestionForm from './components/QuestionForm';
import ResultDisplay from './components/ResultDisplay';
import { FormData, GenerationResult } from './types';

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<GenerationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [lastConfig, setLastConfig] = React.useState<FormData | null>(null);

  const handleGenerate = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastConfig(data);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('질문카드 생성 중 오류가 발생했습니다.');
      }

      const rawData = await response.json();
      setResult(rawData);
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyAsMarkdown = () => {
    if (!result) return;

    let md = `# [교육 질문카드] Generated Workshop Cards\n\n`;
    md += `## 🎙️ 오프닝 멘트\n${result.opening}\n\n`;
    md += `## 📇 질문 카드 목록\n\n`;
    md += `| 번호 | 단계 | 질문 내용 | 기대 효과 |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    result.cards.forEach((card, idx) => {
      md += `| ${idx + 1} | ${card.level} | ${card.question} | ${card.effect} |\n`;
    });
    md += `\n## 🏁 클로징 멘트\n${result.closing}\n\n`;
    md += `## 💡 퍼실리테이션 팁\n`;
    result.tips.forEach((tip, idx) => {
      md += `${idx + 1}. ${tip}\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen w-full bg-[#F1F5F9] font-sans selection:bg-[#2563EB]/10 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[300px] bg-white border-r border-[#E2E8F0] p-6 flex flex-col shrink-0 overflow-y-auto">
        <div className="mb-8">
          <div className="text-[#2563EB] font-black text-2xl tracking-tighter leading-none mb-1">
            ICE BREAK
          </div>
          <div className="text-[0.65rem] text-[#64748B] font-black uppercase tracking-widest leading-none">
            Question Card Generator
          </div>
        </div>

        <QuestionForm onSubmit={handleGenerate} isLoading={isLoading} />
        
        <div className="mt-8 pt-8 border-t border-[#F1F5F9] text-center">
          <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">
            Powered by Gemini AI Studio
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="px-10 py-6 flex justify-between items-end border-b border-[#E2E8F0] bg-[#F1F5F9] sticky top-0 z-10">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black text-[#1E293B] tracking-tight">
              워크숍 질문 카드 셋
            </h1>
            <p className="text-[0.75rem] text-[#64748B] font-medium">
              {lastConfig 
                ? `대상: ${lastConfig.target} / 주제: ${lastConfig.topic} / 분위기: ${lastConfig.atmosphere}`
                : '당신의 아이디어를 카드 뉴스로 시각화하세요.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {result && (
              <div className="flex items-center gap-2">
                <span className="text-[0.65rem] px-2 py-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded text-[#475569] font-bold uppercase tracking-tight shrink-0">
                  총 {result.cards.length}개 카드
                </span>
                <button
                  onClick={copyAsMarkdown}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-all text-xs font-bold shadow-sm shadow-blue-100"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? '복사됨!' : '마크다운 복사'}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-10 flex-1">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full space-y-4 py-20"
              >
                <div className="w-12 h-12 border-3 border-[#E2E8F0] border-t-[#2563EB] rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-bold text-[#1E293B]">전문 퍼실리테이터의 질문을 구성 중입니다...</p>
                  <p className="text-[#94A3B8] text-[0.7rem] uppercase font-bold tracking-widest mt-1">Generating Contextual Content</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-red-100 p-10 rounded-2xl text-center space-y-4 shadow-sm"
              >
                <div className="mx-auto w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={20} />
                </div>
                <p className="text-red-900 font-bold text-sm">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-white rounded-md border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors"
                >
                  다시 시도하기
                </button>
              </motion.div>
            )}

            {result && !isLoading && !error && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ResultDisplay result={result} />
              </motion.div>
            )}

            {!result && !isLoading && !error && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full border-2 border-dashed border-[#E2E8F0] rounded-2xl py-32 bg-white/50"
              >
                <div className="text-center space-y-3">
                  <BookOpen className="mx-auto text-[#CBD5E1]" size={48} />
                  <div className="space-y-1">
                    <p className="text-[0.875rem] font-bold text-[#94A3B8]">준비된 질문 카드가 없습니다.</p>
                    <p className="text-[#CBD5E1] text-[0.7rem] uppercase font-black tracking-widest">Awaiting Input From Sidebar</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
