export const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? [/^http:\/\/localhost:\d+$/]
      : ["https://nodepopexpress.duckdns.org/"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Custom-Header",
  ],
};
