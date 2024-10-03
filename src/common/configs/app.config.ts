import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: 'Poixel API Service <-> ',
    description: 'Poixel API Service',
    globalPrefix: '/api',
    baseUrl: process.env.API_BASE_URL,
    version: {
      default: process.env.API_VERSION ?? '1',
      prefix: 'v',
    },
    timeout: {
      enable: true,
      duration: '300s',
    },
    auth: {
      subject: 'Poixel NEJEN API Service 1.0',
      issuer: 'Poixel',
      audience: 'Poixel',
      secret: process.env.JWT_SECRET,
    },
  }),
);
