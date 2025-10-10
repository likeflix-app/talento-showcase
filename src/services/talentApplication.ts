// Talent Application API Service
import { talentEmailService } from './talentEmailService';
import { talentService } from './talent';

// Always use production backend for talent applications
const API_BASE_URL = 'https://backend-isadora.onrender.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('User not authenticated - please login first');
  }
  
  console.log('🔐 Using token:', token.substring(0, 20) + '...');
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const getAuthHeadersForFormData = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('User not authenticated - please login first');
  }
  
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

  const url = `${API_BASE_URL}/api/upload/media-kit`;
  const headers = getAuthHeadersForFormData();
  
  console.log('📤 Uploading files to:', url);
  console.log('📁 Files to upload:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
  console.log('🔐 Auth headers:', headers);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers
  });

  console.log('📡 Upload response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown upload error' }));
    console.error('❌ Upload failed:', errorData);
    throw new Error(errorData.message || 'Failed to upload photos');
  }

  const result = await response.json();
  console.log('✅ Files uploaded successfully:', result);
  return result;
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
  const url = `${API_BASE_URL}/api/talent/applications`;
  const headers = getAuthHeaders();
  
  console.log('🚀 Submitting talent application to:', url);
  console.log('📋 Application data:', data);
  console.log('🔐 Auth headers:', headers);
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });

  console.log('📡 Response status:', response.status);
  console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    // Handle authentication errors specifically
    if (response.status === 403) {
      console.error('❌ Authentication failed - token invalid or expired');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      throw new Error('Session expired. Please login again.');
    }
    
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    console.error('❌ Submission failed:', errorData);
    throw new Error(errorData.message || 'Failed to submit application');
  }

  const application = await response.json();
  console.log('✅ Application submitted successfully:', application);
  
  // Send confirmation email to user
  try {
    await talentEmailService.sendApplicationSubmittedEmail(application);
    console.log('✅ Application confirmation email sent');
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
  }
  
  // Send notification email to admin
  try {
    await talentEmailService.sendAdminNotificationEmail(application);
    console.log('✅ Admin notification email sent');
  } catch (error) {
    console.error('❌ Failed to send admin notification email:', error);
  }

  return application;
};

export const getTalentApplications = async (): Promise<{ applications: TalentApplication[] }> => {
  const response = await fetch(`${API_BASE_URL}/api/talent/applications`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    if (response.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      throw new Error('Session expired. Please login again.');
    }
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
    if (response.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      throw new Error('Session expired. Please login again.');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update application status');
  }

  const result = await response.json();
  
  // Send appropriate email based on status
  try {
    if (status === 'verified') {
      await talentEmailService.sendApplicationApprovedEmail(result.application);
      console.log('✅ Application approved email sent');
      
      // Automatically add approved talent to the talent list
      await addApprovedTalentToList(result.application);
      console.log('✅ Approved talent added to talent list');
    } else if (status === 'rejected') {
      await talentEmailService.sendApplicationRejectedEmail(result.application);
      console.log('✅ Application rejected email sent');
    }
  } catch (error) {
    console.error('❌ Failed to send status update email:', error);
  }

  return result;
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

// Convert approved talent application to talent
const addApprovedTalentToList = async (application: TalentApplication): Promise<void> => {
  try {
    // Map application categories to talent categories
    const categoryMapping: { [key: string]: string } = {
      'Fitness': 'Sport & Fitness',
      'Food': 'Alta Cucina',
      'Moda': 'Fashion & Style',
      'Benessere': 'Wellness & Yoga',
      'Tech': 'Digital Marketing',
      'Arte': 'Fashion & Style',
      'Beauty': 'Fashion & Style',
      'Comicità': 'Cinema & Regia',
      'Educazione': 'Business Strategy',
      'Gaming': 'Digital Marketing',
      'Genitorialità': 'Wellness & Yoga',
      'Lifestyle': 'Fashion & Style',
      'Medicina Estetica': 'Wellness & Yoga',
      'Musica': 'Cinema & Regia',
      'Viaggi': 'Fashion & Style'
    };

    // Get the first category and map it
    const primaryCategory = application.contentCategories[0] || 'Lifestyle';
    const mappedCategory = categoryMapping[primaryCategory] || 'Fashion & Style';

    // Use the first media kit photo as the talent image, or a default
    const talentImage = application.mediaKitUrls.length > 0 
      ? application.mediaKitUrls[0] 
      : '/src/assets/talent-default.jpg';

    // Create talent data from application
    const talentData = {
      name: application.fullName,
      category: mappedCategory,
      price: application.hasVAT === 'Si' ? '€200/h' : '€150/h', // Higher price if they have VAT
      image: talentImage,
      description: application.bio || `Talento specializzato in ${primaryCategory.toLowerCase()}. ${application.socialChannels.join(', ')} con esperienza in contenuti di qualità.`,
      rating: 4.5, // Default rating for new talents
      isActive: true,
    };

    // Add to talent list
    await talentService.createTalent(talentData);
    console.log(`✅ Talent ${application.fullName} added to talent list`);
  } catch (error) {
    console.error('❌ Failed to add approved talent to list:', error);
    // Don't throw error to avoid breaking the approval flow
  }
};

// Complete flow function
export const submitCompleteTalentApplication = async (
  formData: TalentApplicationData,
  files: File[]
): Promise<TalentApplication> => {
  // Step 1: Upload photos first (if any)
  let mediaKitUrls: string[] = [];
  if (files.length > 0) {
    try {
      const uploadResult = await uploadMediaKit(files);
      mediaKitUrls = uploadResult.urls;
      console.log('✅ Files uploaded successfully');
    } catch (error) {
      console.warn('⚠️ File upload failed, proceeding without files:', error);
      // Continue with empty mediaKitUrls if upload fails
      mediaKitUrls = [];
    }
  }

  // Step 2: Submit complete application with photo URLs
  const applicationData = {
    ...formData,
    mediaKitUrls
  };

  return submitTalentApplication(applicationData);
};
