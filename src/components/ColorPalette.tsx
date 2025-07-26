interface ColorPaletteProps {
  className?: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ className = "" }) => {
  const colors = [
    { name: "Light Gray", value: "#f5f5f5", bgClass: "bg-gray-100" },
    { name: "Light Blue", value: "#8b5cf6", bgClass: "bg-violet-500" },
    { name: "Dark Blue", value: "#1e1b4b", bgClass: "bg-indigo-900" },
    { name: "Medium Gray", value: "#9ca3af", bgClass: "bg-gray-400" },
  ];

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4 font-poppins">Paleta de cores</h3>
      <div className="flex gap-1">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`w-12 h-12 ${color.bgClass} border border-gray-300`}
            title={`${color.name}: ${color.value}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;