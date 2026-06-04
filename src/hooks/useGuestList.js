import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGuestList() {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    const onCheckIn = () => fetchGuests();
    window.addEventListener('guest-checked-in', onCheckIn);

    if (!supabase) return () => window.removeEventListener('guest-checked-in', onCheckIn);

    const fetchGuests = async () => {
      const { data } = await supabase
        .from('guests')
        .select('name')
        .order('created_at', { ascending: true });
      if (data) setGuests(data.map((g) => g.name));
    };

    fetchGuests();

    const channel = supabase
      .channel('guests-list')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guests' }, () => {
        fetchGuests();
      })
      .subscribe();

    return () => {
      window.removeEventListener('guest-checked-in', onCheckIn);
      supabase.removeChannel(channel);
    };
  }, []);

  return guests;
}
