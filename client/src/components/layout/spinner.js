import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './spinner.css';

const Spinner = () => {
    return (
        <CircularProgress className="spinner" color="inherit" size="5%"/>
    );
};

export default Spinner;