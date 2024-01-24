/**
 * Network
 *
 * Manages Network related to a specific url regardless of whether it exists or
 * not
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-05-27
 */

// NPM modules
import React, { useEffect, useState } from 'react';

/**
 * Network
 *
 * Used to show when the browser is no longer connected to the network
 *
 * @name Network
 * @access private
 * @param {object} props Properties passed to the component
 * @returns React.Component
 */
export default function Network(props) {

	// State
	const [online, onlineSet] = useState(true);

	// Load effect
	useEffect(() => {
		const f = () => onlineSet(navigator.onLine);
		window.addEventListener('online', f);
		window.addEventListener('offline', f);
		return () => {
			window.removeEventListener('online', f);
			window.removeEventListener('offline', f);
		}
	}, []);

	// If we're online, do nothing
	if(online) {
		return null;
	}

	// Else, return an error box
	return (
		<div id="offline">
			<p>You are not online! Please check your network connection</p>
		</div>
	);
}