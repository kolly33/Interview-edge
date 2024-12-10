// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('AUTH0_CLIENT_SECRET'),
//       audience: configService.get<string>('AUTH0_AUDIENCE'),// Add this to your .env file
//       issuer: `https://${configService.get<string>('AUTH0_DOMAIN')}/`, // Auth0 Domain
//     });
//   }

//   async validate(payload: any) {
//     // This data will be available in the request object (req.user)
//     return { userId: payload.sub, email: payload.email };
//   }
// }




import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(private configService: ConfigService) {
    super({
      domain:configService.get<string>('AUTH0_DOMAIN'), 
      clientID: configService.get<string>('CLIENT_ID'),
      clientSecret:configService.get<string>('AUTH0_CLIENT_SECRET'),
      callbackURL: configService.get<string>('AUTH0_CALLBACK_URL'),
      state: false,
    });
  }

  validate(accessToken: string, refreshToken: string, extraParams: any, profile: any) {
    // Optionally process user profile here
    return profile;
  }
}

