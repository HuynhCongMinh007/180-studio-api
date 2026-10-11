import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { PrismaService } from "@/database/prisma.service";
import { Account } from "../../domain/entities/auth.entity";
import { Token } from "../../domain/value-objects/token.vo";

@Injectable()
export class PrismaAuthRepository extends AuthRepository {
    private readonly _prisma: PrismaService

    private constructor(prisma: PrismaService) {
        super()
        this._prisma = prisma
    }
    async Login(account: Account): Promise<Token> {
        const email = this._prisma.user.
    }
}        