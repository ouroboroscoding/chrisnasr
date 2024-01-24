/**
 * Static
 *
 * List of static records in the system
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-24
 */

// Ouroboros modules
import body from '@ouroboros/body';

// NPM modules
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Project modules
import Message from 'message';

/**
 * Static
 *
 * Displays current static pages with the ability to edit them, or add a new one
 *
 * @name Static
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Static(props) {

	// State
	const [ result, resultSet ] = useState(false);

	// Hooks
	const { key } = useParams();

	// Load / statics effect
	useEffect(() => {
		body.read('primary', 'static', { key }).then(
			resultSet,
			Message.error
		);
	}, [ key ]);

	// Render
	return (
		<Box id={`static_${key}`} className="flexDynamic padding">
			{(result === false &&
				<Typography>Loading...</Typography>
			) ||
				<div dangerouslySetInnerHTML={{ __html: result.content }} />
			}
		</Box>
	);
}

// Valid props
Static.propTypes = { }