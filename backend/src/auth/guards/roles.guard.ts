import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Ajuste o caminho conforme necessário
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../strategy/jtw-payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Permitir acesso se não houver roles definidas
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    const userRoles = user.role ? [user.role] : [];
    const hasRole = () =>
      requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole()) {
      throw new ForbiddenException('Acesso negado');
    }

    return true;
  }
}
