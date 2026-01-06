import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderService } from './order/order.service';
import { AuthGatewayControllerController } from './auth-gateway-controller/auth-gateway-controller.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthGatewayControllerController],
  providers: [AppService, OrderService],
})
export class AppModule {}
