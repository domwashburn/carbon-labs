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
import styles from './comparison-string.scss';

export const ComparisonString = ({ 
    segmentedString, 
    compareMode = false, 
    highlightIsSame = false, 
    highlightIsDifferent = false, 
    className }) => {
 
    let concatenatedValue = Array.isArray(segmentedString) && segmentedString.length >= 1 ? segmentedString.map((item, index) => {

        item === null && <span key={index} className={cx(styles.comparisonSegment, comparisonStyle) }>-</span>
    
        let comparisonStyle = item.comparison === "isSame" ? styles.isSame : styles.isDifferent;

        return <span key={index} className={cx(styles.comparisonSegment, comparisonStyle) }>{item.segment}</span>

    }) : <span className="">-</span>;


    return( <span className={cx(styles.comparison, className)} data-compare-mode={compareMode} data-highlight-same={highlightIsSame} data-highlight-different={highlightIsDifferent}>{concatenatedValue}</span>);


};

export default ComparisonString;

// Made with Bob
