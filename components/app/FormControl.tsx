import React from "react"

interface FormControlProps {
  label: string
  type: string
  value: string
  onChange: any
  className?: string
  error?: string
  disabled?: boolean
}

const FormControl = ({
  label,
  type,
  className,
  onChange,
  value,
  error,
  disabled,
}: FormControlProps) => {
  return (
    <div className={`form-group ${className}`}>
      <label className="form-title">{label}</label>

      <input
        type={type}
        className={`form-control ${error && "error"}`}
        placeholder={label}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        disabled={disabled}
      />

      <p className="error-message">{error}</p>
    </div>
  )
}

export default FormControl
