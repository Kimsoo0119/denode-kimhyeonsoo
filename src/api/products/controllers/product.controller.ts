import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { StockInboundDto } from '../dtos/requests/stock-inbound.dto';
import { AccessTokenGuard } from '@core/jwt/guards/access-token.guard';
import { GetAuthorizedUser } from '@shared/decorators';
import { TokenPayload } from '@api/auth/interfaces/interface';
import { ApiProduct } from '@api/products/swaggers/product.swagger';
import { StockOutboundDto } from '@api/products/dtos/requests/stock-outbound.dto';
import { GetProductsDto } from '../dtos/requests/get-products.dto';
import { ProductListResponseDto } from '../dtos/responses/product-list-response.dto';
import { GetProductStocksDto } from '@api/products/dtos/requests/get-product-stocks.dto';
import { ProductStockListResponseDto } from '@api/products/dtos/responses/product-stock.dto';

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

  @ApiProduct.GetProducts({
    summary: '제품 목록 조회',
    description:
      '가장 최근에 등록된 제품부터 조회되며 페이지 번호와 페이지당 조회 개수를 지정할 수 있습니다.',
  })
  @UseGuards(AccessTokenGuard)
  @Get()
  async getProducts(
    @GetAuthorizedUser() user: TokenPayload,
    @Query() getProductsDto: GetProductsDto,
  ): Promise<ProductListResponseDto> {
    return await this.productService.getProducts(
      user.companyId,
      getProductsDto,
    );
  }

  @ApiProduct.GetProductStocks({
    summary: '제품별 재고 목록 조회',
    description:
      '제품 ID를 기준으로 유통기한이 가까운 재고부터 조회되며 페이지 번호와 페이지당 조회 개수를 지정할 수 있습니다.',
  })
  @Get('/:productId/stocks')
  @UseGuards(AccessTokenGuard)
  async getProductStocks(
    @GetAuthorizedUser() user: TokenPayload,
    @Param('productId', ParseIntPipe) productId: number,
    @Query() getProductStocksDto: GetProductStocksDto,
  ): Promise<ProductStockListResponseDto> {
    return await this.productService.getProductStocks(
      user,
      productId,
      getProductStocksDto,
    );
  }

  @ApiProduct.ProcessInbound({
    summary: '제품 입고',
  })
  @Post('/:productId/inbound')
  @UseGuards(AccessTokenGuard)
  async processInbound(
    @GetAuthorizedUser() user: TokenPayload,
    @Param('productId', ParseIntPipe) productId: number,
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
    @Param('productId', ParseIntPipe) productId: number,
    @Body() stockOutboundDto: StockOutboundDto,
  ): Promise<void> {
    await this.productService.processOutbound(
      user,
      productId,
      stockOutboundDto,
    );
  }
}
