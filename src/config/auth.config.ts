import { MS_CLIENT_ID, MS_TENANT_ID } from "./env.config";
import { BearerStrategy, ITokenPayload } from 'passport-azure-ad';

export const bearerStrategy = new BearerStrategy({
    identityMetadata: `https://login.microsoftonline.com/${MS_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    issuer: `https://login.microsoftonline.com/${MS_TENANT_ID}}/v2.0`,
    clientID: MS_CLIENT_ID,
    audience: MS_CLIENT_ID, 
    validateIssuer: false,
    
    passReqToCallback: true,
    // loggingLevel: "info",
    loggingNoPII: true
  }, (req, token: ITokenPayload, done: Function) => {
      if (!token.hasOwnProperty('scp') && !token.hasOwnProperty('roles')) {
        return done(new Error('Unauthorized'), null, "No delegated or app permission claims found");
      }
    return done(null, {}, token);
  });