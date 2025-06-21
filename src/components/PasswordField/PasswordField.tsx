import { FaEye } from "react-icons/fa";
import { Input } from "../inputfild/InputField";
import { useState } from "react";

interface PasswordFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordField({ value, onChange }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        label="Senha"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2 top-2 text-white hover:text-gray-300"
      >
        <FaEye size={18} />
      </button>
    </div>
  );
}
