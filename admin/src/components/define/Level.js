/**
 * Level
 *
 * Used for marking 1 to 5 stars
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-24
 */

// Ouroboros Modules
import { DefineNodeBase } from '@ouroboros/define-mui';

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Material UI
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';

// Images
const On = 'https://ouroboroscoding.s3.us-east-2.amazonaws.com/chrisnasr/goldstar.gif'
const Off = 'https://ouroboroscoding.s3.us-east-2.amazonaws.com/chrisnasr/greystar.gif'

/**
 * NodeLevel
 *
 * Handles writing WYSIWYG Level content
 *
 * @name NodeLevel
 * @access public
 * @extends NodeBase
 */
class NodeLevel extends DefineNodeBase {

	// Constructor
	constructor(props) {

		// Call the parent
		super(props);

		// Bind methods
		this.click = this.click.bind(this);
	}

	// Called when a star is clicked
	click(ev) {

		// Set the new value
		this.setState({
			value: parseInt(ev.target.dataset.level)
		});
	}

	// Render
	render() {
		return (
			<FormControl
				className={`field_${this.props.name} nodeLevel`}
				error={this.state.error !== false}
				variant={this.props.variant}
			>
				<InputLabel
					id={this.props.name}
					shrink={true}
				>
					{this.props.display.__title__}
				</InputLabel>
				<div labelId={this.props.name}>
					{[1,2,3,4,5].map(i =>
						<img
							alt={`rating star ${i}`}
							className="defineLevel"
							data-level={i}
							key={i}
							onClick={this.click}
							src={this.state.value < i ? Off : On}
						/>
					)}
				</div>
				{this.state.error &&
					<FormHelperText>{this.state.error}</FormHelperText>
				}
			</FormControl>
		);
	}
}

// Register with Node
DefineNodeBase.pluginAdd('level', NodeLevel);

// Valid props
NodeLevel.propTypes = {
	value: PropTypes.number
}

// Default props
NodeLevel.defaultProps = {
	value: 5
}