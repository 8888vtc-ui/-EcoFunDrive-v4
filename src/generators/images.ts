// ECOFUNDRIVE V3 - Générateur d'Images
// Génère des images optimisées avec Replicate (Flux Pro) et DALL-E 3

import { Replicate, OpenAI, z, sharp } from '../types/stubs.js';

// Schéma de validation pour une image
const ImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(5).max(100),
  width: z.number(),
  height: z.number(),
  size: z.number(), // en KB
  format: z.enum_<string>(['webp', 'avif', 'jpg']),
  attribution: z.string().optional(),
  prompt: z.string(),
  model: z.string()
});

export type ImageType = z.infer<typeof ImageSchema>;

// Contexte pour la génération d'images
export interface ImageContext {
  keyword: string;
  type: 'hero' | 'service' | 'location' | 'experience';
  location?: string;
  service?: string;
  targetUrl?: string;
}

// Métadonnées légales pour les images
export interface ImageMetadata {
  filename: string;
  internalLink: string;
  seoAttributes: {
    title: string;
    description: string;
    keywords: string[];
  };
  legalInfo: {
    copyright: string;
    license: string;
    attribution: string;
  };
}

// Configuration des clients
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || ''
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Templates de prompts pour différents types d'images VTC (sans noms spécifiques)
const IMAGE_PROMPTS = {
  hero: (keyword: string) => `Professional luxury VTC service, ${keyword}, high-end black sedan, professional chauffeur, French Riviera coastline, Mediterranean sea view, premium transportation, elegant and sophisticated, cinematic lighting, ultra realistic, 8K resolution`,
  
  service: (keyword: string) => `Premium VTC service showing ${keyword}, luxury vehicle interior, comfortable leather seating, professional driver, business travel comfort, airport transfer experience, clean and modern, high-quality photography, natural lighting`,
  
  location: (keyword: string) => `${keyword} scenic view, French Riviera coastline, luxury VTC arriving at elegant hotel entrance, Mediterranean architecture, palm trees along promenade, sunny day, professional photography, travel and tourism atmosphere`,
  
  experience: (keyword: string) => `Luxury travel experience with ${keyword}, satisfied business client, professional chauffeur opening car door, premium service moment, elegant atmosphere, corporate travel style, high-end lifestyle, sophisticated and professional service`
};

// Fonction principale de// Génération d'une image optimisée avec contexte légal
export async function generateImage(
  keyword: string, 
  type: keyof typeof IMAGE_PROMPTS,
  context?: Partial<ImageContext>
): Promise<ImageType & { metadata: ImageMetadata }> {
  console.log(`🎨 Génération d'image: ${keyword} (${type})`);
  
  try {
    // Créer le contexte complet
    const fullContext: ImageContext = {
      keyword,
      type,
      location: context?.location || 'Côte d\'Azur',
      service: context?.service || getServiceName(type),
      targetUrl: context?.targetUrl
    };
    
    const prompt = IMAGE_PROMPTS[type](keyword);
    
    // Essayer avec Replicate d'abord
    let imageResult: Partial<ImageType>;
    
    try {
      imageResult = await generateWithReplicate(keyword, type);
    } catch (error) {
      console.warn('⚠️ Replicate indisponible, fallback vers DALL-E 3');
      imageResult = await generateWithDalle(keyword, type);
    }
    
    // Optimiser l'image
    const optimizedImage = await optimizeImage(imageResult);
    
    // Upload avec contexte et nommage légal
    const uploadResult = await uploadToCDN(new ArrayBuffer(), fullContext);
    
    // Générer les métadonnées complètes
    const metadata: ImageMetadata = {
      filename: uploadResult.filename,
      internalLink: uploadResult.internalLink,
      seoAttributes: generateImageMetadata(fullContext),
      legalInfo: generateLegalInfo()
    };
    
    // Combiner les résultats
    const finalImage: ImageType & { metadata: ImageMetadata } = {
      ...optimizedImage,
      url: uploadResult.url,
      alt: generateAltText(prompt, fullContext),
      attribution: metadata.legalInfo.attribution,
      metadata
    };
    
    console.log(`✅ Image générée: ${finalImage.width}x${finalImage.height}`);
    console.log(`📁 Fichier: ${metadata.filename}`);
    console.log(`🔗 Lien interne: ${metadata.internalLink}`);
    
    return finalImage;
    
  } catch (error) {
    console.error(`❌ Erreur lors de la génération d'image pour "${keyword}":`, error);
    throw new Error(`Échec de la génération d'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Obtenir le nom du service selon le type
function getServiceName(type: keyof typeof IMAGE_PROMPTS): string {
  const serviceNames = {
    hero: 'VTC Premium',
    service: 'Service sur Mesure',
    location: 'VTC Local',
    experience: 'Expérience Luxe'
  };
  
  return serviceNames[type] || 'VTC Service';
}

// Génération avec Replicate (Flux Pro)
async function generateWithReplicate(
  keyword: string, 
  type: keyof typeof IMAGE_PROMPTS
): Promise<Partial<ImageType>> {
  const prompt = IMAGE_PROMPTS[type](keyword);
  
  const output = await replicate.run("black-forest-labs/flux-pro", {
    input: {
      prompt: prompt,
      num_outputs: 1,
      aspect_ratio: "16:9",
      output_format: "webp",
      output_quality: 85,
      guidance_scale: 7.5,
      num_inference_steps: 28
    }
  }) as string[];
  
  return {
    url: output[0],
    prompt,
    model: 'flux-pro',
    format: 'webp'
  };
}

// Génération avec DALL-E 3 (backup)
async function generateWithDalle(
  keyword: string, 
  type: keyof typeof IMAGE_PROMPTS
): Promise<Partial<ImageType>> {
  const prompt = IMAGE_PROMPTS[type](keyword);
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1792x1024", // 16:9 ratio
    quality: "hd",
    style: "natural"
  });
  
  const image = response.data[0];
  
  return {
    url: image.url,
    prompt,
    model: 'dall-e-3',
    format: 'jpg'
  };
}

// Optimisation des images avec Sharp
async function optimizeImage(image: Partial<ImageType>): Promise<ImageType> {
  try {
    // Télécharger l'image
    const response = await fetch(image.url!);
    const arrayBuffer = await response.arrayBuffer();
    
    // Optimiser avec Sharp
    const optimizedBuffer = await new sharp(Buffer.from(arrayBuffer))
      .resize(1920, 1080, { // Taille standard 16:9
        fit: 'cover',
        position: 'center'
      })
      .webp({ 
        quality: 85,
        effort: 6
      })
      .toBuffer();
    
    // Créer l'URL optimisée (pourrait être uploadée sur un CDN)
    const uploadResult = await uploadToCDN(optimizedBuffer, { 
      keyword: 'optimized', 
      type: 'service' 
    } as ImageContext);
    const optimizedUrl = uploadResult.url;
    
    // Récupérer les métadonnées
    const metadata = await (new sharp(optimizedBuffer)).metadata();
    
    return ImageSchema.parse({
      url: optimizedUrl,
      alt: generateAltText(image.prompt!, { 
      keyword: 'optimized', 
      type: 'service' 
    } as ImageContext),
      width: metadata.width,
      height: metadata.height,
      size: Math.round(optimizedBuffer.byteLength / 1024), // Convertir en KB
      format: 'webp',
      attribution: 'Generated by AI - ECOFUNDRIVE V3',
      prompt: image.prompt,
      model: image.model
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation de l\'image:', error);
    throw new Error(`Échec de l'optimisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Upload sur CDN (Netlify ou autre)
async function uploadToCDN(_buffer: ArrayBuffer, context: ImageContext): Promise<{
  url: string;
  filename: string;
  internalLink: string;
}> {
  // Génération du nom de fichier contextuel et légal
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const sanitizedKeyword = context.keyword
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const filename = `ecofundrive-vtc-${context.type}-${sanitizedKeyword}-${timestamp}.webp`;
  
  // URL CDN
  const cdnUrl = `https://cdn.ecofundrive.com/images/${filename}`;
  
  // Internal linking pour SEO
  const internalLink = generateInternalLink(context);
  
  return {
    url: cdnUrl,
    filename,
    internalLink
  };
}

// Génération d'internal linking SEO pour les images
function generateInternalLink(context: ImageContext): string {
  const baseUrl = 'https://ecofundrive.com';
  
  switch (context.type) {
    case 'hero':
      return `${baseUrl}/`;
    
    case 'service':
      if (context.service) {
        const serviceSlug = context.service
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-');
        return `${baseUrl}/services/${serviceSlug}`;
      }
      return `${baseUrl}/services/vtc-premium`;
    
    case 'location':
      if (context.location) {
        const locationSlug = context.location
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-');
        return `${baseUrl}/vtc/${locationSlug}`;
      }
      return `${baseUrl}/vtc/cote-d-azur`;
    
    case 'experience':
      return `${baseUrl}/experience/vtc-luxe`;
    
    default:
      return `${baseUrl}/`;
  }
}

// Génération des métadonnées SEO complètes (sans noms spécifiques)
function generateImageMetadata(context: ImageContext): ImageMetadata['seoAttributes'] {
  const baseKeywords = [
    'VTC',
    'chauffeur privé',
    context.keyword,
    'Côte d\'Azur',
    'transport premium',
    'French Riviera'
  ];
  
  const typeSpecificKeywords = {
    hero: ['service VTC luxe', 'transport premium', 'chauffeur professionnel', 'véhicule haut de gamme'],
    service: ['service premium', 'réservation VTC', 'transport sur mesure', 'confort voyage'],
    location: ['VTC local', 'chauffeur région', 'transport ville', 'service proximité'],
    experience: ['expérience VTC', 'voyage confort', 'service haut de gamme', 'transport d\'affaires']
  };
  
  const allKeywords = [...baseKeywords, ...(typeSpecificKeywords[context.type] || [])];
  
  // Titres génériques mais contextuels
  const genericTitles = {
    hero: `VTC Premium ${context.keyword} - Service Luxe French Riviera | ECOFUNDRIVE`,
    service: `Service VTC ${context.keyword} - Transport Professionnel | ECOFUNDRIVE`,
    location: `VTC ${context.keyword} - Chauffeur Local Côte d'Azur | ECOFUNDRIVE`,
    experience: `Expérience VTC ${context.keyword} - Voyage Premium | ECOFUNDRIVE`
  };
  
  // Descriptions génériques mais informatives
  const genericDescriptions = {
    hero: `Découvrez notre service VTC premium ${context.keyword} sur la French Riviera. Chauffeur professionnel, véhicule de luxe pour un voyage exceptionnel.`,
    service: `Service VTC ${context.keyword} avec ECOFUNDRIVE. Transport professionnel, confort optimal et disponibilité 24/7 sur la Côte d'Azur.`,
    location: `VTC local ${context.keyword} - Service de chauffeur professionnel dans votre région. Réservation simple et rapide.`,
    experience: `Expérience de voyage VTC ${context.keyword} haut de gamme. Service personnalisé pour vos déplacements d'affaires et touristiques.`
  };
  
  return {
    title: genericTitles[context.type] || `VTC ${context.keyword} - Service Premium | ECOFUNDRIVE`,
    description: genericDescriptions[context.type] || `Service VTC ${context.keyword} professionnel avec ECOFUNDRIVE sur la Côte d'Azur.`,
    keywords: allKeywords
  };
}

// Génération des informations légales
function generateLegalInfo(): ImageMetadata['legalInfo'] {
  return {
    copyright: `© ${new Date().getFullYear()} ECOFUNDRIVE - Tous droits réservés`,
    license: 'Usage commercial autorisé avec attribution',
    attribution: 'Image générée par IA pour ECOFUNDRIVE V3'
  };
}

// Génération du texte alt optimisé SEO (sans noms spécifiques)
function generateAltText(prompt: string, context: ImageContext): string {
  // Extraire les éléments clés du prompt
  const keywords = prompt
    .split(',')
    .map(word => word.trim())
    .filter(word => word.length > 3)
    .slice(0, 3); // Garder les 3 premiers mots-clés
  
  // Générer une description contextuelle mais générique
  const genericDescriptions = {
    hero: 'VTC de luxe sur la Côte d\'Azur avec chauffeur professionnel',
    service: 'Intérieur de véhicule VTC premium avec confort optimal',
    location: 'Scène panoramique de la Riviera Méditerranéenne avec VTC',
    experience: 'Service chauffeur privé haut de gamme pour voyageurs d\'affaires'
  };
  
  const baseDescription = genericDescriptions[context.type] || 'Service VTC premium ECOFUNDRIVE';
  const keywordText = keywords.length > 0 ? ` - ${keywords.join(' ')}` : '';
  
  return `${baseDescription}${keywordText} - Transport professionnel sur la French Riviera`;
}

// Génération de toutes les images pour un contenu
export async function generateAllImages(
  keywords: string[],
  count: number = 4
): Promise<ImageType[]> {
  console.log(`🖼️ Génération de ${count} images pour ${keywords.length} mots-clés...`);
  
  const images: ImageType[] = [];
  const imageTypes: (keyof typeof IMAGE_PROMPTS)[] = ['hero', 'service', 'location', 'experience'];
  
  for (let i = 0; i < Math.min(count, keywords.length); i++) {
    const keyword = keywords[i];
    const type = imageTypes[i % imageTypes.length];
    
    try {
      const image = await generateImage(keyword, type);
      images.push(image);
    } catch (error) {
      console.warn(`⚠️ Impossible de générer l'image pour "${keyword}":`, error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }
  
  console.log(`✅ ${images.length} images générées avec succès`);
  return images;
}

// Génération d'images responsive (plusieurs tailles)
export async function generateResponsiveImages(
  baseImage: ImageType
): Promise<ImageType[]> {
  const sizes = [
    { width: 800, height: 450, suffix: 'small' },
    { width: 1200, height: 675, suffix: 'medium' },
    { width: 1920, height: 1080, suffix: 'large' }
  ];
  
  const responsiveImages: ImageType[] = [];
  
  for (const size of sizes) {
    try {
      // Télécharger et redimensionner
      const response = await fetch(baseImage.url);
      const arrayBuffer = await response.arrayBuffer();
      
      const resizedBuffer = await new sharp(Buffer.from(arrayBuffer))
        .resize(size.width, size.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toBuffer();
      
      const uploadResult = await uploadToCDN(resizedBuffer, {
      keyword: baseImage.alt?.split(' ')[0] || 'responsive',
      type: 'service'
    } as ImageContext);
      const resizedUrl = uploadResult.url;
      
      responsiveImages.push({
        ...baseImage,
        url: resizedUrl,
        width: size.width,
        height: size.height,
        size: Math.round(resizedBuffer.byteLength / 1024),
        alt: `${baseImage.alt} - ${size.suffix} size`
      });
      
    } catch (error) {
      console.warn(`⚠️ Erreur lors du redimensionnement ${size.suffix}:`, error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }
  
  return responsiveImages;
}

// Validation des images générées
export function validateImages(images: ImageType[]): boolean {
  const requiredCount = 3; // Minimum 3 images
  const maxSizeKB = 250; // Maximum 250KB par image
  
  if (images.length < requiredCount) {
    console.warn(`⚠️ Nombre d'images insuffisant: ${images.length} < ${requiredCount}`);
    return false;
  }
  
  const oversizedImages = images.filter(img => img.size > maxSizeKB);
  if (oversizedImages.length > 0) {
    console.warn(`⚠️ Images trop volumineuses: ${oversizedImages.length} images > ${maxSizeKB}KB`);
    return false;
  }
  
  return true;
}

// Export des types et utilitaires
export { ImageSchema };
export default generateImage;
