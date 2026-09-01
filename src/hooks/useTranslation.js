import { useLanguage } from '../context/LanguageContext'
import translations from '../data/translations'

export const useTranslation = () => {
  const { lang } = useLanguage()
  const t = (key) => translations[lang]?.[key] || translations['en'][key] || key
  return { t, lang }
}

export default useTranslation
