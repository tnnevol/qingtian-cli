import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    count: 0
};

const {{name}} = createSlice({
    name: '{{name}}',
    initialState,
    reducers: {
        changeCount(state, action: PayloadAction<number>) {
            switch (true) {
                case action.payload > 0:
                    state.count++;
                    break;
                case action.payload < 0:
                    state.count--;
                default:
                    break;
            }
        }
    }
});

export const { changeCount } = {{name}}.actions;
export default {{name}}.reducer;
