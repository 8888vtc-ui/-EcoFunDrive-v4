// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - COOKIE CONSENT BANNER (RGPD COMPLIANT)
// Bandeau de consentement cookies conforme RGPD/CNIL
// ═══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { Cookie, Shield, X, Check, Info } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;    // Cookies essentiels (toujours activés)
  analytics: boolean;    // Google Analytics, etc.
  marketing: boolean;    // Cookies marketing
  preferences: boolean;  // Préférences utilisateur
}

interface CookieConsentProps {
  onConsentChange?: (settings: CookieSettings) => void;
  theme?: 'light' | 'dark';
  position?: 'bottom' | 'top';
  showOnFirstVisit?: boolean;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onConsentChange,
  theme = 'light',
  position = 'bottom',
  showOnFirstVisit = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true,     // Toujours true (non désactivable)
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Vérifier si le consentement a déjà été donné
  useEffect(() => {
    const hasConsent = localStorage.getItem('seo_sitegen_cookie_consent');
    const savedSettings = localStorage.getItem('seo_sitegen_cookie_settings');

    if (showOnFirstVisit && !hasConsent) {
      setIsVisible(true);
    } else if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        onConsentChange?.(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres cookies:', error);
      }
    }
  }, [showOnFirstVisit, onConsentChange]);

  // Appliquer les paramètres de cookies
  const applyCookieSettings = (newSettings: CookieSettings) => {
    // Sauvegarder localement
    localStorage.setItem('seo_sitegen_cookie_consent', 'given');
    localStorage.setItem('seo_sitegen_cookie_settings', JSON.stringify(newSettings));
    localStorage.setItem('seo_sitegen_cookie_date', new Date().toISOString());

    // Appliquer les cookies selon le consentement
    applyCookies(newSettings);

    // Notifier le parent
    onConsentChange?.(newSettings);

    // Mettre à jour l'état
    setSettings(newSettings);
    setIsVisible(false);
    setShowSettings(false);
  };

  // Appliquer les cookies selon les paramètres
  const applyCookies = (cookieSettings: CookieSettings) => {
    // Cookies essentiels (toujours activés)
    if (cookieSettings.necessary) {
      // Cookie de session, langue, etc.
      document.cookie = 'seo_sitegen_session=active; path=/; SameSite=Strict; Secure';
      document.cookie = `seo_sitegen_lang=fr; path=/; max-age=31536000; SameSite=Lax; Secure`;
    }

    // Google Analytics (si consentement)
    if (cookieSettings.analytics) {
      // Initialiser Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
      document.cookie = 'seo_sitegen_analytics=enabled; path=/; max-age=39500000; SameSite=Lax; Secure';
    } else {
      // Désactiver Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
      document.cookie = 'seo_sitegen_analytics=disabled; path=/; max-age=0; SameSite=Lax; Secure';
    }

    // Cookies marketing
    if (cookieSettings.marketing) {
      document.cookie = 'seo_sitegen_marketing=enabled; path=/; max-age=31536000; SameSite=Lax; Secure';
    } else {
      document.cookie = 'seo_sitegen_marketing=disabled; path=/; max-age=0; SameSite=Lax; Secure';
    }

    // Cookies de préférences
    if (cookieSettings.preferences) {
      document.cookie = 'seo_sitegen_preferences=enabled; path=/; max-age=31536000; SameSite=Lax; Secure';
    } else {
      document.cookie = 'seo_sitegen_preferences=disabled; path=/; max-age=0; SameSite=Lax; Secure';
    }
  };

  // Accepter tous les cookies
  const acceptAll = () => {
    const allAccepted: CookieSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    applyCookieSettings(allAccepted);
  };

  // Refuser tous les cookies (sauf essentiels)
  const rejectAll = () => {
    const allRejected: CookieSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    applyCookieSettings(allRejected);
  };

  // Accepter les paramètres personnalisés
  const acceptCustom = () => {
    applyCookieSettings(settings);
  };

  // Mettre à jour un paramètre spécifique
  const updateSetting = (key: keyof CookieSettings, value: boolean) => {
    if (key === 'necessary') return; // Non désactivable
    setSettings((prev: CookieSettings) => ({ ...prev, [key]: value }));
  };

  const themeClasses = {
    light: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-900',
      subtext: 'text-gray-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      overlay: 'bg-black/50'
    },
    dark: {
      bg: 'bg-gray-900',
      border: 'border-gray-700',
      text: 'text-white',
      subtext: 'text-gray-300',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-white',
      overlay: 'bg-black/75'
    }
  };

  const classes = themeClasses[theme as 'light' | 'dark'];

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className={`fixed inset-0 z-50 ${classes.overlay} ${position === 'top' ? 'bg-transparent' : ''}`} />
      
      {/* Bandeau principal */}
      <div className={`fixed ${position === 'bottom' ? 'bottom-0' : 'top-0'} left-0 right-0 z-50 ${classes.bg} border-t ${classes.border} shadow-lg`}>
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Texte explicatif */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-blue-600" />
                <h3 className={`font-semibold ${classes.text}`}>
                  Cookies et Confidentialité
                </h3>
              </div>
              <p className={`text-sm ${classes.subtext} mb-3`}>
                Ce site utilise des cookies pour améliorer votre expérience, 
                analyser le trafic et personnaliser le contenu. Conformément au RGPD, 
                nous demandons votre consentement pour certains cookies.
              </p>
              
              {/* Actions rapides */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={acceptAll}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${classes.button}`}
                >
                  <Check className="w-4 h-4 inline mr-1" />
                  Tout accepter
                </button>
                
                <button
                  onClick={rejectAll}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${classes.buttonSecondary}`}
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Tout refuser
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${classes.buttonSecondary}`}
                >
                  <Settings className="w-4 h-4 inline mr-1" />
                  Personnaliser
                </button>
              </div>

              {/* Lien vers politique */}
              <div className="flex items-center gap-4 text-xs">
                <a 
                  href="/politique-confidentialite" 
                  className={`flex items-center gap-1 ${classes.subtext} hover:underline`}
                >
                  <Shield className="w-3 h-3" />
                  Politique de confidentialité
                </a>
                <a 
                  href="/politique-cookies" 
                  className={`flex items-center gap-1 ${classes.subtext} hover:underline`}
                >
                  <Info className="w-3 h-3" />
                  En savoir plus
                </a>
              </div>
            </div>

            {/* Bouton fermer */}
            <button
              onClick={() => setIsVisible(false)}
              className={`p-2 rounded-lg ${classes.buttonSecondary} transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Paramètres détaillés */}
          {showSettings && (
            <div className={`mt-4 p-4 rounded-lg border ${classes.border} ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-3 ${classes.text}`}>Choisissez vos cookies :</h4>
              
              <div className="space-y-3">
                {/* Cookies essentiels */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`font-medium ${classes.text}`}>Cookies essentiels</label>
                    <p className={`text-xs ${classes.subtext}`}>
                      Nécessaires au fonctionnement du site (session, sécurité)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.necessary}
                    disabled
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`font-medium ${classes.text}`}>Cookies d'analyse</label>
                    <p className={`text-xs ${classes.subtext}`}>
                      Pour mesurer l'audience et améliorer le site (Google Analytics)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.analytics}
                    onChange={(e: any) => updateSetting('analytics', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`font-medium ${classes.text}`}>Cookies marketing</label>
                    <p className={`text-xs ${classes.subtext}`}>
                      Pour personnaliser les publicités et le contenu
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.marketing}
                    onChange={(e: any) => updateSetting('marketing', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                {/* Préférences */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`font-medium ${classes.text}`}>Cookies de préférences</label>
                    <p className={`text-xs ${classes.subtext}`}>
                      Pour mémoriser vos choix (langue, affichage)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.preferences}
                    onChange={(e: any) => updateSetting('preferences', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
              </div>

              {/* Valider les paramètres */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={acceptCustom}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${classes.button}`}
                >
                  Valider mes choix
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${classes.buttonSecondary}`}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Icône Settings manquante
const Settings = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default CookieConsent;
