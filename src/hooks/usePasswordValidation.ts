import { useState } from "react";

export function usePasswordValidation() {
  const [password, setPassword] = useState("");

  const errors = {
    length: password.length < 8,
    uppercase: !/[A-Z]/.test(password),
    number: !/[0-9]/.test(password),
    special: !/[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid = Object.values(errors).every((e) => e === false);

  return { password, setPassword, errors, isValid };
}