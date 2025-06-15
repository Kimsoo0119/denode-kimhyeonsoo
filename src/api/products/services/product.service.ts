import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@entities/product.entity';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { ProductResponseDto } from '../dtos/responses/product-response.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    companyId: number,
  ): Promise<number> {
    const product = this.productRepository.create({
      ...createProductDto,
      companyId,
      isActive: false,
    });

    const savedProduct = await this.productRepository.save(product);

    return savedProduct.id;
  }
}
