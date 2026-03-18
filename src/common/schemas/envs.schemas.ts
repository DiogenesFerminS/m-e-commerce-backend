import Joi from 'joi';

export const envsSchema = Joi.object({
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASS: Joi.string().required(),
  POSTGRES_NAME: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().default(8080),
});

export interface Envs {
  POSTGRES_USER: string;
  POSTGRES_PASS: string;
  POSTGRES_NAME: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
}
