/**
 * Intro
 *
 * Intro page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-25
 */

// Ouroboros modules
import body from '@ouroboros/body';

// NPM modules
import React, { useEffect, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Project modules
import Message from 'message';

/**
 * Intro
 *
 * Displays current static pages with the ability to edit them, or add a new one
 *
 * @name Intro
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Intro(props) {

	// State
	const [ result, resultSet ] = useState(false);

	// Load / statics effect
	useEffect(() => {
		body.read('primary', 'static', { key: 'intro' }).then(
			resultSet,
			Message.error
		);
	}, [ ]);

	// Render
	return (
		<Box id="intro" className="flexDynamic padding">
			{(result === false &&
				<Typography>Loading...</Typography>
			) ||
				<div dangerouslySetInnerHTML={{ __html: result.content }} />
			}
		</Box>
	);
}

// Valid props
Intro.propTypes = { }