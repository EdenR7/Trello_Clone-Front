import { useState, useEffect } from "react";

interface useDebounceProps {
  value: any;
  delay: number;
}

function useDebounce({ value, delay }: useDebounceProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
