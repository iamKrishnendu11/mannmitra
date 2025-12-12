// src/pages/Rewards.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Gift, 
  ShoppingBag, 
  PenTool, 
  Book, 
  StickyNote, 
  Shirt, 
  Check,      // Added Check icon for "Claimed" state
  Lock,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function Rewards() {
  const { progress, setProgress, refresh, accessToken } = useAuth();
  
  // Track which items have been redeemed in this session
  const [claimedItems, setClaimedItems] = useState([]);
  const [isRedeeming, setIsRedeeming] = useState(null); // Stores ID of item being redeemed

  useEffect(() => {
    // Refresh coin balance on load
    if (refresh) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentCoins = progress?.coins || 0;

  // Static list of rewards
  const rewards = [
    { 
      id: 'r_pen', 
      name: 'Premium Pen', 
      cost: 100, 
      icon: <PenTool className="h-12 w-12 text-purple-500" />,
      color: 'bg-purple-100'
    },
    { 
      id: 'r_notebook', 
      name: 'MannMitra Notebook', 
      cost: 150, 
      icon: <Book className="h-12 w-12 text-blue-500" />,
      color: 'bg-blue-100'
    },
    { 
      id: 'r_journal', 
      name: 'Wellness Journal', 
      cost: 200, 
      icon: <StickyNote className="h-12 w-12 text-green-500" />,
      color: 'bg-green-100'
    },
    { 
      id: 'r_tshirt', 
      name: 'Community T-Shirt', 
      cost: 300, 
      icon: <Shirt className="h-12 w-12 text-pink-500" />,
      color: 'bg-pink-100'
    },
    { 
      id: 'r_bag', 
      name: 'Eco Tote Bag', 
      cost: 400, 
      icon: <ShoppingBag className="h-12 w-12 text-orange-500" />,
      color: 'bg-orange-100'
    }
  ];

  const handleRedeem = async (item) => {
    if (currentCoins < item.cost) {
      toast.error(`You need ${item.cost - currentCoins} more coins!`);
      return;
    }

    if (!window.confirm(`Redeem ${item.name} for ${item.cost} coins?`)) return;

    setIsRedeeming(item.id);

    try {
      // 1. Call API to deduct coins
      // Using a generic 'update' or specific 'redeem' endpoint. 
      // If you don't have a specific backend route for redemption yet, 
      // we can assume the 'complete' or 'update' pattern.
      // Ideally, you should have: POST /api/progress/redeem
      
      const res = await fetch(`${API_BASE}/api/progress/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ 
          itemId: item.id, 
          cost: item.cost,
          itemName: item.name 
        })
      });

      const data = await res.json();

      if (res.ok) {
        // 2. Success! Update UI
        toast.success(`${item.name} redeemed successfully! 🎉`);
        
        // Mark as claimed locally so button changes color
        setClaimedItems(prev => [...prev, item.id]);

        // Update global coins
        if (data.progress) {
          setProgress(data.progress);
        } else {
          // Fallback manual update if server doesn't return progress
          setProgress(prev => ({ ...prev, coins: currentCoins - item.cost }));
        }

      } else {
        toast.error(data.message || 'Redemption failed');
      }
    } catch (error) {
      console.error('Redemption error', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsRedeeming(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-beige-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Gift className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Reward Store</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Redeem Your Coins</h1>
          <p className="text-gray-600 text-lg">Exchange your hard-earned coins for exclusive MannMitra merchandise</p>
        </div>

        {/* Coin Balance Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-purple-100 mb-2 font-medium">Your Coin Balance</p>
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-yellow-300 fill-yellow-300" />
                <span className="text-5xl font-bold">{currentCoins}</span>
                <span className="text-2xl text-purple-200">coins</span>
              </div>
            </div>
            <ShoppingBag className="absolute right-[-20px] bottom-[-20px] h-48 w-48 text-white opacity-10 transform rotate-12" />
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {rewards.map((item) => {
            const canAfford = currentCoins >= item.cost;
            const isClaimed = claimedItems.includes(item.id);
            const isLoading = isRedeeming === item.id;
            
            return (
              <Card key={item.id} className="rounded-3xl border-2 border-gray-100 hover:shadow-lg transition-all overflow-hidden group">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  
                  {/* Icon Circle */}
                  <div className={`w-24 h-24 rounded-full ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl font-bold text-purple-600">{item.cost}</span>
                    <span className="text-gray-500 text-sm">coins</span>
                  </div>

                  <div className="mt-auto w-full">
                    <Button 
                      onClick={() => handleRedeem(item)}
                      disabled={!canAfford || isLoading || isClaimed}
                      className={`w-full py-6 rounded-2xl text-base transition-all duration-300 ${
                        isClaimed
                          ? 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-100' // Claimed State
                          : canAfford 
                            ? 'bg-gray-900 hover:bg-gray-800 text-white' // Active State
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed' // Disabled State
                      }`}
                    >
                      {isLoading ? (
                        'Processing...'
                      ) : isClaimed ? (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Claimed
                        </>
                      ) : !canAfford ? (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          <span>Need {item.cost - currentCoins} more</span>
                        </div>
                      ) : (
                        'Redeem Now'
                      )}
                    </Button>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}