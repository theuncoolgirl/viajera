import React from 'react';

import {csrftoken} from '../csrfUtility';

const CSRFToken = () => {
    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
    );
};

export default CSRFToken;