/**
 * Signup form data structure
 */
export interface SignupFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  province: string;
  email: string;
  password: string;
  confirmPassword: string;
  partnerContact?: boolean;
}

