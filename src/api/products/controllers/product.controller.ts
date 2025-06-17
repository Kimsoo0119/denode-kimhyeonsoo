import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { StockInboundDto } from '../dtos/requests/stock-inbound.dto';
import { AccessTokenGuard } from '@core/jwt/guards/access-token.guard';
import { GetAuthorizedUser } from '@shared/decorators';
import { TokenPayload } from '@api/auth/interfaces/interface';
import { ApiProduct } from '@api/products/swaggers/product.swagger';
import { StockOutboundDto } from '@api/products/dtos/requests/stock-outbound.dto';

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
    @Body() stockInboundDto: StockInboundDto,
  ): Promise<void> {
    await this.productService.processInbound(user, productId, stockInboundDto);
  }

  @ApiProduct.ProcessOutbound({
    summary: '제품 출고',
    description: '출고시 유통기한이 가까운 제품부터 출고됩니다.',
  })
  @Post('/:productId/outbound')
  @UseGuards(AccessTokenGuard)
  async processOutbound(
    @GetAuthorizedUser() user: TokenPayload,
    @Param('productId') productId: number,
    @Body() stockOutboundDto: StockOutboundDto,
  ): Promise<void> {
    await this.productService.processOutbound(
      user,
      productId,
      stockOutboundDto,
    );
  }
}
