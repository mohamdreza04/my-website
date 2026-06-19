import { createContext, useContext, useState, type ReactNode } from 'react'

type Lang = 'fa' | 'en'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (fa: ReactNode, en: ReactNode) => ReactNode
  isRTL: boolean
}

const LangContext = createContext<LangContextType>({
  lang: 'fa',
  setLang: () => {},
  t: (fa) => fa,
  isRTL: true,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fa')

  const setLang = (l: Lang) => {
    setLangState(l)
    document.documentElement.lang = l
    document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr'
  }

  const t = (fa: ReactNode, en: ReactNode): ReactNode => (lang === 'fa' ? fa : en)
  const isRTL = lang === 'fa'

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)