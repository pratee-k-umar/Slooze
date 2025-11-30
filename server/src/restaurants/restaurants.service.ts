import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, user: User) {
    if (user.role === Role.MANAGER && createRestaurantDto.country !== user.country) {
      throw new ForbiddenException('Managers can only create restaurants in their own country');
    }

    const restaurant = this.restaurantRepository.create(createRestaurantDto);
    const saved = await this.restaurantRepository.save(restaurant);

    return {
      success: true,
      data: saved,
      message: 'Restaurant created successfully',
    };
  }

  async findAll(user: User) {
    const query = this.restaurantRepository.createQueryBuilder('restaurant');

    if (user.role !== Role.ADMIN) {
      query.where('restaurant.country = :country', { country: user.country });
    }

    const restaurants = await query.getMany();

    return {
      success: true,
      data: restaurants,
    };
  }

  async findOne(id: string, user: User) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (user.role !== Role.ADMIN && restaurant.country !== user.country) {
      throw new ForbiddenException('Access denied to this restaurant');
    }

    return {
      success: true,
      data: restaurant,
    };
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto, user: User) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (user.role === Role.MANAGER && restaurant.country !== user.country) {
      throw new ForbiddenException('Managers can only update restaurants in their own country');
    }

    Object.assign(restaurant, updateRestaurantDto);
    const updated = await this.restaurantRepository.save(restaurant);

    return {
      success: true,
      data: updated,
      message: 'Restaurant updated successfully',
    };
  }

  async remove(id: string, user: User) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    await this.restaurantRepository.remove(restaurant);

    return {
      success: true,
      message: 'Restaurant deleted successfully',
    };
  }
}
