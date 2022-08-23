import React from "react";

interface RangeBoxProps {
  value: number | undefined;
  label?: string;
  onChange: any;
  min?: number;
  max?: number;
  step?: number;
}

const RangeBox = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.1,
}: RangeBoxProps) => {
  return (
    <div className="rangebox form-group">
      {label && (
        <label>
          {label} ({(value || 0) * 100}%)
        </label>
      )}

      <input
        className="form-range"
        type="range"
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default RangeBox;
