interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'desktop' | 'tablet' | 'mobile';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'desktop',
  className = "",
  onClick 
}) => {
  const baseClasses = "font-poppins font-medium transition-all duration-200 rounded";
  
  const variantClasses = {
    primary: "bg-violet-500 text-white hover:bg-violet-600",
    secondary: "bg-indigo-900 text-white hover:bg-indigo-800"
  };

  const sizeClasses = {
    desktop: "px-6 py-3 text-base",
    tablet: "px-5 py-2.5 text-sm",
    mobile: "px-4 py-2 text-sm"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;