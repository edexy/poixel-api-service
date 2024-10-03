import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ClassConstructor, ClassTransformOptions } from 'class-transformer';
import {
  RESPONSE_SERIALIZER_KEY,
  RESPONSE_SERIALIZER_OPTIONS_KEY,
} from './response.constant';

export const SerializeResponse = <T>(
  serializer: ClassConstructor<T>,
  options?: ClassTransformOptions,
): MethodDecorator => {
  return applyDecorators(
    SetMetadata(RESPONSE_SERIALIZER_KEY, serializer),
    SetMetadata(RESPONSE_SERIALIZER_OPTIONS_KEY, options),
  );
};
