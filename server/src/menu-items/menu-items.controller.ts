import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@Controller('menu-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createMenuItemDto: CreateMenuItemDto, @CurrentUser() user: User) {
    return this.menuItemsService.create(createMenuItemDto, user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findAll(@CurrentUser() user: User) {
    return this.menuItemsService.findAll(user);
  }

  @Get('restaurant/:restaurantId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findByRestaurant(@Param('restaurantId') restaurantId: string, @CurrentUser() user: User) {
    return this.menuItemsService.findByRestaurant(restaurantId, user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.menuItemsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
    @CurrentUser() user: User,
  ) {
    return this.menuItemsService.update(id, updateMenuItemDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.menuItemsService.remove(id, user);
  }
}
