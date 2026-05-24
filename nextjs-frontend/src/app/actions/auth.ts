"use server";

import { redirect } from "next/navigation";
import { FormState, Credentials } from "../lib/definitions";
import {
  signUpRequest,
  confirmEmailRequest,
  signInRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  changePasswordRequest,
} from "../lib/requests";
import { createSession, deleteSession } from "../lib/session";

export async function signupAction(
  initialState: FormState,
  formData: FormData
): Promise<FormState> {
  // Convert formData into an object to extract data
  const name = formData.get("name");
  const surname = formData.get("surname");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const errors: Credentials = {};

  // Validate the form data
  if (!name) errors.name = "E' richiesto il tuo nome"
  if (!surname) errors.surname = "E' richiesto il tuo cognome"
  if (!username) errors.username = "E' richiesto il tuo username";
  if (!email) errors.email = "Serve una mail per comunicare con te!";
  if (!password) errors.password = "E' richiesta una password";
  if (!confirmPassword) errors.confirmPassword = "E' richiesta la conferma della password";
  if (password && confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = "Le password inserite non combaciano";
  }

  // Check if there are any errors
  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { username, email, password, confirmPassword } as Credentials,
      message: "Error submitting form",
      success: false,
    };
  }

  // Call backend API
  const res: any = await signUpRequest({
    name,
    surname,
    username,
    email,
    password,
  } as Credentials);

  // Check for errors in the response
  if (res.statusText !== "OK") {
    return {
      errors: {} as Credentials,
      values: { name, surname, username, email, password, confirmPassword } as Credentials,
      message: res?.statusText || res,
      success: false,
    };
  }

  // redirect to confirm email
  redirect("/auth/confirm-email?email=" + email);
}

export async function resendConfirmEmailAction(
  initialState: FormState,
  formData: FormData
) {
  // Extract email from formData
  const email = formData.get("email");

  // Validate the email
  if (!email) {
    return {
      values: { email } as Credentials,
      message: "Email not found",
      success: false,
    };
  }

  // invoke the resend email function
  const res = await confirmEmailRequest(email as string);

  // Check for errors in the response
  if (res.statusText !== "OK") {
    return {
      errors: {} as Credentials,
      values: { email } as Credentials,
      message: res?.statusText || res,
      success: false,
    };
  }

  return {
    values: { email } as Credentials,
    message: "Confirmation email sent",
    success: true,
  };
}

// Logout action
export async function logoutAction() {
  await deleteSession();
  redirect("/");
}
// Logout action
export async function profileAction() {
  await deleteSession();
  redirect("/");
}

export async function forgotPasswordAction(
  initialState: FormState,
  formData: FormData
): Promise<FormState> {
  // Get email from form data
  const email = formData.get("email");

  const errors: Credentials = {};

  // Validate the form data
  if (!email) errors.email = "Email is required";
  if (errors.email) {
    return {
      errors,
      values: { email } as Credentials,
      message: "Error submitting form",
      success: false,
    };
  }

  // Reqest password reset link
  const res: any = await forgotPasswordRequest(email as string);

  if (res.statusText !== "OK") {
    return {
      errors: {} as Credentials,
      values: { email } as Credentials,
      message: res?.statusText || res,
      success: false,
    };
  }

  return {
    errors: {} as Credentials,
    values: { email } as Credentials,
    message: "Password reset email sent",
    success: true,
  };
}

export async function resetPasswordAction(
  initialState: FormState,
  formData: FormData
): Promise<FormState> {
  const password = formData.get("password"); // password
  const code = formData.get("code"); // code
  const confirmPassword = formData.get("confirmPassword"); // confirm password

  const errors: Credentials = {};

  if (!password) errors.password = "Password is required";
  if (!confirmPassword) errors.confirmPassword = "Confirm password is required";
  if (!code) errors.code = "Error resetting password";
  if (password && confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { password, confirmPassword, code } as Credentials,
      message: "Error submitting form",
      success: false,
    };
  }

  // Call backend API
  const res: any = await resetPasswordRequest({
    code,
    password,
    confirmPassword,
  } as Credentials);

  if (res?.statusText !== "OK") {
    return {
      errors: {} as Credentials,
      values: { password, confirmPassword, code } as Credentials,
      message: res?.statusText || res,
      success: false,
    };
  }

  return {
    errors: {} as Credentials,
    values: {} as Credentials,
    message: "Reset password successful!",
    success: true,
  };
}

export async function changePasswordAction(
  initialState: FormState,
  formData: FormData
): Promise<FormState> {
  // Convert formData into an object to extract data
  const password = formData.get("password");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  const errors: Credentials = {};

  if (!password) errors.password = "Current Password is required";
  if (!confirmPassword) errors.confirmPassword = "Confirm password is required";
  if (!newPassword) errors.newPassword = "New password is required";
  if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { password, confirmPassword, newPassword } as Credentials,
      message: "Error submitting form",
      success: false,
    };
  }

  // Call backend API
  const res: any = await changePasswordRequest({
    password,
    newPassword,
    confirmPassword,
  } as Credentials);

  if (res?.statusText !== "OK") {
    return {
      errors: {} as Credentials,
      values: { password, confirmPassword, newPassword } as Credentials,
      message: res?.statusText || res,
      success: false,
    };
  }

  return {
    errors: {} as Credentials,
    values: {} as Credentials,
    message: "Reset password successful!",
    success: true,
  };


}

export async function signinAction(
  initialState: FormState,
  formData: FormData
): Promise<FormState> {
  // Convert formData into an object to extract data
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  const errors: Credentials = {};

  if (!identifier) errors.identifier = "Username or email is required";
  if (!password) errors.password = "Password is required";

  if (errors.password || errors.identifier) {
    return {
      errors,
      values: { identifier, password } as Credentials,
      message: "Error submitting form",
      success: false,
    };
  }

  // 1. Call backend API (Primo step: ottiene JWT e dati base)
  const res: any = await signInRequest({
    identifier,
    password,
  } as Credentials);

  if (res.statusText !== "OK") {
    return {
      errors: {} as Credentials,
      values: { identifier, password } as Credentials,
      message: res?.statusText || res,
      success: false,
    };
  }

  // --- INIZIO NUOVA LOGICA PER IL RUOLO ---
  const jwt = res.data.jwt;

  try {
    console.log("=== 1. CHIAMO STRAPI PER IL RUOLO ===");
    const userResponse = await fetch("http://127.0.0.1:1337/api/users/me?populate=role", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const userData = await userResponse.json();
    
    // QUESTO È IL LOG FONDAMENTALE
    console.log("=== 2. RISPOSTA GREZZA DA STRAPI ===");
    console.log(JSON.stringify(userData, null, 2));

    if (userResponse.ok) {
      // Se Strapi non manda il ruolo, forziamo una stringa di avviso per capirlo
      const userRole = userData.role?.name || "RUOLO_MANCANTE_DA_STRAPI";

      res.data = {
        jwt: jwt,
        user: {   // lui mi permette di fare user.name e non una barcata di passaggi
          ...res.data.user, 
          role: userRole,   
          nome: userData.name,       
          cognome: userData.surname, 
        }
      };
    } else {
      console.log("=== ERRORE HTTP STRAPI ===", userResponse.status);
    }
  } catch (error) {
    console.error("Errore nel recupero del ruolo da Strapi:", error);
  }

  // create session for user
  await createSession(res.data);
  redirect("/first");
}