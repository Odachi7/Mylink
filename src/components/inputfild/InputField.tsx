interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ label, placeholder, value, onChange, type = "text" }: InputFieldProps) {
  return (
    <div className="flex flex-col mb-2 text-black">
      {label && <label className="text-white font-medium">{label}</label>}
      <input
        className="bg-white border-0 h-9 rounded-md px-2 mt-2"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
      />
    </div>
  );
}