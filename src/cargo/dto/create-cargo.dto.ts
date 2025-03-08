import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateCargoDto {
  @IsNotEmpty({ message: 'Номер груза не может быть пустым' })
  @IsString({ message: 'Номер груза должен быть строкой' })
  cargoNumber: string;

  @IsNotEmpty({ message: 'Дата не может быть пустой' })
  @IsDateString({}, { message: 'Неверный формат даты' })
  date: string;

  @IsNotEmpty({ message: 'Информация о перевозке не может быть пустой' })
  @IsString({ message: 'Информация о перевозке должна быть строкой' })
  transportationInfo: string;

  @IsNotEmpty({ message: 'Сумма выплаты не может быть пустой' })
  @IsNumber({}, { message: 'Сумма выплаты должна быть числом' })
  payoutAmount: number;

  @IsNotEmpty({ message: 'Сроки выплаты не могут быть пустыми' })
  @IsString({ message: 'Сроки выплаты должны быть строкой' })
  payoutTerms: string;
}
