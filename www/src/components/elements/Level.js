/**
 * Level
 *
 * Displays 1 to 5 star rank
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-24
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Constants
const RANKS = [1,2,3,4,5];
const ON = 'https://ouroboroscoding.s3.us-east-2.amazonaws.com/chrisnasr/goldstar.gif'
const OFF = 'https://ouroboroscoding.s3.us-east-2.amazonaws.com/chrisnasr/greystar.gif'

/**
 * Level
 *
 * @name Level
 * @access public
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Level({ value }) {
	return RANKS.map(i =>
		<img
			alt={`rating star ${i}`}
			className="levelRank"
			key={i}
			src={value < i ? OFF : ON}
		/>
	);
}

// Valid props
Level.propTypes = {
	value: PropTypes.oneOf(RANKS).isRequired
}