/**
 * Skills
 *
 * List of skills in the system
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-24
 */

// Ouroboros modules
import body from '@ouroboros/body';
import { empty, omap, sortByKey } from '@ouroboros/tools';

// NPM modules
import React, { useEffect, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Project components
import Level from 'components/elements/Level';

// Project modules
import Message from 'message';

/**
 * Skills
 *
 * Displays current skills with the ability to edit them, or add a new one
 *
 * @name Skills
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Skills(props) {

	// State
	const [ results, resultsSet ] = useState(false);

	// Load / skills effect
	useEffect(() => {
		body.read('primary', '__list', [ 'skills', 'skill/categories' ]).then(
			data => {
				data[1][1].data.sort(sortByKey('_order'))
				const oResults = data[1][1].data.reduce((o, l) =>
					Object.assign(o, {
						[l._id]: { 'name': l.name, 'skills': [] }
					}), {});
				data[0][1].data.forEach(o => {
					oResults[o.category].skills.push(o);
				});
				for(const _id in oResults) {
					oResults[_id].skills.sort(sortByKey('_order'));
				}

				resultsSet(oResults);
			},
			Message.error
		);
	}, []);

	// Render
	return (
		<Box id="skills" className="flexDynamic padding">
			<Box className="pageHeader flexColumns">
				<h1 className="flexDynamic">Skills</h1>
			</Box>
			{(results === false &&
				<Typography>Loading...</Typography>
			) || (empty(results) &&
				<Typography>No Skills found.</Typography>
			) || omap(results, v =>
				<Box className="category">
					<Box className="header">{v.name}</Box>
					<Grid container spacing={1}>
						{v.skills.map(o =>
							<>
								<Grid item className="name" xs={4}>{o.name}</Grid>
								<Grid item className="level" xs={4}><Level value={o.level} /></Grid>
								<Grid item className="years" xs={4}>{o.years === 1 ? '1 year' : `${o.years} years`}</Grid>
							</>
						)}
					</Grid>
				</Box>
			)}
		</Box>
	);
}

// Valid props
Skills.propTypes = { }