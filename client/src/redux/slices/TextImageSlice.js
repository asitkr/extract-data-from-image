import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils";

export const fetchTextFromImage = createAsyncThunk(
    'textImage/fetchTextImage',
    async ({ data }) => {
        try {
            const res = await axios.post(`${BASE_URL}/text`, data);
            // console.log(res?.data);

            return res?.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

const TextImageSlice = createSlice({
    name: 'textImage',
    initialState: {
        texImageData: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTextFromImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTextFromImage.fulfilled, (state, action) => {
                state.loading = false;
                state.texImageData = action.payload;
            })
            .addCase(fetchTextFromImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default TextImageSlice.reducer;
