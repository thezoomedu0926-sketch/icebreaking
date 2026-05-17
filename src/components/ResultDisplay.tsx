import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Presentation, PlayCircle, Flag, ChevronRight } from 'lucide-react';
import { GenerationResult } from '../types';
import QuestionCard from './QuestionCard';

interface Props {
  result: GenerationResult;
}

export default function ResultDisplay({ result }: Props) {
  const levels = [
    { name: '1단계', label: 'Level 1. 아이스브레이킹', headerStyle: 'bg-[#ECFDF5] text-[#065F46] border-l-4 border-[#10B981]' },
    { name: '2단계', label: 'Level 2. 테마 브릿지', headerStyle: 'bg-[#EFF6FF] text-[#1E40AF] border-l-4 border-[#3B82F6]' },
    { name: '3단계', label: 'Level 3. 딥 커넥션', headerStyle: 'bg-[#F5F3FF] text-[#5B21B6] border-l-4 border-[#8B5CF6]' }
  ];

  return (
    <div className="space-y-8 flex flex-col h-full">
      {/* Cards Section: Desktop 3-Column Grid */}
      <div className="grid lg:grid-cols-3 gap-5 flex-1 items-stretch">
        {levels.map((level) => (
          <div key={level.name} className="flex flex-col gap-4">
            <div className={`px-3 py-2 rounded-md text-[0.75rem] font-bold uppercase tracking-wider ${level.headerStyle}`}>
              {level.label}
            </div>
            <div className="flex flex-col gap-3">
              {result.cards
                .filter(c => c.level.includes(level.name))
                .map((card, idx) => (
                  <QuestionCard key={idx} card={card} index={idx} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Facilitation Tips */}
      <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-5 rounded-lg flex items-start gap-4">
        <div className="bg-[#F59E0B] text-white w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-black shrink-0 mt-0.5">
          !
        </div>
        <div className="space-y-2">
          <h3 className="text-[0.75rem] font-black text-[#92400E] uppercase tracking-wider">
             Facilitation Tips
          </h3>
          <div className="space-y-1.5">
            {result.tips.map((tip, idx) => (
              <p key={idx} className="text-[0.75rem] text-[#92400E] leading-relaxed break-keep">
                <span className="opacity-50">#</span> {tip}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
