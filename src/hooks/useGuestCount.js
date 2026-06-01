import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGuestCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Immediately sync when any check-in completes on this device
    const onCheckIn = (e) => setCount(e.detail.count);
    window.addEventListener('guest-checked-in', onCheckIn);

    if (!supabase) return () => window.removeEventListener('guest-checked-in', onCheckIn);

    const fetchCount = async () => {
      const { count: c } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true });
      if (c != null) setCount(c);
    };

    fetchCount();

    // Realtime subscription keeps other devices in sync
    const channel = supabase
      .channel('guests-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guests' }, () => {
        fetchCount();
      })
      .subscribe();

    return () => {
      window.removeEventListener('guest-checked-in', onCheckIn);
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
