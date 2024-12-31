import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: {
    id: number; // Identifiant de l'utilisateur
    email: string; // Email de l'utilisateur
  };
}
