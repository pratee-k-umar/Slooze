import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async findAll() {
    const paymentMethods = await this.paymentMethodRepository.find();

    return {
      success: true,
      data: paymentMethods,
    };
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    Object.assign(paymentMethod, updatePaymentMethodDto);
    const updated = await this.paymentMethodRepository.save(paymentMethod);

    return {
      success: true,
      data: updated,
      message: 'Payment method updated successfully',
    };
  }
}
