import React from 'react'
import { motion } from 'framer-motion'

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
  const inputBaseStyles = "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-300"
  
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <div className="relative">
            <select 
              id={id} 
              value={value} 
              onChange={onChange} 
              required={required} 
              className={`${inputBaseStyles} appearance-none cursor-pointer ${className}`}
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23f3e8ff%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")', 
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'right 1.25rem center', 
                backgroundSize: '12px'
              }}
              {...rest}
            >
              {options.map((opt, idx) => (
                typeof opt === 'string' 
                  ? <option key={idx} value={opt} className="bg-primary text-white">{opt}</option>
                  : <option key={opt.value || idx} value={opt.value} className="bg-primary text-white">{opt.label}</option>
              ))}
            </select>
          </div>
        )
      case 'date':
        return (
          <input 
            id={id} 
            type="date" 
            value={value} 
            onChange={onChange} 
            required={required} 
            className={`${inputBaseStyles} ${className}`}
            {...rest} 
          />
        )
      case 'number':
        return (
          <input 
            id={id} 
            type="number" 
            value={value} 
            onChange={onChange} 
            required={required} 
            className={`${inputBaseStyles} ${className}`} 
            placeholder={placeholder}
            {...rest} 
          />
        )
      case 'textarea':
        return (
          <textarea 
            id={id} 
            value={value} 
            onChange={onChange} 
            required={required} 
            placeholder={placeholder} 
            className={`${inputBaseStyles} resize-none ${className}`} 
            {...rest}
          >
            {children}
          </textarea>
        )
      case 'submit':
      case 'button':
        return (
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            id={id} 
            type={type} 
            onClick={type === 'button' ? onChange : undefined} 
            className={`${className || 'w-full bg-accent hover:bg-yellow-400 text-primary py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-accent/10 transition-all'}`} 
            {...rest}
          >
            {children || label}
          </motion.button>
        )
      default:
        return (
          <input 
            id={id} 
            type={type} 
            value={value} 
            onChange={onChange} 
            required={required} 
            className={`${inputBaseStyles} ${className}`} 
            placeholder={placeholder}
            {...rest} 
          />
        )
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] mb-2 ml-1">
          {label}
        </label>
      )}
      {renderInput()}
    </div>
  )
}
