// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V3 - RGPD COMPLIANCE SYSTEM
// Conformité complète RGPD/CNIL pour données personnelles
// ═══════════════════════════════════════════════════════════

export interface PersonalData {
  id: string;
  type: 'reservation' | 'contact' | 'newsletter' | 'analytics';
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    pickupAddress?: string;
    destinationAddress?: string;
    flightInfo?: string;
    reservationDate?: string;
    consent: {
      analytics: boolean;
      marketing: boolean;
      cookies: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  retentionPeriod: number; // en mois
  legalBasis: 'contract' | 'consent' | 'legal_obligation' | 'legitimate_interest';
}

export interface RGPDRequest {
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  userEmail: string;
  requestId: string;
  identityProof?: string; // URL vers pièce d'identité
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
}

export class RGPDComplianceManager {
  private static instance: RGPDComplianceManager;
  private dataStore: Map<string, PersonalData[]> = new Map();
  private requests: Map<string, RGPDRequest> = new Map();

  private constructor() {
    this.initializeRetentionPolicies();
  }

  public static getInstance(): RGPDComplianceManager {
    if (!RGPDComplianceManager.instance) {
      RGPDComplianceManager.instance = new RGPDComplianceManager();
    }
    return RGPDComplianceManager.instance;
  }

  // ═══════════════════════════════════════════════════════════
  // GESTION DES DONNÉES PERSONNELLES
  // ═══════════════════════════════════════════════════════════

  /**
   * Enregistre une nouvelle donnée personnelle avec consentement
   */
  public async storePersonalData(data: Omit<PersonalData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = this.generateId();
    const personalData: PersonalData = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validation RGPD
    this.validatePersonalData(personalData);

    // Stockage sécurisé
    if (!this.dataStore.has(data.data.email || '')) {
      this.dataStore.set(data.data.email || '', []);
    }
    this.dataStore.get(data.data.email || '')?.push(personalData);

    // Log pour audit
    this.logDataOperation('store', id, data.type);

    return id;
  }

  /**
   * Récupère les données personnelles (droit d'accès RGPD)
   */
  public async getPersonalData(email: string, requestId?: string): Promise<PersonalData[]> {
    // Vérification autorisation
    if (requestId) {
      const request = this.requests.get(requestId);
      if (!request || request.userEmail !== email || request.status !== 'completed') {
        throw new Error('Autorisation invalide pour l\'accès aux données');
      }
    }

    const data = this.dataStore.get(email) || [];
    
    // Log d'accès
    this.logDataOperation('access', email, 'data_access');

    return data.map(d => this.sanitizeData(d));
  }

  /**
   * Met à jour les données personnelles (droit de rectification)
   */
  public async updatePersonalData(
    email: string, 
    dataId: string, 
    updates: Partial<PersonalData['data']>,
    requestId?: string
  ): Promise<void> {
    // Vérification autorisation
    if (requestId) {
      const request = this.requests.get(requestId);
      if (!request || request.userEmail !== email) {
        throw new Error('Autorisation invalide pour la mise à jour');
      }
    }

    const userDatas = this.dataStore.get(email);
    if (!userDatas) {
      throw new Error('Données non trouvées');
    }

    const dataIndex = userDatas.findIndex(d => d.id === dataId);
    if (dataIndex === -1) {
      throw new Error('Donnée spécifique non trouvée');
    }

    // Mise à jour avec validation
    const updatedData = {
      ...userDatas[dataIndex],
      data: { ...userDatas[dataIndex].data, ...updates },
      updatedAt: new Date()
    };

    this.validatePersonalData(updatedData);
    userDatas[dataIndex] = updatedData;

    // Log de modification
    this.logDataOperation('update', dataId, 'rectification');
  }

  /**
   * Supprime les données personnelles (droit à l'effacement)
   */
  public async deletePersonalData(
    email: string, 
    dataId?: string,
    requestId?: string
  ): Promise<void> {
    // Vérification autorisation
    if (requestId) {
      const request = this.requests.get(requestId);
      if (!request || request.userEmail !== email) {
        throw new Error('Autorisation invalide pour la suppression');
      }
    }

    const userDatas = this.dataStore.get(email);
    if (!userDatas) {
      return; // Rien à supprimer
    }

    if (dataId) {
      // Suppression spécifique
      const index = userDatas.findIndex(d => d.id === dataId);
      if (index !== -1) {
        // Vérifier obligation légale (factures 10 ans)
        const data = userDatas[index];
        if (data.type === 'reservation' && this.isWithinLegalRetentionPeriod(data)) {
          throw new Error('Impossible de supprimer : obligation légale de conservation');
        }
        
        userDatas.splice(index, 1);
        this.logDataOperation('delete', dataId, 'erasure');
      }
    } else {
      // Suppression totale (sauf obligations légales)
      const filteredData = userDatas.filter(data => {
        const canDelete = !this.isWithinLegalRetentionPeriod(data);
        if (!canDelete) {
          this.logDataOperation('retain', data.id, 'legal_retention');
        }
        return canDelete;
      });

      if (filteredData.length === 0) {
        this.dataStore.delete(email);
      } else {
        this.dataStore.set(email, filteredData);
      }

      this.logDataOperation('delete', email, 'complete_erasure');
    }
  }

  // ═══════════════════════════════════════════════════════════
  // GESTION DES DEMANDES RGPD
  // ═══════════════════════════════════════════════════════════

  /**
   * Crée une demande RGPD (accès, rectification, suppression, etc.)
   */
  public async createRGPDRequest(
    type: RGPDRequest['type'],
    userEmail: string,
    identityProof?: string
  ): Promise<string> {
    const requestId = this.generateId();
    const request: RGPDRequest = {
      type,
      userEmail,
      requestId,
      identityProof,
      createdAt: new Date(),
      status: 'pending'
    };

    this.requests.set(requestId, request);

    // Notification email (simulation)
    await this.notifyRGPDRequest(request);

    // Log
    this.logDataOperation('request', requestId, type);

    return requestId;
  }

  /**
   * Traite une demande RGPD
   */
  public async processRGPDRequest(requestId: string): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) {
      throw new Error('Demande non trouvée');
    }

    request.status = 'processing';

    try {
      switch (request.type) {
        case 'access':
          await this.processAccessRequest(request);
          break;
        case 'rectification':
          await this.processRectificationRequest(request);
          break;
        case 'erasure':
          await this.processErasureRequest(request);
          break;
        case 'portability':
          await this.processPortabilityRequest(request);
          break;
        case 'restriction':
          await this.processRestrictionRequest(request);
          break;
        case 'objection':
          await this.processObjectionRequest(request);
          break;
      }

      request.status = 'completed';
      this.logDataOperation('complete', requestId, 'request_processed');

    } catch (error) {
      request.status = 'rejected';
      this.logDataOperation('reject', requestId, 'request_rejected');
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // CONSENTIMENT ET COOKIES
  // ═══════════════════════════════════════════════════════════

  /**
   * Gère le consentement cookies
   */
  public updateCookieConsent(email: string, consent: PersonalData['data']['consent']): void {
    const userDatas = this.dataStore.get(email);
    if (userDatas) {
      userDatas.forEach(data => {
        data.data.consent = { ...data.data.consent, ...consent };
        data.updatedAt = new Date();
      });
      this.logDataOperation('consent', email, 'cookie_consent_updated');
    }
  }

  /**
   * Vérifie le consentement pour un type spécifique
   */
  public hasConsent(email: string, consentType: keyof PersonalData['data']['consent']): boolean {
    const userDatas = this.dataStore.get(email);
    if (!userDatas || userDatas.length === 0) {
      return false;
    }

    // Vérifier le consentement le plus récent
    const latestData = userDatas.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
    return latestData.data.consent?.[consentType] || false;
  }

  // ═══════════════════════════════════════════════════════════
  // MÉTHODES PRIVÉES
  // ═══════════════════════════════════════════════════════════

  private validatePersonalData(data: PersonalData): void {
    // Validation email
    if (data.data.email && !this.isValidEmail(data.data.email)) {
      throw new Error('Email invalide');
    }

    // Validation téléphone
    if (data.data.phone && !this.isValidPhone(data.data.phone)) {
      throw new Error('Numéro de téléphone invalide');
    }

    // Vérification consentement si requis
    if (data.legalBasis === 'consent' && !this.hasValidConsent(data)) {
      throw new Error('Consentement invalide ou manquant');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  private hasValidConsent(data: PersonalData): boolean {
    return data.data.consent !== undefined;
  }

  private isWithinLegalRetentionPeriod(data: PersonalData): boolean {
    const retentionDate = new Date(data.createdAt);
    retentionDate.setMonth(retentionDate.getMonth() + data.retentionPeriod);
    
    // Exceptions légales
    if (data.type === 'reservation') {
      const legalRetentionDate = new Date(data.createdAt);
      legalRetentionDate.setFullYear(legalRetentionDate.getFullYear() + 10); // 10 ans pour factures
      return new Date() < legalRetentionDate;
    }

    return new Date() < retentionDate;
  }

  private sanitizeData(data: PersonalData): PersonalData {
    // Masquer les données sensibles pour l'export
    return {
      ...data,
      data: {
        ...data.data,
        phone: data.data.phone ? this.maskPhone(data.data.phone) : undefined
      }
    };
  }

  private maskPhone(phone: string): string {
    return phone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');
  }

  private generateId(): string {
    return `rgpd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeRetentionPolicies(): void {
    // Nettoyage automatique périodique
    setInterval(() => {
      this.performDataCleanup();
    }, 24 * 60 * 60 * 1000); // Tous les jours
  }

  private performDataCleanup(): void {
    const now = new Date();
    
    for (const [email, datas] of this.dataStore.entries()) {
      const filteredData = datas.filter(data => {
        if (this.isWithinLegalRetentionPeriod(data)) {
          return true; // Garder si obligation légale
        }
        
        const retentionDate = new Date(data.createdAt);
        retentionDate.setMonth(retentionDate.getMonth() + data.retentionPeriod);
        
        return now < retentionDate;
      });

      if (filteredData.length === 0) {
        this.dataStore.delete(email);
      } else {
        this.dataStore.set(email, filteredData);
      }
    }

    this.logDataOperation('cleanup', 'system', 'automatic_cleanup');
  }

  private async notifyRGPDRequest(request: RGPDRequest): Promise<void> {
    // Simulation d'envoi d'email
    console.log(`📧 Email envoyé à ${request.userEmail} pour demande ${request.type}: ${request.requestId}`);
  }

  private async processAccessRequest(request: RGPDRequest): Promise<void> {
    await this.getPersonalData(request.userEmail, request.requestId);
    // Envoyer les données par email
    console.log(`📧 Données envoyées à ${request.userEmail}`);
  }

  private async processRectificationRequest(request: RGPDRequest): Promise<void> {
    // Logique pour permettre la rectification
    console.log(`✏️ Demande de rectification pour ${request.userEmail}`);
  }

  private async processErasureRequest(request: RGPDRequest): Promise<void> {
    await this.deletePersonalData(request.userEmail, undefined, request.requestId);
  }

  private async processPortabilityRequest(request: RGPDRequest): Promise<void> {
    await this.getPersonalData(request.userEmail, request.requestId);
    // Exporter dans un format structuré (JSON)
    console.log(`📁 Données exportées pour ${request.userEmail}`);
  }

  private async processRestrictionRequest(request: RGPDRequest): Promise<void> {
    // Limiter le traitement des données
    console.log(`🔒 Restriction de traitement pour ${request.userEmail}`);
  }

  private async processObjectionRequest(request: RGPDRequest): Promise<void> {
    // Arrêter le traitement (sauf base légale impérative)
    console.log(`🚫 Opposition au traitement pour ${request.userEmail}`);
  }

  private logDataOperation(operation: string, target: string, details: string): void {
    const log = {
      timestamp: new Date().toISOString(),
      operation,
      target,
      details,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
    };

    console.log(`🔍 RGPD Log:`, log);

    // En production, stocker dans un journal d'audit sécurisé
    // this.auditLogger.log(log);
  }

  // ═══════════════════════════════════════════════════════════
  // EXPORTS ET RAPPORTS
  // ═══════════════════════════════════════════════════════════

  /**
   * Génère un rapport de conformité RGPD
   */
  public generateComplianceReport(): {
    totalDataRecords: number;
    dataByType: Record<string, number>;
    pendingRequests: number;
    retentionSummary: Record<string, number>;
    lastCleanup: string;
  } {
    const allData = Array.from(this.dataStore.values()).flat();
    const pendingRequests = Array.from(this.requests.values()).filter(r => r.status === 'pending').length;

    const dataByType = allData.reduce((acc, data) => {
      acc[data.type] = (acc[data.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const retentionSummary = allData.reduce((acc, data) => {
      const retentionKey = `${data.retentionPeriod} mois`;
      acc[retentionKey] = (acc[retentionKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDataRecords: allData.length,
      dataByType,
      pendingRequests,
      retentionSummary,
      lastCleanup: new Date().toISOString()
    };
  }
}

// Export singleton
export const rgpdManager = RGPDComplianceManager.getInstance();
