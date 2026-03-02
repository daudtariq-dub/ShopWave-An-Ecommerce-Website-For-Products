import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../hooks/useSearch';

export default function SearchBar({ className = '' }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { getSuggestions, query } = useSearch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const suggestTimer = useRef(null);

  useEffect(() => {
    if (query && inputValue === '') setInputValue(query);
  }, [query]); // eslint-disable-line

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(suggestTimer.current);
    if (val.length >= 2) {
      suggestTimer.current = setTimeout(async () => {
        const results = await getSuggestions(val);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const submit = (value) => {
    const q = (value ?? inputValue).trim();
    if (!q) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          onFocus={() => suggestions.length && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl bg-white
            focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
        />
      </div>

      {showSuggestions && (
        <ul className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                onClick={() => submit(s)}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {s}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
