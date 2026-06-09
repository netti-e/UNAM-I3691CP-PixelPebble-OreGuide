// [STATUS: NEW] — Forgot password flow: email entry → Firebase reset email → inline success confirmation
// app/(auth)/forgot-password.tsx

import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";
import { auth } from "../../services/firebase";
import { styles } from '../../styles/forgot-password.styles';

// ── Email validation helper ──────────────────────────────────────────────────
const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // ── Validate on blur ───────────────────────────────────────────────────────
  const handleBlur = () => {
    if (email.trim() && !isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // ── Submit reset request ───────────────────────────────────────────────────
  const handleSendReset = async () => {
    if (!email.trim()) {
      setEmailError("Email address is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      // Always show success — avoids user enumeration (don't reveal if email exists)
      setSubmitted(true);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };

      let message = "Something went wrong. Please try again.";
      if (firebaseError?.code === "auth/invalid-email") {
        message = "The email address is not valid.";
      } else if (firebaseError?.code === "auth/too-many-requests") {
        message = "Too many attempts. Please wait a moment and try again.";
      }

      Alert.alert("Reset Failed", message);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend handler (resets to entry state) ─────────────────────────────────
  const handleResend = async () => {
    setSubmitted(false);
    setEmail("");
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.successContainer}>
          <View style={styles.successIconWrapper}>
            <CheckCircle size={36} color={THEME.colors.secondary} />
          </View>

          <Text style={styles.successTitle}>CHECK YOUR{"\n"}INBOX</Text>

          <Text style={styles.successSubtitle}>
            We've sent a password reset link to{" "}
            <Text style={styles.successEmail}>{email.trim()}</Text>.{"\n\n"}
            If it doesn't arrive within a few minutes, check your spam folder.
          </Text>

          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => router.replace("/(auth)/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.returnButtonText}>Return to Login</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive it? </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Try a different email</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Image
          source={require("../../assets/images/background.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </KeyboardAvoidingView>
    );
  }

  // ── Entry State ────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Back navigation */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={THEME.colors.primary} />
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>

        <Text style={styles.title}>RESET{"\n"}PASSWORD</Text>

        <Text style={styles.subtitle}>
          Enter the email address linked to your account and we'll send you a
          reset link.
        </Text>

        <View style={styles.inputContainer}>
          <View
            style={[
              styles.inputWrapper,
              emailError ? styles.inputWrapperError : null,
            ]}
          >
            <Mail
              size={20}
              color={THEME.colors.textMuted}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={THEME.colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError("");
              }}
              onBlur={handleBlur}
              editable={!loading}
            />
          </View>

          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleSendReset}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={THEME.colors.surface} size="small" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={require("../../assets/images/background.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
    </KeyboardAvoidingView>
  );
}
