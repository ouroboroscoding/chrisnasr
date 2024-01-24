/**
 * Experience
 *
 * List of experience records in the system
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-24
 */

// Ouroboros modules
import body, { errors } from '@ouroboros/body';

// NPM modules
import React, { useEffect, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Project modules
import Message from 'message';

// Months
const _months = {
	'01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
	'05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
	'09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
}

/**
 * Convert Date
 *
 * Converts an ISO (YYYY-MM-DD) into a more human readable format
 *
 * @name
 * @access private
 * @param {string} d The iso formatted date to convert
 * @return {string}
 */
function convertDate(d) {
	const l = d.split('-');
	return `${_months[l[1]]} ${l[0]}`
}

/**
 * Experience
 *
 * Displays current experiences
 *
 * @name Experience
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Experience(props) {

	// State
	const [ results, resultsSet ] = useState(false);

	// Load / experiences effect
	useEffect(() => {
		body.read('primary', 'experiences').then(
			resultsSet,
			Message.error
		);
	}, []);

	// Render
	return (
		<Box id="experiences" className="flexDynamic padding">
			<Box className="pageHeader flexColumns">
				<h1 className="flexDynamic">Experience</h1>
			</Box>
			{(results === false &&
				<Typography>Loading...</Typography>
			) || (results.length === 0 &&
				<Typography>No Experiences found.</Typography>
			) || results.map(o =>
				<Box className="experience">
					<Box className="header">
						{convertDate(o.from)} - {o.to ? convertDate(o.to) : 'Present'},&nbsp;
						{o.url ?
							<a href={o.url} target="_blank">{o.company}</a> :
							o.company
						},&nbsp;
						{o.location}
					</Box>
					<Box className="title">{o.title}</Box>
					<Box className="description">
						<div dangerouslySetInnerHTML={{
							__html: o.description
						}} />
					</Box>
				</Box>
			)}
		</Box>
	);
}

// Valid props
Experience.propTypes = { }