/**
 * Site
 *
 * Primary entry into Admin site
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2024-01-23
 */

// Init body
import 'body_init';

// CSS
import '../sass/site.scss';

// Ouroboros modules
import events from '@ouroboros/events';

// NPM modules
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { wrapComponent } from 'react-snackbar-alert';

// Site component modules
import Errors from 'components/Errors';
import Network from 'components/Network';
import Testing from 'components/Testing';

/**
 * Site
 *
 * Primary site component
 *
 * @name Site
 * @access public
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Site(props) {

	// Startup effect
	useEffect(() => {

		// Subscribe to events
		/*events.get('success').subscribe(msg => {
			props.createSnackbar({
				message: msg,
				dismissable: true,
				pauseOnHover: true,
				progressBar: true,
				sticky: false,
				theme: 'success',
				timeout: 3000
			});
		});*/
	}, []);

	return (
		<BrowserRouter>
			{'development' === process.env.NODE_ENV &&
				<Testing />
			}
			<Network />
			<Errors />
			<div className="">
				ChrisNasr.com
			</div>
		</BrowserRouter>
	);
};