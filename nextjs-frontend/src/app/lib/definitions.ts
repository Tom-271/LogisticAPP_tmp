// Credentials for authentication
export type Credentials = {
  username?: string;
  email?: string;
  identifier?: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
  newPassword?: string;
  code?: string;
  role?: string;
  name?: string;
  surname?: string;
  tipo_cliente?: string;
  Ragione_sociale?: string;
  Partita_IVA?: string;
  Codice_SDI?: string;
  PEC_Fatturazione?: string;
  Indirizzo_sede_legale?: string;
};

// Form state for form handling and server actions
export type FormState = {
  errors: Credentials;
  values: Credentials;
  message: string;
  success: boolean;
};

export type SessionPayload = {
  user?: any;
  expiresAt?: Date;
  jwt?: string;
  role?:string;
};
