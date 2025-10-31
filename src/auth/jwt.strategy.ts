import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        'c88fbd6afd1c6e7ace6305c48deb2ba2848ea2601f8e66da00ba72d9022087e9d759d0929ab6ee38527e6901a4ba19594254ff4b5afb05134edf2cd5057dfb46',
    });
  }
  async validate(payload:any){
    return {
        id:payload.sub,
        username : payload.username,
        role:payload.role
    }
  }
}