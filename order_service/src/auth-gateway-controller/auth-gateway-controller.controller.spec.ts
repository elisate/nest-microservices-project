import { Test, TestingModule } from '@nestjs/testing';
import { AuthGatewayControllerController } from './auth-gateway-controller.controller';

describe('AuthGatewayControllerController', () => {
  let controller: AuthGatewayControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGatewayControllerController],
    }).compile();

    controller = module.get<AuthGatewayControllerController>(AuthGatewayControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
