import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { Product } from "../types/Product";
import {fetchProductsApi} from "../api/productsApi";

interface ProductsState {
    items: Product[];
    filter: "all" | "favorites";
    loading: boolean;
}

const loadState = (): ProductsState => {
    try {
        const serializedState = localStorage.getItem('snapcardState');
        if (serializedState === null) {
            return {
                items: [],
                filter: "all",
                loading: false,
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            items: [],
            filter: "all",
            loading: false,
        };
    }
};

const saveState = (state: ProductsState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('snapcardState', serializedState);
    } catch {
        // ignore errors
    }
};

const initialState: ProductsState = loadState();

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async () => await fetchProductsApi()
);

export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
            saveState(state);
        },
        toggleLike(state, action: PayloadAction<string>) {
            const item = state.items.find(i => i.id === action.payload);
            if (item) {
                item.liked = !item.liked;
                saveState(state);
            }
        },
        removeProduct(state, action: PayloadAction<string>) {
            state.items = state.items.filter(i => i.id !== action.payload);
            saveState(state);
        },
        setFilter(state, action: PayloadAction<"all" | "favorites">) {
            state.filter = action.payload;
            saveState(state);
        },
        updateProduct(state, action: PayloadAction<{
            id: string;
            title: string;
            description: string;
            image: string;
        }>) {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                item.title = action.payload.title;
                item.description = action.payload.description;
                item.image = action.payload.image;
                saveState(state);
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchProducts.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;

            const customItems = state.items.filter(item => item.isCustom);

            const userLikes = state.items.filter(item => item.liked).map(item => ({
                id: item.id,
                liked: true
            }));

            const newItems = action.payload.map(apiItem => {
                const userLike = userLikes.find(like => like.id === apiItem.id);
                return userLike ? { ...apiItem, liked: true } : apiItem;
            });

            state.items = [...customItems, ...newItems];
            saveState(state);
        });
        builder.addCase(fetchProducts.rejected, state => {
            state.loading = false;
        });
    }
});

export const { toggleLike, removeProduct, setFilter, addProduct, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;