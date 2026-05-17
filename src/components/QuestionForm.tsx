import React from 'react';
import { Target, MessageSquare, Sparkles, Send } from 'lucide-react';
import { FormData } from '../types';

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export default function QuestionForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = React.useState<FormData>({
    topic: '',
    target: '',
    atmosphere: '활기차고 유쾌한',
    count: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
      <div className="space-y-1.5 text-left">
        <label className="block text-[0.75rem] font-bold text-[#475569] uppercase tracking-wider">
          교육 주제 / 과정명
        </label>
        <input
          type="text"
          placeholder="예: 신임 팀장 리더십 과정"
          className="w-full px-3 py-2.5 rounded-md border border-[#CBD5E1] bg-white text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all outline-none"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          required
        />
      </div>

      <div className="space-y-1.5 text-left">
        <label className="block text-[0.75rem] font-bold text-[#475569] uppercase tracking-wider">
          학습 대상자
        </label>
        <select
          className="w-full px-3 py-2.5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all outline-none"
          value={formData.target}
          onChange={(e) => setFormData({ ...formData, target: e.target.value })}
        >
          <option value="신입사원">신입사원</option>
          <option value="2~3년 차 주임/대리급">2~3년 차 주임/대리급</option>
          <option value="팀장 및 관리자">팀장 및 관리자</option>
          <option value="임원진">임원진</option>
        </select>
      </div>

      <div className="space-y-2 text-left">
        <label className="block text-[0.75rem] font-bold text-[#475569] uppercase tracking-wider">
          워크숍 분위기
        </label>
        <div className="flex flex-wrap gap-2">
          {['활기찬', '진중한', '따뜻한', '창의적'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFormData({ ...formData, atmosphere: mode })}
              className={`px-3 py-1.5 rounded-full text-[0.7rem] font-bold border transition-all ${
                formData.atmosphere === mode
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 text-left">
        <div className="flex justify-between items-center text-[0.75rem] font-bold text-[#475569] uppercase tracking-wider">
          <span>단계별 카드 개수</span>
          <span className="text-[#2563EB]">{formData.count}개</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
          value={formData.count}
          onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
        />
        <div className="flex justify-between text-[0.65rem] text-[#94A3B8] font-bold">
          <span>1개</span>
          <span>3개</span>
          <span>5개</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all mt-auto ${
          isLoading 
            ? 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed' 
            : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-[#CBD5E1] border-t-[#64748B] rounded-full animate-spin" />
        ) : (
          '질문 카드 생성하기'
        )}
      </button>
    </form>
  );
}
