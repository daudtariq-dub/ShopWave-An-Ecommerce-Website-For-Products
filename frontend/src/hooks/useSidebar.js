import { useState, useCallback } from 'react';

const SIDEBAR_KEY = 'sidebar_collapsed';

function getInitialState() {
  try {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    return stored !== null ? JSON.parse(stored) : false;
  } catch {
    return false;
  }
}

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(getInitialState);

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const expand = useCallback(() => {
    setCollapsed(false);
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify(false));
  }, []);

  const collapse = useCallback(() => {
    setCollapsed(true);
    localStorage.setItem(SIDEBAR_KEY, JSON.stringify(true));
  }, []);

  return { collapsed, toggleSidebar, expand, collapse };
}
