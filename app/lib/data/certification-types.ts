export interface CertificationType {
  id: string
  name: string
}

export const CERTIFICATION_TYPES: CertificationType[] = [
  { id: 'organic', name: 'Organic Certification' },
  { id: 'globalgap', name: 'GlobalGAP' },
  { id: 'fairtrade', name: 'Fair Trade' },
  { id: 'rainforest', name: 'Rainforest Alliance' },
  { id: 'haccp', name: 'HACCP' },
  { id: 'iso22000', name: 'ISO 22000' },
  { id: 'nafdac', name: 'NAFDAC' },
  { id: 'son', name: 'SON (Standards Organisation of Nigeria)' },
  { id: 'usda_organic', name: 'USDA Organic' },
  { id: 'eu_organic', name: 'EU Organic' },
  { id: 'safa', name: 'SAFA Sustainability' },
  { id: 'other', name: 'Other' },
]
