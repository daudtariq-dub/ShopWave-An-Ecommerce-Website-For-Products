import { useState, useCallback } from 'react';
import { formatPrice } from '../../../utils/helpers';

export default function RangeSlider({ min = 0, max = 1000, value = [0, 1000], onChange, step = 1 }) {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);

  const handleMin = useCallback((e) => {
    const v = Math.min(Number(e.target.value), localMax - step);
    setLocalMin(v);
    onChange([v, localMax]);
  }, [localMax, onChange, step]);

  const handleMax = useCallback((e) => {
    const v = Math.max(Number(e.target.value), localMin + step);
    setLocalMax(v);
    onChange([localMin, v]);
  }, [localMin, onChange, step]);

  const percent = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>{formatPrice(localMin)}</span>
        <span>{formatPrice(localMax)}</span>
      </div>

      <div className="relative h-2 rounded-full bg-gray-200">
        {/* Filled track */}
        <div
          className="absolute h-2 rounded-full bg-indigo-500"
          style={{
            left: `${percent(localMin)}%`,
            right: `${100 - percent(localMax)}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={handleMin}
          className="range-thumb absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={handleMax}
          className="range-thumb absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
        />
      </div>
    </div>
  );
}
