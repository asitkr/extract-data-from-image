import { configureStore } from "@reduxjs/toolkit";
import TextImageSlice from "./slices/TextImageSlice";
import MetaImageSlice from "./slices/MetaImageSlice";
import BackgroundRemoveSlice from "./slices/BackgroundRemoveSlice";

const store = configureStore({
    reducer: {
        textImage: TextImageSlice,
        metaImage: MetaImageSlice,
        bgImage: BackgroundRemoveSlice,
    }
})

export default store;