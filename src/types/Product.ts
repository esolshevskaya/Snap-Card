export interface Product {
    id: string;
    title: string;
    description: string;
    image: string;
    author: string;
    category: string;
    liked: boolean;
    isCustom: boolean;
    isFromApi: boolean;
}