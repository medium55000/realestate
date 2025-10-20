import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';

dotenv.config();

const jwtCheck = auth({
  audience: process.env.AUTH_AUDIENCE,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH_TOKEN_SIGNING_ALG,
});

export default jwtCheck;
