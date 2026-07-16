export type RegistrationStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface StudentRegistration {
  id:                string;
  registration_id:   string;
  training_id:       string;
  full_name:         string;
  mobile:            string;
  email:             string;
  city:              string;
  state:             string;
  company:           string | null;
  designation:       string | null;
  experience:        string;
  industry:          string;
  gender:            string;
  date_of_birth:     string | null;
  emergency_contact: string | null;
  address:           string | null;
  status:            RegistrationStatus;
  notes:             string | null;
  registered_at:     string;
  created_at:        string;
  updated_at:        string;
  // joined
  training_title?:   string;
  training_start?:   string;
  training_mode?:    string;
}

export interface RegistrationFormData {
  training_id:       string;
  full_name:         string;
  mobile:            string;
  email:             string;
  city:              string;
  state:             string;
  company:           string;
  designation:       string;
  experience:        string;
  industry:          string;
  gender:            string;
  date_of_birth:     string;
  emergency_contact: string;
  address:           string;
}

export const EMPTY_REG_FORM: RegistrationFormData = {
  training_id:       '',
  full_name:         '',
  mobile:            '',
  email:             '',
  city:              '',
  state:             '',
  company:           '',
  designation:       '',
  experience:        '',
  industry:          '',
  gender:            '',
  date_of_birth:     '',
  emergency_contact: '',
  address:           '',
};

export const STATUS_BADGE: Record<RegistrationStatus, { color: string; bg: string; border: string }> = {
  Pending:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)' },
  Confirmed: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)' },
  Cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
};

export const EXPERIENCE_OPTIONS = [
  'Fresher (0 years)', '0–1 years', '1–2 years', '2–5 years', '5–10 years', '10+ years',
];

export const INDUSTRY_OPTIONS = [
  'Real Estate', 'Banking & Finance', 'Sales & Marketing', 'IT & Technology',
  'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Hospitality', 'Consulting', 'Other',
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export function validateRegistrationForm(form: RegistrationFormData): string | null {
  if (!form.training_id)                             return 'Please select a training.';
  if (!form.full_name.trim())                        return 'Full name is required.';
  if (!form.mobile.trim())                           return 'Mobile number is required.';
  if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))     return 'Enter a valid 10-digit Indian mobile number.';
  if (!form.email.trim())                            return 'Email address is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email address.';
  if (!form.city.trim())                             return 'City is required.';
  if (!form.state)                                   return 'State is required.';
  if (!form.experience)                              return 'Experience is required.';
  if (!form.industry)                                return 'Industry is required.';
  if (!form.gender)                                  return 'Gender is required.';
  return null;
}
