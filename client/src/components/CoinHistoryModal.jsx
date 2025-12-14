// src/components/CoinHistoryModal.jsx

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

export default function CoinHistoryModal({ isOpen, onClose, history = [] }) {
  // Sort by date (newest first)
  
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <History className="w-5 h-5 text-purple-600" />
            Coin History
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {sortedHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions yet. Start earning!
            </div>
          ) : (
            <ScrollArea className="h-[300px] w-full pr-4">
              <div className="space-y-4">
                {sortedHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        item.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {item.type === 'earned' ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      item.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.type === 'earned' ? '+' : '-'}{item.amount}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}