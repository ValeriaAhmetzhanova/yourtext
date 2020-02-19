import React from 'react';

const defaultLoadingComponent = props => {
    const {
        theme,
        isFocused, // eslint-disable-line no-unused-vars
        searchValue, // eslint-disable-line no-unused-vars
        ...parentProps
    } = props;

    return (
        <div {...parentProps}>
            <span className={theme.mentionSuggestionsEntryText}>Loading...</span>
        </div>
    );
};

export default defaultLoadingComponent;
