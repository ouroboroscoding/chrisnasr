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
import StaticDef from 'definitions/static';

// Generate the Tree
const StaticTree = new Tree(StaticDef, {
	__ui__: {
		__create__: [ 'key', 'content' ],
		__update__: [ 'content' ],
		__results__: [ '_id', '_created', '_updated', 'key' ]
	},

	_id: { __ui__: { __title__: 'Unique ID' } },
	_updated: { __ui__: { __title__: 'Last Updated' } },
	content: { __ui__: { __type__: 'html' } }
});

// Constants
const GRID_SIZES = {
	__default__: { xs: 12 }
};

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
	const [ create, createSet ] = useState(false);
	const [ results, resultsSet ] = useState(false);

	// Load / statics effect
	useEffect(() => {
		body.read('primary', 'statics').then(
			resultsSet,
			Message.error
		);
	}, []);

	// Called when the create form is submitted
	function createSubmit(record) {

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Send the create request
			body.create('primary', 'static', { record }).then(data => {

				// Close the create form
				createSet(false);

				// Notify the user
				Message.success(
					'Static created. Refreshing static pages list.'
				);

				// Fetch the latest results
				body.read('primary', 'statics').then(
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

	// Called to delete a static
	function resultRemove(key) {

		// Send the delete request
		body.delete('primary', 'static', { _id: key }).then(
			data => {
				if(data) {

					// Notify the user
					Message.success(
						'Static deleted. Refreshing static pages list.'
					);

					// Fetch the latest results
					body.read('primary', 'statics').then(
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
			body.update('primary', 'static', {
				_id: key,
				record
			}).then(data => {

				// Notify the user
				Message.success(
					'Static updated. Refreshing static pages list.'
				);

				// Fetch the latest results
				body.read('primary', 'statics').then(
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
		<Box id="statics" className="flexDynamic padding">
			<Box className="pageHeader flexColumns">
				<h1 className="flexDynamic">Static Pages</h1>
				<Tooltip className="flexStatic" title="Create new Static Page">
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
						tree={StaticTree}
						type="create"
					/>
				</Paper>
			}
			{(results === false &&
				<Typography>Loading...</Typography>
			) || (results.length === 0 &&
				<Typography>No Static Pages found.</Typography>
			) ||
				<Results
					data={results}
					gridSizes={GRID_SIZES}
					onDelete={resultRemove}
					onUpdate={updateSubmit}
					orderBy="key"
					tree={StaticTree}
				/>
			}
		</Box>
	);
}

// Valid props
Static.propTypes = { }