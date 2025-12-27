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

interface WelcomeEmailProps {
    name: string;
    companyName?: string;
}

export default function WelcomeEmail({
    name = 'Valued Customer',
    companyName = 'Champion Choice',
}: WelcomeEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={h1}>Welcome to {companyName}! 🎉</Heading>
                    </Section>

                    <Section style={content}>
                        <Text style={greeting}>Hi {name},</Text>

                        <Text style={paragraph}>
                            Thank you for joining {companyName}! We're thrilled to have you as part of our community.
                        </Text>

                        <Text style={paragraph}>
                            We specialize in premium martial arts equipment and sportswear. Whether you're a beginner or a professional, we have everything you need to excel in your training.
                        </Text>

                        <Text style={paragraph}>
                            Here's what you can expect from us:
                        </Text>

                        <ul style={list}>
                            <li style={listItem}>🔥 Exclusive flash sales and deals</li>
                            <li style={listItem}>📦 High-quality products at competitive prices</li>
                            <li style={listItem}>🚚 Fast and reliable shipping</li>
                            <li style={listItem}>💪 Expert support and guidance</li>
                        </ul>
                    </Section>

                    <Section style={ctaSection}>
                        <Button href="https://champion-choice.com" style={button}>
                            Start Shopping
                        </Button>
                    </Section>

                    <Hr style={hr} />

                    <Section style={footer}>
                        <Text style={footerText}>
                            © 2024 {companyName}. All rights reserved.
                        </Text>
                        <Text style={footerText}>
                            <a href="{{unsubscribeUrl}}" style={link}>Unsubscribe</a>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

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
    margin: '0',
    padding: '0',
};

const content = {
    padding: '32px 24px',
};

const greeting = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#555',
    marginBottom: '16px',
};

const list = {
    paddingLeft: '20px',
    marginBottom: '24px',
};

const listItem = {
    fontSize: '16px',
    lineHeight: '28px',
    color: '#555',
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
