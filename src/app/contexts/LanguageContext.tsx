"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Language = 'ENG' | 'IND' | 'JPN';

export interface Translations {
  nav: { home: string; portofolio: string; shop: string };
  hero: { title: string; subtitle: string };
  about: { title: string; subtitle: string; quote: string; testimony: string; owner: string; description: string };
  footer: { username: string; rights: string };
  auth: { login: string; logout: string; myLibrary: string; purchaseHistory: string; signOut: string; loading: string };
  portofolio: {services: string; photoGallery: string; videoGallery: string; socialMediaManagement: string};
  shop: {title: string};
}

const translations: Record<Language, Translations> = {
  ENG: {
    nav: { home: 'Home', portofolio: 'Portfolio', shop: 'Shop' },
    about: {
      title: 'About us',
      subtitle: 'Aida Creative Agency',
      quote: '"WE RUN YOUR SOCIALS SO YOU CAN RUN YOUR BUSINESS"',
      testimony: '"Aida Creative made our brand content look much more professional on social media. Our engagement has increased significantly!"',
      owner: '— Owner of',
      description: 'Aida Creative is a Surabaya-based creative business established in 2022. Starting with photography and videography, it has expanded to provide Social Media Management services, helping businesses build strong brand identity and a professional digital presence. With the slogan "WE RUN YOUR SOCIALS SO YOU CAN RUN YOUR BUSINESS!", Aida Creative is committed to managing clients’ social media so they can focus on their core business.',
    },
    footer: { username: '@aidacreative.id', rights: '© 2025 es teh anget. All rights reserved.' },
    auth: { login: 'Login', logout: 'Logout', myLibrary: 'My Owned Products', purchaseHistory: 'Purchase History', signOut: 'Sign Out', loading: 'Loading...' },
    portofolio: {services: 'Our Services', photoGallery: 'Photography', videoGallery: 'Videography', socialMediaManagement: 'Social Media Management'},
    shop: {title: 'SHOP'},
  },
  IND: {
    nav: { home: 'Beranda', portofolio: 'Portofolio', shop: 'Toko' },
    about: {
      title: 'Tentang kami',
      subtitle: 'Aida Creative Agency',
      quote: '"KAMI KELOLA SOSIAL MEDIA ANDA SEHINGGA ANDA BISA FOKUS KE BISNIS"',
      testimony: '"Aida Creative membuat konten brand kami terlihat jauh lebih profesional di media sosial. Engagement kami meningkat signifikan!"',
      owner: '— Pemilik',
      description: 'Aida Creative adalah bisnis kreatif berbasis di Surabaya yang berdiri sejak tahun 2022. Berawal dari fotografi dan videografi, Aida Creative telah berkembang menjadi penyedia layanan Manajemen Media Sosial, membantu bisnis membangun identitas merek yang kuat dan kehadiran digital yang profesional. Dengan slogan "KAMI MENJALANKAN MEDIA SOSIAL ANDA AGAR ANDA DAPAT MENJALANKAN BISNIS ANDA!", Aida Creative berkomitmen untuk mengelola media sosial klien agar mereka dapat fokus pada bisnis inti mereka.',
    },
    footer: { username: '@aidacreative.id', rights: '© 2025 es teh anget. Hak cipta dilindungi.' },
    auth: { login: 'Masuk', logout: 'Keluar', myLibrary: 'Produk milik saya', purchaseHistory: 'Riwayat Pembelian', signOut: 'Keluar', loading: 'Memuat...' },
    portofolio: {services: 'Layanan Kami', photoGallery: 'Fotografi', videoGallery: 'Videografi', socialMediaManagement: 'Manajemen Media Sosial'},
    shop: {title: 'TOKO'},
  },
  JPN: {
    nav: { home: 'ホーム', portofolio: 'ポートフォリオ', shop: 'ショップ' },
    about: {
      title: '私たちについて',
      subtitle: 'Aida Creative Agency',
      quote: '"私たちはあなたのSNSを運営し、あなたはビジネスに集中できます"',
      testimony: '"Aida Creativeのおかげで、ソーシャルメディアでのブランドコンテンツがはるかにプロフェッショナルになりました。"',
      owner: '— オーナー',
      description: 'Aida Creativeは、2022年にスラバヤに設立されたクリエイティブ企業です。写真撮影とビデオ撮影から始まり、ソーシャルメディア管理サービスへと事業を拡大し、企業の強力なブランドアイデンティティとプロフェッショナルなデジタルプレゼンスの構築を支援しています。「私たちがあなたのソーシャルメディアを管理します。あなたはビジネスに集中できます！」というスローガンを掲げ、Aida Creativeはクライアントのソーシャルメディア管理に尽力し、コアビジネスに集中できるよう尽力して​​います。',
    },
    footer: { username: '@aidacreative.id', rights: '© 2025 es teh anget. 全著作権所有。' },
    auth: { login: 'ログイン', logout: 'ログアウト', myLibrary: '私の所有する製品', purchaseHistory: '購入履歴', signOut: 'サインアウト', loading: '読み込み中...' },
    portofolio: {services: '私たちのサービス', photoGallery: '写真撮影', videoGallery: 'ビデオ撮影', socialMediaManagement: 'ソーシャルメディア管理'},
    shop: {title: 'ショップ'},
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ENG',
  setLanguage: () => {},
  t: translations['ENG'],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ENG');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('preferred_language') as Language;
      if (saved && translations[saved]) {
        setLanguageState(saved);
      }
    } catch (e) {}
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('preferred_language', lang);
    } catch (e) {}
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}