/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';

export const ComparisonString = ({
    segmentedString,
    compareMode = false,
    highlightIsSame = false,
    highlightIsDifferent = false,
    className }) => {

    const prefix = usePrefix();

    let concatenatedValue = Array.isArray(segmentedString) && segmentedString.length >= 1 ? segmentedString.map((item, index) => {

        if (item === null) return <span key={index} className={cx(`${prefix}--comparison-string__segment`)}>-</span>;

        const comparisonStyle = item.comparison === "isSame"
          ? `${prefix}--comparison-string__segment--same`
          : `${prefix}--comparison-string__segment--different`;

        return <span key={index} className={cx(`${prefix}--comparison-string__segment`, comparisonStyle)}>{item.segment}</span>

    }) : <span>-</span>;


    return( <span className={cx(`${prefix}--comparison-string`, className)} data-compare-mode={compareMode} data-highlight-same={highlightIsSame} data-highlight-different={highlightIsDifferent}>{concatenatedValue}</span>);
};

export default ComparisonString;
