"use client";
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Link, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomTextField from "@/src/components/common/CustomTextfield";
import CustomButton from "@/src/components/common/CustomButton";
import { useFirstLoginPasswordMutation } from "@/src/redux/services/auth/authApi";
import Cookies from "js-cookie";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Image from "next/image";
import Logo from "@/src/assests/images/newlogo.jpg";

const FirstLoginPassword = () => {
  const router = useRouter();
  const [session, setSession] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setMail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstLoginPassword] = useFirstLoginPasswordMutation();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);
  useEffect(() => {
    // const storedSession = sessionStorage.getItem("auth_session");
    // const storedEmail = sessionStorage.getItem("auth_email");
    const storedSession = Cookies.get("auth_session");
    const storedEmail = Cookies.get("auth_email");

    if (storedEmail) {
      // const storedEmail = sessionStorage.getItem("auth_email");

      setMail(storedEmail);
    }

    if (storedSession) {
      setSession(storedSession);
    } else {
      setError("Session is missing. Please sign in again.");
    }
  }, []);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!newPassword || !confirmPassword) {
  //     setError("Both password fields are required.");
  //     return;
  //   }

  //   if (newPassword !== confirmPassword) {
  //     setError("Passwords do not match.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const payload = {
  //       session,
  //       new_password: newPassword,
  //       email,
  //     };

  //     const response = await firstLoginPassword(payload).unwrap();

  //     Cookies.remove("auth_session");
  //     Cookies.set("id_token", response.id_token);
  //     Cookies.set("auth_email", email);
  //     router.push("/dashboard");
  //   } catch (err: any) {
  //     setError(err?.data?.message || "Failed to reset password.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        session,
        new_password: newPassword,
        email,
      };

      const response = await firstLoginPassword(payload).unwrap();

      // ✅ Only clear session + set tokens on success
      if (response?.id_token) {
        Cookies.remove("auth_session");
        Cookies.set("id_token", response.id_token);
        Cookies.set("auth_email", email);
        router.push("/dashboard");
      }
    } catch (err: any) {
      // ✅ Stay on same screen and show error
      setError(
        err?.data?.message || "Password must meet strength requirements."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        paddingBlock: 12,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          padding: 4,
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box>
          <Image
            src={Logo}
            alt="logo"
            style={{
              maxWidth: "470px",
              width: "100%",
              height: "auto",
              marginBottom: "48px",
            }}
          />
        </Box>
        <Typography variant="h5" align="center" mb={3.1} fontSize={28}>
          Create Your New Password
        </Typography>
        <Typography variant="body2" align="center" color="gray" mb={3}>
          Enter your new password below to secure your account.
        </Typography>

        <Stack gap={2}>
          <CustomTextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={newPassword}
            onChange={(e: any) => setNewPassword(e.target.value)}
            placeholder="Write new password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <CustomTextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
   

        {error && (
          <Typography variant="body2" color="error" align="center" mt={2}>
            {error}
          </Typography>
        )}

        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ padding: "12px", marginTop: 3 }}
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </CustomButton>

        {/* <Typography variant="body2" align="center" mt={4}>
          <Link href="/sign-in">Back to Sign In</Link>
        </Typography> */}
      </Box>
    </Container>
  );
};

export default FirstLoginPassword;
