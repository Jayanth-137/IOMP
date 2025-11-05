import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ className }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const baseClass = ' py-1 border border-black rounded-md text-sm bg-white';

  return (
    <select
      aria-label="Select language"
      className={`${baseClass} ${className || ''}`}
      value={i18n.language || 'en'}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="te">తెలుగు</option>
    </select>
  );
};

export default LanguageSwitcher;
