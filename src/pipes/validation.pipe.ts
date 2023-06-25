import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
		const obj = plainToClass(metadata.metatype, value);
		const errors = await validate(obj);

		if (errors.length) {
			console.log(errors);
			// [
			//   ValidationError {
			//     target: CreateUserDto { email: 'kaka', password: 'qwe123' },
			//     value: 'kaka',
			//     property: 'email',
			//     children: [],
			//     constraints:
			//     {
			//       isEmail: 'Некорректный формат email',
			//       isString: 'Должно быть строкой'
			//     }
			//   }
			// ]
			const messages = errors.map((err) => {
				return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
			});
			throw new ValidationException(messages);
		}
		return value;
	}
}
