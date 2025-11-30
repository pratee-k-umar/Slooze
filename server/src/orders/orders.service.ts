import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddOrderItemDto } from './dto/add-order-item.dto';
import { CheckoutOrderDto } from './dto/checkout-order.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id: createOrderDto.restaurantId },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      if (user.role !== Role.ADMIN && restaurant.country !== user.country) {
        throw new ForbiddenException(
          'Cannot create order for restaurant in different country',
        );
      }

      const order = this.orderRepository.create({
        userId: user.id,
        restaurantId: restaurant.id,
        country: restaurant.country,
        status: OrderStatus.PENDING,
        totalAmount: 0,
        paymentStatus: PaymentStatus.PENDING,
      });

      const saved = await this.orderRepository.save(order);

      return {
        success: true,
        data: saved,
        message: 'Order created successfully',
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async addItem(orderId: string, addOrderItemDto: AddOrderItemDto, user: User) {
    try {
      console.log('Adding item to order:', orderId, addOrderItemDto);

      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['orderItems', 'restaurant'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.userId !== user.id && user.role !== Role.ADMIN) {
        throw new ForbiddenException('Access denied to this order');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Cannot add items to a confirmed order');
      }

      const menuItem = await this.menuItemRepository.findOne({
        where: { id: addOrderItemDto.menuItemId },
        relations: ['restaurant'],
      });

      if (!menuItem) {
        throw new NotFoundException('Menu item not found');
      }

      if (menuItem.restaurantId !== order.restaurantId) {
        throw new BadRequestException(
          'Menu item must be from the same restaurant',
        );
      }

      if (!menuItem.isAvailable) {
        throw new BadRequestException('Menu item is not available');
      }

      const subtotal = Number(menuItem.price) * addOrderItemDto.quantity;

      const orderItem = this.orderItemRepository.create({
        orderId: order.id,
        menuItemId: menuItem.id,
        quantity: addOrderItemDto.quantity,
        price: menuItem.price,
        subtotal,
      });

      console.log('Creating order item with:', {
        orderId: order.id,
        menuItemId: menuItem.id,
        quantity: addOrderItemDto.quantity,
      });

      const savedOrderItem = await this.orderItemRepository.save(orderItem);
      console.log('Saved order item:', savedOrderItem.id);

      // Update order total using query builder to avoid triggering relation updates
      await this.orderRepository
        .createQueryBuilder()
        .update(Order)
        .set({ totalAmount: () => `"totalAmount" + ${subtotal}` })
        .where('id = :id', { id: order.id })
        .execute();

      console.log('Updated order total');

      // Reload order with items to verify
      const updatedOrder = await this.orderRepository.findOne({
        where: { id: order.id },
        relations: ['orderItems'],
      });

      console.log(
        'Order items count after adding:',
        updatedOrder?.orderItems?.length,
      );

      return {
        success: true,
        data: savedOrderItem,
        message: 'Item added to order successfully',
      };
    } catch (error) {
      console.error('Error adding item to order:', error);
      throw error;
    }
  }

  async findAll(user: User) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.menuItem', 'menuItem')
      .leftJoinAndSelect('order.paymentMethod', 'paymentMethod');

    if (user.role === Role.MEMBER) {
      query.where('order.userId = :userId', { userId: user.id });
    } else if (user.role === Role.MANAGER) {
      query.where('order.country = :country', { country: user.country });
    }

    const orders = await query.orderBy('order.createdAt', 'DESC').getMany();

    return {
      success: true,
      data: orders,
    };
  }

  async findOne(id: string, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'restaurant',
        'orderItems',
        'orderItems.menuItem',
        'paymentMethod',
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (user.role === Role.MEMBER && order.userId !== user.id) {
      throw new ForbiddenException('Access denied to this order');
    }

    if (user.role === Role.MANAGER && order.country !== user.country) {
      throw new ForbiddenException('Access denied to this order');
    }

    return {
      success: true,
      data: order,
    };
  }

  async checkout(id: string, checkoutOrderDto: CheckoutOrderDto, user: User) {
    console.log(
      'Checkout called for order:',
      id,
      'by user:',
      user.email,
      'with data:',
      checkoutOrderDto,
    );

    if (user.role === Role.MEMBER) {
      throw new ForbiddenException('Members cannot checkout orders');
    }

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });

    // Debug: Check if items exist in database
    const itemCount = await this.orderItemRepository.count({
      where: { order: { id } },
    });
    console.log(
      'Order found:',
      order
        ? `Yes (${order.orderItems?.length} items loaded, ${itemCount} items in DB)`
        : 'No',
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      console.log('Order status is not pending:', order.status);
      throw new BadRequestException('Order is already processed');
    }

    if (!order.orderItems || order.orderItems.length === 0) {
      console.log('Order has no items');
      throw new BadRequestException('Cannot checkout an empty order');
    }

    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id: checkoutOrderDto.paymentMethodId },
    });

    console.log(
      'Payment method found:',
      paymentMethod
        ? `Yes (${paymentMethod.name}, active: ${paymentMethod.isActive})`
        : 'No',
    );

    if (!paymentMethod || !paymentMethod.isActive) {
      throw new NotFoundException('Payment method not found or inactive');
    }

    order.paymentMethodId = paymentMethod.id;
    order.status = OrderStatus.CONFIRMED;
    order.paymentStatus = PaymentStatus.PAID;

    const updated = await this.orderRepository.save(order);

    return {
      success: true,
      data: updated,
      message: 'Order checked out successfully',
    };
  }

  async cancel(id: string, user: User) {
    if (user.role === Role.MEMBER) {
      throw new ForbiddenException('Members cannot cancel orders');
    }

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel a delivered order');
    }

    order.status = OrderStatus.CANCELLED;
    const updated = await this.orderRepository.save(order);

    return {
      success: true,
      data: updated,
      message: 'Order cancelled successfully',
    };
  }
}
