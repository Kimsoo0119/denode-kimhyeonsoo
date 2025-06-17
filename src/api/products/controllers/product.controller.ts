import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { StockInDto } from '../dtos/requests/stock-in.dto';
import { ProductResponseDto } from '../dtos/responses/product-response.dto';
import { AccessTokenGuard } from '@core/jwt/guards/access-token.guard';
import { GetAuthorizedUser } from '@shared/decorators';
import { TokenPayload } from '@api/auth/interfaces/interface';
import { ApiProduct } from '@api/products/swaggers/product.swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiProduct.CreateProduct({
    summary: '제품 등록',
    description: '성공시 등록된 제품 ID 반환',
  })
  @Post()
  @UseGuards(AccessTokenGuard)
  async createProduct(
    @GetAuthorizedUser() user: TokenPayload,
    @Body() createProductDto: CreateProductDto,
  ): Promise<number> {
    return await this.productService.createProduct(
      createProductDto,
      user.companyId,
    );
  }

  @ApiProduct.ProcessInbound({
    summary: '제품 입고',
  })
  @Post('/:productId/inbound')
  @UseGuards(AccessTokenGuard)
  async processInbound(
    @GetAuthorizedUser() user: TokenPayload,
    @Param('productId') productId: number,
    @Body() stockInDto: StockInDto,
  ): Promise<void> {
    return await this.productService.processInbound(
      user,
      productId,
      stockInDto,
    );
  }
}
