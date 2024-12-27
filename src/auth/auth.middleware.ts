import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const excludedRoutes = [
      { path: "/auth/login", method: "POST" },
      { path: "/auth/register", method: "POST" },
    ];

    // Vérifie si la route actuelle est exclue
    const isExcluded = excludedRoutes.some(
      (route) => req.originalUrl.startsWith(route.path) && req.method === route.method,
    );

    if (isExcluded) {
      return next(); // Autorise l'accès sans vérification
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "default_secret",
      });
      req.user = payload; // Injecte les informations utilisateur dans la requête
      next();
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}