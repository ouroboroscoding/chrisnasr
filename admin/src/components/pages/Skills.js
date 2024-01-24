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
import body, { errors } from '@ouroboros/body';
import { Tree } from '@ouroboros/define';
import { Form, Options, Results } from '@ouroboros/define-mui';

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
import 'components/define/Level';

// Definitions
import SkillDef from 'definitions/skill';

// Init the categories options
const CategoriesOptions = new Options.Custom();

// Generate the Tree
const SkillTree = new Tree(SkillDef, {
	__ui__: {
		__create__: [ 'category', 'name', 'level', 'years' ],
		__update__: [ 'category', 'name', 'level', 'years' ],
		__results__: [ '_id', '_created', '_updated', 'category', 'name' ]
	},

	_id: { __ui__: { __title__: 'Unique ID' } },
	_updated: { __ui__: { __title__: 'Last Updated' } },
	category: { __ui__: {
		__options__: CategoriesOptions,
		__type__: 'select'
	} },
	level: { __ui__: { __type__: 'level' } }
});

// Constants
const GRID_SIZES = {
	__default__: { xs: 12, md: 6, lg: 4 },
	name: { xs: 12, md: 6, lg: 4 },
	level: { xs: 6, md: 3, lg: 2 },
	years: { xs: 6, md: 3, lg: 2 }
};

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
	const [ create, createSet ] = useState(false);
	const [ results, resultsSet ] = useState(false);

	// Load / skills effect
	useEffect(() => {
		body.read('primary', '__list', [ 'skills', 'skill/categories' ]).then(
			data => {
				resultsSet(data[0][1].data);
				CategoriesOptions.set(
					data[1][1].data.map(o => [ o._id, o.name ])
				)
			},
			Message.error
		);
	}, []);

	// Called when the create form is submitted
	function createSubmit(record) {

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Send the create request
			body.create('primary', 'skill', { record }).then(data => {

				// Close the create form
				createSet(false);

				// Notify the user
				Message.success('Skill created. Refreshing skill list.'
				);

				// Fetch the latest results
				body.read('primary', 'skills').then(
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

	// Called to delete a skill
	function resultRemove(key) {

		// Send the delete request
		body.delete('primary', 'skill', { _id: key }).then(
			data => {
				if(data) {

					// Notify the user
					Message.success(
						'Skill deleted. Refreshing skill list.'
					);

					// Fetch the latest results
					body.read('primary', 'skills').then(
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
			body.update('primary', 'skill', {
				_id: key,
				record
			}).then(data => {

				// Notify the user
				Message.success(
					'Skill updated. Refreshing skill list.'
				);

				// Fetch the latest results
				body.read('primary', 'skills').then(
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
		<Box id="skills" className="flexDynamic padding">
			<Box className="pageHeader flexColumns">
				<h1 className="flexDynamic">Skills</h1>
				<Tooltip className="flexStatic" title="Create new Skill">
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
						tree={SkillTree}
						type="create"
						value={{ level: 3 }}
					/>
				</Paper>
			}
			{(results === false &&
				<Typography>Loading...</Typography>
			) || (results.length === 0 &&
				<Typography>No Skills found.</Typography>
			) ||
				<Results
					data={results}
					gridSizes={GRID_SIZES}
					onDelete={resultRemove}
					onUpdate={updateSubmit}
					orderBy="name"
					tree={SkillTree}
				/>
			}
		</Box>
	);
}

// Valid props
Skills.propTypes = { }