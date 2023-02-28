import { CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify, decode } from "jsonwebtoken";
import { createLogger } from "../../utils/logger";
// import Axios from "axios";
import { Jwt } from "../../auth/jwt";
import { JwtPayload } from "../../auth/JwtPayload";
import * as JwksRsa from 'jwks-rsa'

const logger = createLogger("auth");

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl =
  "https://dev-7831a6x3zyej01n8.us.auth0.com/.well-known/jwks.json";

// const hkk = ` 
// -----BEGIN CERTIFICATE-----
// MIIDHTCCAgWgAwIBAgIJZApTp1c4NTLMMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
// BAMTIWRldi03ODMxYTZ4M3p5ZWowMW44LnVzLmF1dGgwLmNvbTAeFw0yMzAyMjEx
// MDIyMTNaFw0zNjEwMzAxMDIyMTNaMCwxKjAoBgNVBAMTIWRldi03ODMxYTZ4M3p5
// ZWowMW44LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// ggEBALlKZ4PZqbsPifuuMaYX7/LL8Hn3974UbubeBZj9rAMA9hEW9K04793Bqtqr
// YYDVMkQFPy08gtlM1AMaV3iPuzTUyKJz1j7DSyWfubNmgL4OAuRqoU3+ko8ob9Yv
// LZmSbg4oJbeU/stebJXcJ1CMVZBc4Ayo+3M1ZbFy4stpldioDt+rb1SDmvhGIdnP
// n8DUE0mtWiEdtiQYkoVc8tgK+WU7SU4cXADvnaOnLgIvoT064Q0mFktGmGWG+Wpt
// QmIMsEPDYi8M39Is4Voi6y/1AbtRXX5Qo30fylLocs/CuhG88EAsol0zaoaVu+5m
// ZeuyvhYLjFsBrmQjuEcVLizLZGkCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
// BgNVHQ4EFgQUvxIOopxi0u0HnDdZVlOPEVNXfWcwDgYDVR0PAQH/BAQDAgKEMA0G
// CSqGSIb3DQEBCwUAA4IBAQCR35Ec48rDnF6qvXs6Q+6QAG0qOvDj3XdKz3b2lkRW
// bLU5GAw9h3ZgOMVhUyF93Vql+/RpPraM/IyYF9HjG72mggnFdARwXrvL34GPupWi
// Uf109rJeGDeyF+zdn05bRuzMLSoqGFhItFzYFQEI9rHkajpYOzUkCbNtVjgdZZTH
// a+MnS962LB2ccZ3dhdy4EDJAlKt3iwMHQe9TjOn0UHV8fvZyRzEM5bEz7vV3Ds9g
// voy0eoObrK+jR5RTMVQatk960KuLiGRGBKbFGGITz7sHB/LEepaKgH03zmI6AFVN
// m47sjO3dmMHi0s3Uaht0CCpracjWH6e57OQ1v9xuyCeW
// -----END CERTIFICATE-----
// `

  const jwksClient = JwksRsa({
    jwksUri:jwksUrl
  });

export const handler = async (
  event: any
): Promise<CustomAuthorizerResult> => {
  logger.info("Authorizing a user", event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info("User was authorized", jwtToken);

    return {
      principalId: 'user',
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    logger.error("User not authorized", { error: e.message });

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  const signingKey = await jwksClient.getSigningKey(jwt.header.kid);

  return verify(token, signingKey.getPublicKey(), { algorithms: ["RS256"] }) as JwtPayload;
  // if(token !== '1234') {
  //   throw new Error("Invalid authentication header")
  // }

  // return 'authorized'
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}
