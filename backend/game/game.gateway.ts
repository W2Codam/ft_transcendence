import { Inject, Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";
import { JwtGuard } from "auth/Guard";
import { PrismaService } from "prisma/prisma.service";
import { GameService } from "./game.service";


const prisma = new PrismaClient()
const gameHandler = new GameService()

// do not set origin to *, is unsafe
// use localhost domain to connect to BreadPong instead of IP addresses.
@WebSocketGateway({ cors: { origin: "http://localhost:5173", credentials: false } })
export class GameGateway {

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	@Inject(GameService)
	private readonly gameService: GameService;

	@WebSocketServer()
	server;

	private readonly logger = new Logger("game");


	@UseGuards(JwtGuard)
	@SubscribeMessage('joinQueue')
	async joinQueue(@MessageBody() data: Object, @ConnectedSocket() socket: Socket) {
		const status = this.gameService.joinQueue(data["user"].intraName, socket.id)
		if (status)
			console.log(`${data["user"].intraName} joined the queue`);
		else
			console.log(`${data["user"].intraName} could not join the queue`);
		return { status: status }
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage('leaveQueue')
	async leaveQueue(@MessageBody() data: Object) {
		const status = this.gameService.leaveQueue(data["user"].intraName)
		if (status)
			console.log(`${data["user"].intraName} left the queue`);
		else
			console.log(`${data["user"].intraName} could not leave the queue`);
		return { status: status }
	}


	@UseGuards(JwtGuard)
	@SubscribeMessage('finishGame')
	async finishGame() {

	}
}
