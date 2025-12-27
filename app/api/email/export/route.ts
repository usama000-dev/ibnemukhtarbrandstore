import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/mongodb';
import { EmailSubscriber } from '@/models/EmailSubscriber';
import { SyncService } from '@/services/syncService';

export async function GET(req: Request) {
    try {
        await connectDb();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'emails', 'phones'

        let data: any[] = [];
        let csvContent = '';
        let filename = '';

        if (type === 'phones') {
            data = await SyncService.getPhoneNumbers();
            // CSV Header
            csvContent = 'Name,Phone,Email,Source\n';
            // CSV Rows
            data.forEach(sub => {
                const name = sub.name ? `"${sub.name.replace(/"/g, '""')}"` : '';
                const phone = sub.phone ? `"${sub.phone}"` : '';
                const email = sub.email || '';
                const source = sub.source || '';
                csvContent += `${name},${phone},${email},${source}\n`;
            });
            filename = `phone_list_${new Date().toISOString().split('T')[0]}.csv`;

        } else {
            // Default to emails
            data = await EmailSubscriber.find({ isActive: true });
            // CSV Header
            csvContent = 'Email,Name,Phone,Source,SubscribedAt\n';
            // CSV Rows
            data.forEach(sub => {
                const email = sub.email || '';
                const name = sub.name ? `"${sub.name.replace(/"/g, '""')}"` : '';
                const phone = sub.phone ? `"${sub.phone}"` : '';
                const source = sub.source || '';
                const date = sub.subscribedAt ? new Date(sub.subscribedAt).toISOString().split('T')[0] : '';
                csvContent += `${email},${name},${phone},${source},${date}\n`;
            });
            filename = `email_list_${new Date().toISOString().split('T')[0]}.csv`;
        }

        // Return CSV file
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error: any) {
        console.error('Export API Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
