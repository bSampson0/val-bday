import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useCheckIn() {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [guestNumber, setGuestNumber] = useState(null);
  const [error, setError] = useState(null);

  const checkIn = async (name) => {
    if (!name.trim()) return;
    setStatus('submitting');
    setError(null);

    if (!supabase) {
      // Demo mode — no Supabase configured
      await new Promise((r) => setTimeout(r, 600));
      const demoCount = Math.floor(Math.random() * 20) + 1;
      setGuestNumber(demoCount);
      window.dispatchEvent(new CustomEvent('guest-checked-in', { detail: { count: demoCount } }));
      setStatus('success');
      return;
    }

    try {
      const { error: insertErr } = await supabase
        .from('guests')
        .insert({ name: name.trim() });

      if (insertErr) throw insertErr;

      const { count, error: countErr } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true });

      if (countErr) throw countErr;

      setGuestNumber(count);
      window.dispatchEvent(new CustomEvent('guest-checked-in', { detail: { count } }));
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setGuestNumber(null);
    setError(null);
  };

  return { checkIn, status, guestNumber, error, reset };
}
