/**
 * HTML
 *
 * Used for WYSIWYG editor
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2022-04-26
 */

// Ouroboros Modules
import { DefineNodeBase } from '@ouroboros/define-mui';

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Material UI
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';

/**
 * NodeHTML
 *
 * Handles writing WYSIWYG HTML content
 *
 * @name NodeHTML
 * @access public
 * @extends NodeBase
 */
class NodeHTML extends DefineNodeBase {

	// Constructor
	constructor(props) {

		// Call the parent
		super(props);

		// Refs
		this.refEditor = React.createRef();
	}

	// Render
	render() {
		return (
			<FormControl
				className={`field_${this.props.name} nodeHTML`}
				error={this.state.error !== false}
				variant={this.props.variant}
			>
				<InputLabel
					id={this.props.name}
					shrink={true}
					>
					{this.props.display.__title__}
				</InputLabel>
				<Editor
					apiKey={process.env.REACT_APP_TINYMCE}
					onInit={(evt, editor) => this.refEditor.current = editor}
					initialValue={this.props.value}
					init={{
						block_formats: 'Heading 1=h1; Heading 2=h2; Heading 3=h3; Paragraph=p; Preformatted=pre',
						content_style: 'body { font-family: "Roboto","Helvetica","Arial",sans-serif; font-size: 1rem }',
						max_height: 600,
						menubar: false,
						plugins: ['advlist', 'emoticons', 'link', 'lists', 'code', 'autoresize', 'image'],
						paste_as_text: true,
						statusbar: false,
						toolbar: 'undo redo | ' +
									'blocks | ' +
									'bold italic | ' +
									'alignleft aligncenter alignright alignjustify | ' +
									'bullist numlist outdent indent | ' +
									'link image | ' +
									'removeformat code'
					}}

				/>
				{this.state.error &&
					<FormHelperText>{this.state.error}</FormHelperText>
				}
			</FormControl>
		);
	}

	get value() {
		return this.refEditor.current.getContent();
	}

	set value(value) {
		return;
	}
}

// Register with Node
DefineNodeBase.pluginAdd('html', NodeHTML);

// Valid props
NodeHTML.propTypes = {
	value: PropTypes.string
}

// Default props
NodeHTML.defaultProps = {
	value: ''
}