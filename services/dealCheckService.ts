export interface DealProduct {
  _id: string;
  title: string;
  name?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  flashPrice?: number;
  flashSalePrice?: number;
  discountPercent?: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
  flashStart?: string;
  flashEnd?: string;
  flashSaleStart?: string;
  flashSaleEnd?: string;
  flashSale?: boolean;
  isUniform?: boolean;
}

export interface ActiveDeals {
  flashSales: DealProduct[];
  discounts: DealProduct[];
  hasActiveDeals: boolean;
  totalActiveDeals: number;
}

export class DealCheckService {
  // Check for active flash sales and discounts
  static async checkActiveDeals(): Promise<ActiveDeals> {
    try {
      const productsResponse = await fetch('/api/getProducts');
      const productsData = await productsResponse.json();

      const now = new Date();
      const flashSales: DealProduct[] = [];
      const discounts: DealProduct[] = [];

      // Check products for flash sales and discounts
      if (productsData.products) {
        productsData.products.forEach((product: any) => {
          // Check flash sale
          if (product.flashPrice && product.flashEnd) {
            const flashEndDate = new Date(product.flashEnd);
            if (now <= flashEndDate && product.flashPrice < product.price) {
              flashSales.push({
                _id: product._id,
                title: product.title,
                price: product.price,
                originalPrice: product.price,
                salePrice: product.flashPrice,
                flashPrice: product.flashPrice,
                image: product.images?.[0] || product.image,
                flashEnd: product.flashEnd,
                discountPercent: ((product.price - product.flashPrice) / product.price * 100)
              });
            }
          }

          // Check regular discounts
          if (product.discountPercent && product.discountPercent > 0) {
            const discountedPrice = product.price - (product.price * product.discountPercent / 100);
            discounts.push({
              _id: product._id,
              title: product.title,
              price: product.price,
              originalPrice: product.price,
              salePrice: discountedPrice,
              discountPercent: product.discountPercent,
              image: product.images?.[0] || product.image
            });
          }
        });
      }

      const totalActiveDeals = flashSales.length + discounts.length;

      return {
        flashSales,
        discounts,
        hasActiveDeals: totalActiveDeals > 0,
        totalActiveDeals
      };

    } catch (error) {
      console.error('Error checking active deals:', error);
      return {
        flashSales: [],
        discounts: [],
        hasActiveDeals: false,
        totalActiveDeals: 0
      };
    }
  }

  // Get flash sale products for email
  static async getFlashSaleProducts(): Promise<DealProduct[]> {
    const deals = await this.checkActiveDeals();
    return deals.flashSales;
  }

  // Get discount products for email
  static async getDiscountProducts(): Promise<DealProduct[]> {
    const deals = await this.checkActiveDeals();
    return deals.discounts;
  }

  // Check if there are any active deals
  static async hasActiveDeals(): Promise<boolean> {
    const deals = await this.checkActiveDeals();
    return deals.hasActiveDeals;
  }

  // Get all active deals (flash sales + discounts)
  static async getAllActiveDeals(): Promise<DealProduct[]> {
    const deals = await this.checkActiveDeals();
    return [...deals.flashSales, ...deals.discounts];
  }
}
