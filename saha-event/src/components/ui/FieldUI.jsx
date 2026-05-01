import React from 'react'

// Reusable field component for select, date, number, textarea and button
export default function FieldUI({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  className = '',
  children,
  ...rest
}) {
  const baseClass = `input-glass w-full ${className}`.trim()

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-text-light/80 mb-2">
          {label}
        </label>
      )}

      {type === 'select' && (
        <select id={id} value={value} onChange={onChange} required={required} className={baseClass} {...rest}>
          {options.map(opt => (
            // option can be string or { value, label }
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>{opt}</option>
            ) : (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )
          ))}
        </select>
      )}

      {type === 'date' && (
        <input id={id} type="date" value={value} onChange={onChange} required={required} className={baseClass} placeholder={placeholder} {...rest} />
      )}

      {type === 'number' && (
        <input id={id} type="number" value={value} onChange={onChange} required={required} className={baseClass} placeholder={placeholder} {...rest} />
      )}

      {type === 'textarea' && (
        <textarea id={id} value={value} onChange={onChange} required={required} placeholder={placeholder} className={`${baseClass} resize-none`} {...rest}>{children}</textarea>
      )}

      {type === 'button' && (
        <button id={id} type="button" onClick={onChange} className={`${className || 'btn-gradient w-full py-3'}`} {...rest}>
          {children || label}
        </button>
      )}

      {type === 'submit' && (
        <button id={id} type="submit" disabled={rest.disabled} className={`${className || 'btn-gradient w-full py-4 font-bold'}`} {...rest}>
          {children || label}
        </button>
      )}
    </div>
  )
}
