"use client";

import { useActionState } from "react";
import { signinAction } from "@/app/actions/auth";
import { FormState } from "@/app/lib/definitions";
import { toast } from "react-toastify";

import styles from "./login.module.css";

export default function SignIn() {
  const initialState: FormState = {
    errors: {},
    values: {},
    message: "",
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    signinAction,
    initialState
  );

  if (state.success) {
    toast.success(state.message, { position: "top-center" });
  }

  return (
    // 2. Devi usare styles["nome-classe"] invece delle stringhe classiche
    <div className={styles["login-wrapper"]}>
      <div className={styles["login-container"]}>
        <h2 className={styles["login-title"]}>Sign In</h2>

        <form action={formAction} className={styles["login-form"]}>
          {/* Per le classi multiple si usa la concatenazione stringhe o i template literal */}
          <p className={`${styles["error-message"]} ${styles["main-error"]}`}>
            {!state?.success && state?.message}
          </p>

          {/* Email */}
          <div className={styles["input-group"]}>
            <label className={styles["input-label"]}>Email</label>
            <input
              type="email"
              name="identifier"
              defaultValue={state?.values?.identifier}
              placeholder="Enter your email"
              className={styles["input-field"]}
            />
            {state?.errors.identifier && (
              <p className={styles["error-message"]}>{state?.errors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div className={styles["input-group"]}>
            <label className={styles["input-label"]}>Password</label>
            <input
              type="password"
              name="password"
              defaultValue={state?.values.password}
              placeholder="Enter your password"
              className={styles["input-field"]}
            />
            {state?.errors.password && (
              <p className={styles["error-message"]}>{state?.errors.password}</p>
            )}
            <div className={styles["forgot-password-container"]}>
              <a
                href="/auth/forgot-password"
                className={styles["text-link"]}
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className={styles["submit-button"]}
            disabled={isPending}
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className={styles["signup-prompt"]}>
          Don't have an account?{" "}
          <a href="/auth/signup" className={styles["text-link"]}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}