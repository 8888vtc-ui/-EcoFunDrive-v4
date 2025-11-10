// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - POLITIQUE DE CONFIDENTIALITÉ RGPD
// Page complète conforme RGPD/CNIL avec intégration système
// ═══════════════════════════════════════════════════════════

import React from 'react';
import { Shield, Eye, Edit3, Trash2, Download, Lock, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const PolitiqueConfidentialite: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Politique de Confidentialité</h1>
          </div>
          <p className="text-xl text-blue-100">
            Protection des données personnelles conforme au RGPD
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Avis important */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                ECOFUNDRIVE s'engage à protéger vos données
              </h3>
              <p className="text-blue-800">
                Conformément au Règlement Général sur la Protection des Données (RGPD) 
                et à la loi Informatique et Libertés, nous mettons tout en œuvre pour 
                garantir la sécurité et la confidentialité de vos informations personnelles.
              </p>
            </div>
          </div>
        </div>

        {/* Table des matières */}
        <nav className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Table des matières</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { icon: <MapPin className="w-4 h-4" />, title: "1. Responsable du traitement", href: "#responsable" },
              { icon: <Eye className="w-4 h-4" />, title: "2. Données collectées", href: "#donnees" },
              { icon: <Edit3 className="w-4 h-4" />, title: "3. Finalités et base légale", href: "#finalites" },
              { icon: <Lock className="w-4 h-4" />, title: "4. Durée de conservation", href: "#conservation" },
              { icon: <Download className="w-4 h-4" />, title: "5. Vos droits RGPD", href: "#droits" },
              { icon: <Mail className="w-4 h-4" />, title: "6. Contact et réclamations", href: "#contact" }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors py-1"
              >
                {item.icon}
                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* 1. Responsable du traitement */}
        <section id="responsable" className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            1. Responsable du traitement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Informations entreprise</h3>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Nom :</dt>
                  <dd>ECOFUNDRIVE</dd>
                </div>
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">SIRET :</dt>
                  <dd>91224469600015</dd>
                </div>
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Email :</dt>
                  <dd>
                    <a href="mailto:8888vtc@gmail.com" className="text-blue-600 hover:underline">
                      8888vtc@gmail.com
                    </a>
                  </dd>
                </div>
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Téléphone :</dt>
                  <dd>
                    <a href="tel:+33616552811" className="text-blue-600 hover:underline">
                      +33 6 16 55 28 11
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Représentant légal</h3>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Nom :</dt>
                  <dd>David Chemla</dd>
                </div>
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Qualité :</dt>
                  <dd>Local Guide Google Niveau 6</dd>
                </div>
                <div className="flex">
                  <dt className="font-medium text-gray-600 w-24">Zone :</dt>
                  <dd>French Riviera</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* 2. Données collectées */}
        <section id="donnees" className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-600" />
            2. Données collectées
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Données de réservation</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Nom et prénom",
                    "Numéro de téléphone",
                    "Adresse email",
                    "Adresses de prise en charge et destination",
                    "Date et heure de la course",
                    "Informations de vol (transferts aéroport)",
                    "Nombre de passagers",
                    "Bagages et besoins spécifiques"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Données de navigation</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Adresse IP (anonymisée)",
                    "Type de navigateur et système d'exploitation",
                    "Pages visitées et temps passé",
                    "URL de provenance",
                    "Cookies (avec consentement)",
                    "Identifiant de session"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Données de communication</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Historique des communications",
                    "Préférences de contact",
                    "Feedback et avis clients",
                    "Support technique interactions"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Finalités et base légale */}
        <section id="finalites" className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Edit3 className="w-6 h-6 text-blue-600" />
            3. Finalités du traitement et base légale
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 border-b font-semibold">Finalité</th>
                  <th className="text-left p-4 border-b font-semibold">Base légale</th>
                  <th className="text-left p-4 border-b font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    finalite: "Gestion des réservations VTC",
                    base: "Exécution du contrat",
                    duree: "3 ans après dernière course"
                  },
                  {
                    finalite: "Facturation et comptabilité",
                    base: "Obligation légale",
                    duree: "10 ans (code de commerce)"
                  },
                  {
                    finalite: "Amélioration des services",
                    base: "Intérêt légitime",
                    duree: "2 ans"
                  },
                  {
                    finalite: "Marketing et newsletter",
                    base: "Consentement",
                    duree: "3 ans sans interaction"
                  },
                  {
                    finalite: "Analyse d'audience",
                    base: "Consentement",
                    duree: "13 mois maximum"
                  },
                  {
                    finalite: "Sécurité et prévention fraude",
                    base: "Intérêt légitime",
                    duree: "5 ans"
                  }
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 border-b">{row.finalite}</td>
                    <td className="p-4 border-b">{row.base}</td>
                    <td className="p-4 border-b">{row.duree}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Durée de conservation */}
        <section id="conservation" className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            4. Durée de conservation des données
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { type: "Données de réservation", duree: "3 ans après dernière course", note: "Peut être étendu pour réclamations" },
              { type: "Factures et documents comptables", duree: "10 ans", note: "Obligation légale code de commerce" },
              { type: "Cookies analytics", duree: "13 mois maximum", note: "Consentement requis" },
              { type: "Cookies préférences", duree: "6 mois", note: "Session utilisateur" },
              { type: "Données prospects", duree: "3 ans sans interaction", note: "Droit à l'oubli applicable" },
              { type: "Historique support", duree: "2 ans", note: "Amélioration service" }
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{item.type}</h4>
                <p className="text-blue-600 font-medium mb-1">{item.duree}</p>
                <p className="text-sm text-gray-600">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Vos droits RGPD */}
        <section id="droits" className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Download className="w-6 h-6 text-blue-600" />
            5. Vos droits RGPD
          </h2>
          
          <div className="space-y-4">
            {[
              {
                icon: <Eye className="w-5 h-5" />,
                title: "Droit d'accès",
                description: "Obtenir une copie de toutes vos données personnelles que nous détenons.",
                delai: "1 mois maximum"
              },
              {
                icon: <Edit3 className="w-5 h-5" />,
                title: "Droit de rectification",
                description: "Corriger toute information inexacte ou incomplète vous concernant.",
                delai: "1 mois maximum"
              },
              {
                icon: <Trash2 className="w-5 h-5" />,
                title: "Droit à l'effacement",
                description: "Demander la suppression de vos données (sauf obligations légales).",
                delai: "1 mois maximum"
              },
              {
                icon: <Lock className="w-5 h-5" />,
                title: "Droit à la limitation",
                description: "Limiter le traitement de vos données dans certaines conditions.",
                delai: "1 mois maximum"
              },
              {
                icon: <Download className="w-5 h-5" />,
                title: "Droit à la portabilité",
                description: "Recevoir vos données dans un format structéré et lisible.",
                delai: "1 mois maximum"
              },
              {
                icon: <Edit3 className="w-5 h-5" />,
                title: "Droit d'opposition",
                description: "Vous opposer au traitement pour des motifs légitimes.",
                delai: "1 mois maximum"
              }
            ].map((droit, index) => (
              <div key={index} className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 mt-1">{droit.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{droit.title}</h4>
                    <p className="text-gray-700 mb-2">{droit.description}</p>
                    <p className="text-sm text-blue-600 font-medium">Délai de réponse : {droit.delai}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-600 rounded-r-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Comment exercer vos droits ?</h4>
            <p className="text-yellow-800 mb-3">
              Envoyez un email à <a href="mailto:8888vtc@gmail.com" className="underline">8888vtc@gmail.com</a> en précisant :
            </p>
            <ul className="list-disc list-inside text-yellow-800 space-y-1">
              <li>Votre nom et adresse email</li>
              <li>Le droit que vous souhaitez exercer</li>
              <li>Une copie de votre pièce d'identité (pour vérification)</li>
              <li>Les données concernées (si applicable)</li>
            </ul>
          </div>
        </section>

        {/* 6. Contact et réclamations */}
        <section id="contact" className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Mail className="w-6 h-6 text-blue-600" />
            6. Contact et réclamations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact ECOFUNDRIVE</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:8888vtc@gmail.com" className="text-blue-600 hover:underline">
                      8888vtc@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <a href="tel:+33616552811" className="text-blue-600 hover:underline">
                      +33 6 16 55 28 11
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Autorité de contrôle (CNIL)</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium mb-2">CNIL - Commission Nationale Informatique et Libertés</p>
                <address className="text-sm not-italic">
                  <p>3 Place de Fontenoy</p>
                  <p>TSA 80715</p>
                  <p>75334 PARIS CEDEX 07</p>
                  <p className="mt-2">Téléphone : 01 53 73 22 22</p>
                  <p>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener" className="text-blue-600 hover:underline">www.cnil.fr</a></p>
                </address>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg">
            <p className="text-red-800">
              <strong>Important :</strong> Si vous estimez que vos droits ne sont pas respectés 
              après nous avoir contactés, vous pouvez introduire une réclamation auprès 
              de la CNIL dans un délai de 5 ans à compter du fait générateur.
            </p>
          </div>
        </section>

        {/* Sécurité */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-blue-600" />
            Sécurité de vos données
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Chiffrement HTTPS (SSL/TLS) sur toutes les communications",
              "Hébergement sécurisé (Netlify - certifié ISO 27001)",
              "Accès limité aux données (personnel autorisé uniquement)",
              "Sauvegardes régulières et chiffrées",
              "Mots de passe sécurisés et authentification forte",
              "Audit de sécurité régulier",
              "Formation continue du personnel RGPD",
              "Sous-traitants qualifiés et conformes"
            ].map((measure, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-gray-700">{measure}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-2">
            <strong>Dernière mise à jour :</strong> {currentDate}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Version :</strong> 3.0 - ECOFUNDRIVE V3
          </p>
          <p className="text-sm text-gray-500">
            Cette politique peut être mise à jour. Les modifications importantes 
            vous seront notifiées par email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;
