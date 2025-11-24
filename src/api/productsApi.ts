import { Product } from "../types/Product";

const ACCESS_KEY = 'lIT2QkWyVv_0lyNPDcU1hPPEN0feeoNF8mmztvSIAvU';

export const fetchProductsApi = async (): Promise<Product[]> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(
            `https://api.unsplash.com/photos/random?count=20&client_id=${ACCESS_KEY}`
        );

        if (!response.ok) {
            throw new Error('Unsplash API failed');
        }

        const unsplashPhotos = await response.json();

        return unsplashPhotos.map((photo: any, index: number) => ({
            id: photo.id,
            title: photo.description || photo.alt_description || `Photo ${index + 1}`,
            description: `By ${photo.user.name}. ${photo.description || 'Beautiful photo'}`,
            image: photo.urls.regular,
            author: photo.user.name,
            category: "photo",
            liked: false,
            isCustom: false,
            isFromApi: true,
        }));

    } catch (error) {
        console.error('Failed to fetch from Unsplash:', error);

        // Mini fallback
        return [
            {
                id: "1",
                title: "Mountain Landscape",
                description: "Beautiful view of snow-capped mountains at sunrise",
                image: "https://picsum.photos/300/200?random=1",
                author: "Nature Photographer",
                category: "landscape",
                liked: false,
                isCustom: false,
                isFromApi: true,
            },
            {
                id: "2",
                title: "Urban Photography",
                description: "Street photography capturing city life",
                image: "https://picsum.photos/300/200?random=2",
                author: "City Explorer",
                category: "urban",
                liked: false,
                isCustom: false,
                isFromApi: true,
            },
            {
                id: "3",
                title: "Portrait Session",
                description: "Professional portrait with perfect lighting",
                image: "https://picsum.photos/300/200?random=3",
                author: "Portrait Artist",
                category: "portrait",
                liked: false,
                isCustom: false,
                isFromApi: true,
            }
        ];
    }
};