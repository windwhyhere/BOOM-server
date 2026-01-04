import React, { ReactNode } from 'react';
import { 
  Card as AntCard, 
  Input as AntInput, 
  Select as AntSelect, 
  Switch as AntSwitch, 
  Button as AntButton, 
  Tag as AntTag,
  Typography
} from 'antd';

const { Text } = Typography;
const { TextArea: AntTextArea } = AntInput;

// --- Card ---
export const Card: React.FC<{ children: ReactNode; title?: string; className?: string; action?: ReactNode }> = ({ children, title, className = '', action }) => (
  <AntCard 
    title={title} 
    extra={action} 
    className={`shadow-sm rounded-lg ${className}`}
    bordered={false}
    style={{ borderRadius: '8px' }}
  >
    {children}
  </AntCard>
);

// --- Input ---
interface InputProps {
  label?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  placeholder?: string;
  className?: string;
}
export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full mb-1">
    {label && <Text type="secondary" className="text-xs uppercase font-semibold">{label}</Text>}
    <AntInput {...props} className={className} />
  </div>
);

// --- Textarea ---
interface TextAreaProps {
    label?: string;
    rows?: number;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    className?: string;
    placeholder?: string;
}
export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
    <div className="flex flex-col gap-1 w-full mb-1">
      {label && <Text type="secondary" className="text-xs uppercase font-semibold">{label}</Text>}
      <AntTextArea {...props} className={className} />
    </div>
);

// --- Select ---
interface SelectProps {
  label?: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}
export const Select: React.FC<SelectProps> = ({ label, options, value, onChange, className = '', ...props }) => {
  // Adapter to convert AntD onChange (value) back to Event object expected by views
  const handleChange = (val: string) => {
    if (onChange) {
      onChange({ target: { value: val } } as unknown as React.ChangeEvent<HTMLSelectElement>);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full mb-1">
      {label && <Text type="secondary" className="text-xs uppercase font-semibold">{label}</Text>}
      <AntSelect
        value={value}
        onChange={handleChange}
        options={options}
        className={`w-full ${className}`}
        {...props}
      />
    </div>
  );
};

// --- Switch ---
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'small' | 'default';
  disabled?: boolean;
}
export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, size, disabled }) => (
  <div className={`flex items-center justify-between gap-4 py-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    {label && <span className="text-sm text-slate-700">{label}</span>}
    <AntSwitch checked={checked} onChange={onChange} size={size} disabled={disabled} />
  </div>
);

// --- Button ---
interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
  onClick?: () => void;
  size?: 'large' | 'middle' | 'small';
  className?: string;
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => {
  let type: "primary" | "default" | "text" | "link" | "dashed" | undefined = "default";
  let danger = false;
  let ghost = false;

  if (variant === 'primary') type = 'primary';
  if (variant === 'secondary') type = 'default';
  if (variant === 'ghost') type = 'text';
  if (variant === 'danger') { type = 'primary'; danger = true; }

  return (
    <AntButton 
        type={type} 
        danger={danger} 
        ghost={ghost}
        icon={icon} 
        className={className} 
        {...props}
    >
      {children}
    </AntButton>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: ReactNode; color?: 'blue' | 'green' | 'red' | 'gray' }> = ({ children, color = 'gray' }) => {
    const antColors = {
        blue: 'processing',
        green: 'success',
        red: 'error',
        gray: 'default',
    };
    return (
        <AntTag color={antColors[color]}>
            {children}
        </AntTag>
    )
}