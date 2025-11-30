import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddOrderItemDto } from './dto/add-order-item.dto';
import { CheckoutOrderDto } from './dto/checkout-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Post(':id/items')
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  addItem(
    @Param('id') id: string,
    @Body() addOrderItemDto: AddOrderItemDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.addItem(id, addOrderItemDto, user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findAll(@CurrentUser() user: User) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.findOne(id, user);
  }

  @Post(':id/checkout')
  @Roles(Role.ADMIN, Role.MANAGER)
  checkout(
    @Param('id') id: string,
    @Body() checkoutOrderDto: CheckoutOrderDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.checkout(id, checkoutOrderDto, user);
  }

  @Post(':id/cancel')
  @Roles(Role.ADMIN, Role.MANAGER)
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.cancel(id, user);
  }
}
