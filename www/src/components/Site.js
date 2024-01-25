/**
 * Site
 *
 * Primary entry into Admin site
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-23
 */

// Init body
import 'body_init';

// CSS
import '../sass/site.scss';

// NPM modules
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';

// CSS Theme
import Theme from 'components/Theme'

// Site component modules
import Errors from 'components/Errors';
import Header from 'components/Header';
import Network from 'components/Network';
import Success from 'components/Success';
import Testing from 'components/Testing';

// Site pages
import Experience from 'components/pages/Experience';
import Intro from 'components/pages/Intro';
import Skills from 'components/pages/Skills';
import Static from 'components/pages/Static';

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

	return (
		<StyledEngineProvider injectFirst={true}>
			<ThemeProvider theme={Theme}>
				<BrowserRouter>
					{'development' === process.env.NODE_ENV &&
						<Testing />
					}
					<Network />
					<Success />
					<Errors />
					<Header />
					<Box id="content" className="flexDynamic">
						<Routes>
							<Route path="/experience" element={
								<Experience />
							} />
							<Route path="/skills" element={
								<Skills />
							} />
							<Route path="/:key" element={
								<Static />
							} />
							<Route path="/" element={
								<Intro />
							} />
						</Routes>
					</Box>
				</BrowserRouter>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}