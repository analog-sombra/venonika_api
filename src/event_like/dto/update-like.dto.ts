import { PartialType } from '@nestjs/mapped-types';
import { CreateEventLikeDto } from './create-like.dto';

export class UpdateEventLikeDto extends PartialType(CreateEventLikeDto) {}
