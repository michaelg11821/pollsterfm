export const selfHostnameRegex =
  process.env.CONVEX_ENV === "production"
    ? /^pollsterfm\.vercel.app$/
    : /^localhost\:3000$/;
