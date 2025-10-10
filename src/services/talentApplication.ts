// Talent Application API Service
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backend-isadora.onrender.com' 
  : 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getAuthHeadersForFormData = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

// File Upload API
export const uploadMediaKit = async (files: File[]): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('mediaKit', file);
  });

  const response = await fetch(`${API_BASE_URL}/api/upload/media-kit`, {
    method: 'POST',
    body: formData,
    headers: getAuthHeadersForFormData()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload photos');
  }

  return response.json();
};

// Talent Application APIs
export interface TalentApplicationData {
  // Personal Information
  fullName: string;
  email: string;
  birthYear: number;
  city: string;
  nickname?: string;
  phone: string;
  bio?: string;
  
  // Photos
  mediaKitUrls: string[];
  
  // Social Information
  socialChannels: string[];
  socialLinks: string;
  contentCategories: string[];
  
  // Availability
  availableForProducts: string;
  shippingAddress?: string;
  availableForReels: string;
  availableNext3Months: string;
  availabilityPeriod?: string;
  
  // Experience
  collaboratedAgencies: string;
  agenciesList?: string;
  collaboratedBrands: string;
  brandsList?: string;
  
  // Fiscal Information
  hasVAT: string;
  paymentMethod: string[];
  termsAccepted: boolean;
}

export interface TalentApplication extends TalentApplicationData {
  id: string;
  userId: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  user?: {
    name: string;
    email: string;
    createdAt: string;
  };
}

export const submitTalentApplication = async (data: TalentApplicationData): Promise<TalentApplication> => {
  const response = await fetch(`${API_BASE_URL}/api/talent/applications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit application');
  }

  return response.json();
};

export const getTalentApplications = async (): Promise<{ applications: TalentApplication[] }> => {
  const response = await fetch(`${API_BASE_URL}/api/talent/applications`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }

  return response.json();
};

export const getMyTalentApplication = async (): Promise<TalentApplication | null> => {
  const response = await fetch(`${API_BASE_URL}/api/talent/applications/me`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // User hasn't applied yet
    }
    throw new Error('Failed to fetch my application');
  }

  return response.json();
};

export const getTalentApplication = async (id: string): Promise<TalentApplication> => {
  const response = await fetch(`${API_BASE_URL}/api/talent/applications/${id}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch application');
  }

  return response.json();
};

export const updateTalentApplicationStatus = async (
  id: string, 
  status: 'verified' | 'rejected', 
  notes?: string
): Promise<{ application: TalentApplication }> => {
  const response = await fetch(`${API_BASE_URL}/api/talent/applications/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, notes })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update application status');
  }

  return response.json();
};

export const deleteTalentApplication = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/talent/applications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete application');
  }
};

export const getTalentStats = async (): Promise<{
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}> => {
  const response = await fetch(`${API_BASE_URL}/api/talent/stats`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch talent statistics');
  }

  return response.json();
};

// Complete flow function
export const submitCompleteTalentApplication = async (
  formData: TalentApplicationData,
  files: File[]
): Promise<TalentApplication> => {
  // Step 1: Upload photos first (if any)
  let mediaKitUrls: string[] = [];
  if (files.length > 0) {
    const uploadResult = await uploadMediaKit(files);
    mediaKitUrls = uploadResult.urls;
  }

  // Step 2: Submit complete application with photo URLs
  const applicationData = {
    ...formData,
    mediaKitUrls
  };

  return submitTalentApplication(applicationData);
};
