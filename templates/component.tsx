import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@/store/rootReducer';
import styles from './index.module.scss';

type Props = {};

export default function {{name}}(props: Props) {
    const [count, setCount] = useState(0);
    const state = useSelector((state: RootState) => state);
    const dispatch = useDispatch();

    return (
        <div>
            <span>I am {{name}}</span>
        </div>
    );
}
