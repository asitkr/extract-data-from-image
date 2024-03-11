import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils";

export const fetchBackgroundRemoveImage = createAsyncThunk(
    'bgImage/fetchBackgroundImage',
    async ({ data }) => {
        try {
            console.log(data);
            const res = await axios.post(`${BASE_URL}/removebg`, data);
            console.log(res?.data);

            return res?.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

const BackgroundRemoveSlice = createSlice({
    name: 'bgImage',
    initialState: {
        imageBackgroundData: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBackgroundRemoveImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBackgroundRemoveImage.fulfilled, (state, action) => {
                state.loading = false;
                state.imageBackgroundData = action.payload;
            })
            .addCase(fetchBackgroundRemoveImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default BackgroundRemoveSlice.reducer;
