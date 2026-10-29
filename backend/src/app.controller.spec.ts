import { Test, TestingModule } from '@nestjs/testing';
import { AppController, maskCpf, maskRg } from './app.controller';
import { UsersService } from './users/users.service';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: UsersService, useValue: {} }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('ASSEC API');
    });
  });

  describe('public card validation (PII masking)', () => {
    it('masks CPF and RG on the server and never returns the raw values', async () => {
      const findById = jest.fn().mockResolvedValue({
        name: 'Fulano de Tal',
        cpf: '123.456.789-01',
        rg: '20081234567',
        matricula: '998877',
        org: 'PMCE',
        status: 'Ativo',
        since: new Date('2026-01-01'),
        photoUrl: null,
      });
      const app: TestingModule = await Test.createTestingModule({
        controllers: [AppController],
        providers: [
          AppService,
          { provide: UsersService, useValue: { findById } },
        ],
      }).compile();
      const controller = app.get<AppController>(AppController);

      const result = await controller.validateUser('uuid');

      expect(result.cpf).toBe('***.***.789-**');
      expect(result.rg).toBe('***.4567');
      expect(JSON.stringify(result)).not.toContain('123.456.789-01');
      expect(JSON.stringify(result)).not.toContain('20081234567');
    });

    it('maskCpf / maskRg handle null and malformed input', () => {
      expect(maskCpf(null)).toBeNull();
      expect(maskCpf('123')).toBe('***');
      expect(maskRg(null)).toBeNull();
      expect(maskRg('12')).toBe('***');
    });
  });
});
