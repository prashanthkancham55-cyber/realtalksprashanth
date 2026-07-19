import { useEffect, useState } from 'react';
import { getSettings } from './settingsService';
import type { SiteSettings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getSettings()
      .then(s => { if (mounted) setSettings(s); })
      .catch(() => { /* fall back to defaults */ })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { settings, loading };
}
