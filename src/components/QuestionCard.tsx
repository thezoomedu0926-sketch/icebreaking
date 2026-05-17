import React from 'react';
import { motion } from 'motion/react';
import { Info, Quote } from 'lucide-react';
import { CardData } from '../types';

interface Props {
  card: CardData;
  index: number;
}

export default function QuestionCard({ card, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all h-full"
    >
      <div className="flex justify-between items-center">
        <span className="text-[0.65rem] font-black text-[#94A3B8] uppercase tracking-tighter">
          {card.id || `CARD-${index + 1}`}
        </span>
      </div>
      
      <p className="text-[0.875rem] font-semibold leading-relaxed text-[#334155] break-keep">
        {card.question}
      </p>

      <div className="mt-auto pt-3 border-t border-dashed border-[#E2E8F0]">
        <p className="text-[0.7rem] text-[#64748B] italic leading-relaxed">
          {card.effect}
        </p>
      </div>
    </motion.div>
  );
}
