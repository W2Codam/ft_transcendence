import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MainGateway } from './main.gateway';
import { AppController } from './app.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TwoFactorAuthenticationModule } from 'auth/2fa.module';
import { GameModule } from 'game/game.module';

/*==========================================================================*/

@Module({
	imports: [
		PrismaModule,
		TwoFactorAuthenticationModule,
		GameModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'static')
		}),
	],
	controllers: [AppController],
	providers: [AppService, MainGateway],
})

/*==========================================================================*/

export class AppModule { }
