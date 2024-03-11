import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils";

export const fetchMetaFromImage = createAsyncThunk(
    'metaImage/fetchMetaImage',
    async ({ data }) => {
        try {
            // console.log(data);
            const res = await axios.post(`${BASE_URL}/create`, data);
            // console.log(res?.data);

            return res?.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

const MetaImageSlice = createSlice({
    name: 'metaImage',
    initialState: {
        imageMetaData: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMetaFromImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMetaFromImage.fulfilled, (state, action) => {
                state.loading = false;
                state.imageMetaData = action.payload;
            })
            .addCase(fetchMetaFromImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default MetaImageSlice.reducer;
