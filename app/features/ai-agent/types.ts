export interface SystemProduct {
    id: string;
    title: string;
    description?: string;
    price: number;
    image: string;
    link: string;
    type: 'product' | 'uniform';
}

export interface SearchResponse {
    success: boolean;
    results: SystemProduct[];
    meta: {
        query: string;
        count: number;
    };
}
