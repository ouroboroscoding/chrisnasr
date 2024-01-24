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
import { Tree } from '@ouroboros/define';
import { Form, Results } from '@ouroboros/define-mui';

// NPM modules
import React, { useEffect, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// Project modules
import Message from 'message';
import 'components/define/HTML'

// Definitions
import ExperienceDef from 'definitions/experience';

// Generate the Tree
const ExperienceTree = new Tree(ExperienceDef, {
	__ui__: {
		__create__: [
			'company', 'url', 'location', 'title', 'from', 'to', 'description'
		],
		__update__: [
			'company', 'url', 'location', 'title', 'from', 'to', 'description'
		],
		__results__: [ '_id', '_created', '_updated', 'company', 'title' ]
	},

	_id: { __ui__: { __title__: 'Unique ID' } },
	_updated: { __ui__: { __title__: 'Last Updated' } },
	url: { __ui__: { __title__: 'Company Website (Optional)' } },
	from: { __ui__: { __title__: 'Started' } },
	to: { __ui__: { __title__: 'Till' } },
	description: { __ui__: { __type__: 'html' } }
});

// Constants
const GRID_SIZES = {
	__default__: { xs: 12 },
	company: { xs: 12, lg: 6 },
	url: { xs: 12, md: 6, lg: 3 },
	location: { xs: 12, md: 6, lg: 3 },
	title: { xs: 12, lg: 6 },
	from: { xs: 12, md: 6, lg: 3 },
	to: { xs: 12, md: 6, lg: 3 }
};

/**
 * Experience
 *
 * Displays current experiences with the ability to edit them, or add a new one
 *
 * @name Experience
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Experience(props) {

	// State
	const [ create, createSet ] = useState(false);
	const [ results, resultsSet ] = useState(false);

	// Load / experiences effect
	useEffect(() => {
		body.read('primary', 'experiences').then(
			resultsSet,
			Message.error
		);
	}, []);

	// Called when the create form is submitted
	function createSubmit(record) {

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Send the create request
			body.create('primary', 'experience', { record }).then(data => {

				// Close the create form
				createSet(false);

				// Notify the user
				Message.success(
					'Experience created. Refreshing experience list.'
				);

				// Fetch the latest results
				body.read('primary', 'experiences').then(
					resultsSet,
					Message.error
				);

				// Resolve ok
				resolve(true);

			}, error => {
				console.error(error);
				if(error.code === errors.DATA_FIELDS) {
					reject(error.msg);
				} else {
					Message.error(error);
				}
			});
		});
	}

	// Called to delete a experience
	function resultRemove(key) {

		// Send the delete request
		body.delete('primary', 'experience', { _id: key }).then(
			data => {
				if(data) {

					// Notify the user
					Message.success(
						'Experience deleted. Refreshing experience list.'
					);

					// Fetch the latest results
					body.read('primary', 'experiences').then(
						resultsSet,
						Message.error
					);
				}
			},
			Message.error
		);
	}

	// Called when a result form is submitted
	function updateSubmit(record, key) {

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Send the update request
			body.update('primary', 'experience', {
				_id: key,
				record
			}).then(data => {

				// Notify the user
				Message.success(
					'Experience updated. Refreshing experience list.'
				);

				// Fetch the latest results
				body.read('primary', 'experiences').then(
					resultsSet,
					Message.error
				);

				// Resolve ok
				resolve(true);

			}, error => {
				console.error(error);
				if(error.code === errors.DATA_FIELDS) {
					reject(error.msg);
				} else {
					Message.error(error);
				}
			});
		});
	}

	// Render
	return (
		<Box id="experiences" className="flexDynamic padding">
			<Box className="pageHeader flexColumns">
				<h1 className="flexDynamic">Experience</h1>
				<Tooltip className="flexStatic" title="Create new Experience">
					<IconButton
						onClick={() => createSet(b => !b)}
						className={create ? 'open' : null}
					>
						<i className="fa-solid fa-circle-plus" />
					</IconButton>
				</Tooltip>
			</Box>
			{create &&
				<Paper>
					<Form
						gridSizes={GRID_SIZES}
						onCancel={() => createSet(false)}
						onSubmit={createSubmit}
						tree={ExperienceTree}
						type="create"
					/>
				</Paper>
			}
			{(results === false &&
				<Typography>Loading...</Typography>
			) || (results.length === 0 &&
				<Typography>No Experiences found.</Typography>
			) ||
				<Results
					data={results}
					gridSizes={GRID_SIZES}
					onDelete={resultRemove}
					onUpdate={updateSubmit}
					orderBy="company"
					tree={ExperienceTree}
				/>
			}
		</Box>
	);
}

// Valid props
Experience.propTypes = { }