import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto, user: User) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createMenuItemDto.restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (user.role === Role.MANAGER && restaurant.country !== user.country) {
      throw new ForbiddenException(
        'Managers can only create menu items for restaurants in their own country',
      );
    }

    const menuItem = this.menuItemRepository.create(createMenuItemDto);
    const saved = await this.menuItemRepository.save(menuItem);

    return {
      success: true,
      data: saved,
      message: 'Menu item created successfully',
    };
  }

  async findAll(user: User) {
    const query = this.menuItemRepository
      .createQueryBuilder('menuItem')
      .leftJoinAndSelect('menuItem.restaurant', 'restaurant');

    if (user.role !== Role.ADMIN) {
      query.where('restaurant.country = :country', { country: user.country });
    }

    const menuItems = await query.getMany();

    return {
      success: true,
      data: menuItems,
    };
  }

  async findByRestaurant(restaurantId: string, user: User) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (user.role !== Role.ADMIN && restaurant.country !== user.country) {
      throw new ForbiddenException('Access denied to this restaurant');
    }

    const menuItems = await this.menuItemRepository.find({
      where: { restaurantId },
    });

    return {
      success: true,
      data: menuItems,
    };
  }

  async findOne(id: string, user: User) {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    if (
      user.role !== Role.ADMIN &&
      menuItem.restaurant.country !== user.country
    ) {
      throw new ForbiddenException('Access denied to this menu item');
    }

    return {
      success: true,
      data: menuItem,
    };
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto, user: User) {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    if (
      user.role === Role.MANAGER &&
      menuItem.restaurant.country !== user.country
    ) {
      throw new ForbiddenException(
        'Managers can only update menu items in their own country',
      );
    }

    Object.assign(menuItem, updateMenuItemDto);
    const updated = await this.menuItemRepository.save(menuItem);

    return {
      success: true,
      data: updated,
      message: 'Menu item updated successfully',
    };
  }

  async remove(id: string, user: User) {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    await this.menuItemRepository.remove(menuItem);

    return {
      success: true,
      message: 'Menu item deleted successfully',
    };
  }
}
