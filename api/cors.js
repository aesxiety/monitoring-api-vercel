import cors from 'cors';

// Middleware CORS untuk handler Next.js / Vercel
export const runCors = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type']
    })(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return fn();
    });
  });
};
