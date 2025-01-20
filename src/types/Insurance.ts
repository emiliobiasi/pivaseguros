export interface InsuranceRule {
  company: string
  rules: {
    type: string
    documentType: string
  }[]
}

export interface UploadedFile {
  id: string
  name: string
  type: string
  insuranceCompany: string
  status: 'success' | 'error'
}

export interface RealEstate {
  id: string;
  name: string;
}

