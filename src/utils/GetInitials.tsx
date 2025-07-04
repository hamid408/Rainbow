
export const getInitials = (fullName: string | undefined | null): string => {
  if (!fullName || typeof fullName !== "string") return "U";

  const parts = fullName.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "U";

  if (parts.length === 1) {
    const word = parts[0];
    return (
      (word[0]?.toUpperCase() || "") +
      (word[word.length - 1]?.toUpperCase() || "")
    );
  }

  return (
    (parts[0][0]?.toUpperCase() || "") +
    (parts[parts.length - 1][0]?.toUpperCase() || "")
  );
};
