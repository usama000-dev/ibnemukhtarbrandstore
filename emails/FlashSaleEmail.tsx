import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Heading,
    Text,
    Button,
    Img,
    Hr,
} from '@react-email/components';

interface FlashSaleEmailProps {
    title: string;
    description: string;
    discount: string;
    endTime: string;
    products: Array<{
        name: string;
        originalPrice: number;
        salePrice: number;
        image: string;
    }>;
}

export default function FlashSaleEmail({
    title = '🔥 Flash Sale Alert - 50% OFF!',
    description = 'Limited time flash sale with amazing discounts!',
    discount = '50% OFF',
    endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    products = [],
}: FlashSaleEmailProps) {
    const endDate = new Date(endTime);

    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Heading style={h1}>{title}</Heading>
                        <Text style={descriptionStyle}>{description}</Text>
                    </Section>

                    {/* Discount Badge */}
                    <Section style={discountSection}>
                        <div style={discountBadge}>{discount}</div>
                    </Section>

                    {/* Countdown */}
                    <Section style={countdownSection}>
                        <Text style={countdownText}>
                            ⏰ Ends: {endDate.toLocaleString()}
                        </Text>
                    </Section>

                    {/* Products */}
                    <Section style={productsSection}>
                        {products.map((product, index) => (
                            <div key={index} style={productCard}>
                                <Img
                                    src={product.image}
                                    alt={product.name}
                                    style={productImage}
                                />
                                <Text style={productName}>{product.name}</Text>
                                <div style={priceContainer}>
                                    <Text style={originalPrice}>
                                        Rs. {product.originalPrice}
                                    </Text>
                                    <Text style={salePrice}>
                                        Rs. {product.salePrice}
                                    </Text>
                                </div>
                            </div>
                        ))}
                    </Section>

                    {/* CTA Button */}
                    <Section style={ctaSection}>
                        <Button
                            href="https://champion-choice.com"
                            style={button}
                        >
                            Shop Now
                        </Button>
                    </Section>

                    {/* Footer */}
                    <Hr style={hr} />
                    <Section style={footer}>
                        <Text style={footerText}>
                            © 2024 Champion Choice. All rights reserved.
                        </Text>
                        <Text style={footerText}>
                            <a href="{{unsubscribeUrl}}" style={link}>
                                Unsubscribe
                            </a>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
};

const header = {
    padding: '32px 24px',
    textAlign: 'center' as const,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const h1 = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 16px',
    padding: '0',
};

const descriptionStyle = {
    color: '#ffffff',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
};

const discountSection = {
    textAlign: 'center' as const,
    padding: '24px',
};

const discountBadge = {
    display: 'inline-block',
    backgroundColor: '#ff4757',
    color: '#ffffff',
    fontSize: '48px',
    fontWeight: 'bold',
    padding: '24px 48px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
};

const countdownSection = {
    textAlign: 'center' as const,
    padding: '16px 24px',
    backgroundColor: '#fff3cd',
};

const countdownText = {
    color: '#856404',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0',
};

const productsSection = {
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
};

const productCard = {
    textAlign: 'center' as const,
    padding: '16px',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
};

const productImage = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '12px',
};

const productName = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: '8px 0',
};

const priceContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
};

const originalPrice = {
    fontSize: '14px',
    color: '#999',
    textDecoration: 'line-through',
    margin: '0',
};

const salePrice = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ff4757',
    margin: '0',
};

const ctaSection = {
    textAlign: 'center' as const,
    padding: '32px 24px',
};

const button = {
    backgroundColor: '#667eea',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '16px 48px',
};

const hr = {
    borderColor: '#e1e8ed',
    margin: '32px 0',
};

const footer = {
    textAlign: 'center' as const,
    padding: '0 24px',
};

const footerText = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    margin: '4px 0',
};

const link = {
    color: '#667eea',
    textDecoration: 'underline',
};
