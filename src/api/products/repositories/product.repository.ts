import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Product } from '@entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: number): Promise<Product | null> {
    return await this.repository.findOneBy({ id });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.repository.create(productData);

    return await this.repository.save(product);
  }

  async trxUpdate(manager: EntityManager, product: Product): Promise<Product> {
    return await manager.save(product);
  }

  async findWithTotalQuantity(
    companyId: number,
    limit: number,
    offset: number,
  ): Promise<any[]> {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.company_id as companyId,
        p.is_active as isActive,
        p.created_at as createdAt,
        p.updated_at as updatedAt,
        COALESCE(SUM(ps.quantity), 0) as totalQuantity
      FROM products p
      LEFT JOIN product_stock ps ON p.id = ps.product_id AND ps.quantity > 0
      WHERE p.company_id = ? AND p.is_active = true
      GROUP BY p.id, p.name, p.description, p.is_active, p.created_at
      ORDER BY p.id DESC
      LIMIT ? OFFSET ?
    `;

    return await this.dataSource.query(query, [companyId, limit, offset]);
  }

  async countActive(companyId: number): Promise<number> {
    return await this.repository.count({
      where: {
        companyId,
        isActive: true,
      },
    });
  }
}
