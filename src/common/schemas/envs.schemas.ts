import Joi from 'joi';

export const envsSchema = Joi.object({
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASS: Joi.string().required(),
  POSTGRES_NAME: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().default(8080),
  API_URL: Joi.string(),
  BCRYPT_ROUND_OR_SALT: Joi.number(),
  JWT_SECRET: Joi.string(),
});

export interface Envs {
  POSTGRES_USER: string;
  POSTGRES_PASS: string;
  POSTGRES_NAME: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  API_URL: string;
  BCRYPT_ROUND_OR_SALT: number;
  JWT_SECRET: string;
}
