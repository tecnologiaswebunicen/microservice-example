export class CreateSaleProcessorDto {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  customerId: string;
  customerName: string;
  timestamp?: Date;
}
