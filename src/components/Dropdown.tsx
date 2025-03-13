import { useState, useCallback } from "react";
import styles from "@/styles/Dropdown.module.css";

interface DropdownProps {
  title: string;
  options: string[];
  onChange?: (selected: string[]) => void; // ✅ Added onChange prop
}

export default function Dropdown({ title, options, onChange }: DropdownProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = useCallback((option: string) => {
    setSelectedOptions((prevSelected) => {
      const updatedSelection = prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option];

      if (onChange) {
        onChange(updatedSelection); // ✅ Notify parent component
      }

      return updatedSelection;
    });
  }, [onChange]);

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownButton} tabIndex={0}>
        <span className={styles.dropdownTitle}>{title}</span>
      </div>

      <div className={styles.dropdownMenu}>
        {options.map((option, index) => (
          <label key={index} className={styles.dropdownItem}>
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
