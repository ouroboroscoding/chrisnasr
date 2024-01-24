/**
 * Categories
 *
 * List of skill categories in the system
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-24
 */

// Ouroboros modules
import body, { errors } from '@ouroboros/body';
import { Tree } from '@ouroboros/define';
import { Form, Results } from '@ouroboros/define-mui';
import { pathToTree } from '@ouroboros/tools';

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

// Definitions
import CategoryDef from 'definitions/skill_category';

// Generate the Tree
const CategoryTree = new Tree(CategoryDef, {
	__ui__: {
		__create__: [ '_order', 'name' ],
		__update__: [ '_order', 'name' ],
		__results__: [ '_id', '_created', '_updated', '_order', 'name' ]
	},

	_id: { __ui__: { __title__: 'Unique ID' } },
	_updated: { __ui__: { __title__: 'Last Updated' } },
	_order: { __ui__: { __title__: 'Order'} },
	name: { __ui__: { __title__: 'Category Name' } }
});

// Constants
const GRID_SIZES = {
	__default__: { xs: 12, sm: 9, lg: 10, xl: 11 },
	_order: { xs: 12, sm: 3, lg: 2, xl: 1 }
};

/**
 * Categories
 *
 * Displays current categories with the ability to edit them, or add a new one
 *
 * @name Categories
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Categories(props) {

	// State
	const [ create, createSet ] = useState(false);
	const [ results, resultsSet ] = useState(false);

	// Load / categories effect
	useEffect(() => {
		body.read('primary', 'skill/categories').then(
			resultsSet,
			Message.error
		);
	}, []);

	// Called when the create form is submitted
	function createSubmit(record) {

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Send the create request
			body.create('primary', 'skill/category', { record }).then(data => {

				// Close the create form
				createSet(false);

				// Notify the user
				Message.success('Category created. Refreshing category list.');

				// Fetch the latest results
				body.read('primary', 'skill/categories').then(
					resultsSet,
					Message.error
				);

				// Resolve ok
				resolve(true);

			}, error => {
				console.error(error);
				if(error.code === errors.DATA_FIELDS) {
					const oErr = pathToTree(error.msg);
					if(oErr.record) {
						reject(oErr.record);
					} else {
						Message.error(error);
					}
				} else if(error.code === errors.DB_DUPLICATE) {
					if(error.msg[1] === 'ui_name') {
						reject({ name: 'Already exists' });
					}
				} else {
					Message.error(error);
				}
			});
		});
	}

	// Called to delete a category
	function resultRemove(key) {

		// Send the delete request
		body.delete('primary', 'skill/category', { _id: key }).then(
			data => {
				if(data) {

					// Notify the user
					Message.success(
						'Category deleted. Refreshing category list.'
					);

					// Fetch the latest results
					body.read('primary', 'skill/categories').then(
						resultsSet,
						Message.error
					);
				}
			},
			error => {
				if(error.code === errors.DB_REFERENCES) {
					Message.error('The category can not be deleted because there are still skills that are associated with it. Delete or re-categories the skills to continue with this operation.');
				} else {
					Message.error(error);
				}
			}
		);
	}

	// Called when a result form is submitted
	function updateSubmit(record, key) {

		// Create a new Promise and return it
		return new Promise((resolve, reject) => {

			// Send the update request
			body.update('primary', 'skill/category', {
				_id: key,
				record
			}).then(data => {

				// Notify the user
				Message.success('Category updated. Refreshing category list.');

				// Fetch the latest results
				body.read('primary', 'skill/categories').then(
					resultsSet,
					Message.error
				);

				// Resolve ok
				resolve(true);

			}, error => {
				console.error(error);
				if(error.code === errors.DATA_FIELDS) {
					const oErr = pathToTree(error.msg);
					if(oErr.record) {
						reject(oErr.record);
					} else {
						Message.error(error);
					}
				} else if(error.code === errors.DB_DUPLICATE) {
					if(error.msg[1] === 'ui_name') {
						reject({ name: 'Already exists' });
					}
				} else {
					Message.error(error);
				}
			});
		});
	}

	// Render
	return (
		<Box id="categories" className="flexDynamic padding">
			<Box className="pageHeader flexColumns">
				<h1 className="flexDynamic">Skill Categories</h1>
				<Tooltip className="flexStatic" title="Create new Category">
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
						tree={CategoryTree}
						type="create"
					/>
				</Paper>
			}
			{(results === false &&
				<Typography>Loading...</Typography>
			) || (results.length === 0 &&
				<Typography>No Skill Categories found.</Typography>
			) ||
				<Results
					data={results}
					gridSizes={GRID_SIZES}
					onDelete={resultRemove}
					onUpdate={updateSubmit}
					orderBy="name"
					tree={CategoryTree}
				/>
			}
		</Box>
	);
}

// Valid props
Categories.propTypes = { }