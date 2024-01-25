/**
 * Header
 *
 * Handles title and menu
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc
 * @created 2024-01-23
 */

// Ouroboros modules
import body from '@ouroboros/body';
import { safeLocalStorage } from '@ouroboros/browser';
import clone from '@ouroboros/clone';

// NPM modules
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Header
 *
 * Top of the page
 *
 * @name Header
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Header(props) {

	// Hooks
	const smallScreen = useMediaQuery('(max-width:600px)');
	const location = useLocation();

	// State
	const [loading, loadingSet] = useState(0);
	const [menu, menuSet] = useState(!smallScreen);
	const [subs, subsSet] = useState(safeLocalStorage.json('submenu', {}))

	// Load effect
	useEffect(() => {
		body.onRequested(info => {
			loadingSet(val => {
				val -= 1;
				if(val < 0) {
					val = 0;
				}
				return val;
			});
		});
		body.onRequesting(info => {
			loadingSet(val => val + 1)
		});
	}, [])

	// Hide menu
	function menuOff() {
		menuSet(false);
	}

	// Show/Hide menu
	function menuToggle() {
		menuSet(val => !val);
	}

	// Toggles sub-menus and stores the state in local storage
	function subMenuToggle(name) {

		// Clone the current subs
		let oSubs = clone(subs);

		// If the name exists, delete it
		if(oSubs[name]) {
			delete oSubs[name];
		}
		// Else, add it
		else {
			oSubs[name] = true;
		}

		// Store the value in storage
		localStorage.setItem('submenu', JSON.stringify(oSubs));

		// Update the state
		subsSet(oSubs);
	}

	// Figure out the classes
	const lClasses = [ 'flexStatic' ];
	if(!smallScreen && menu) {
		lClasses.push('shift');
	}

	// Render
	return (
		<Box id="header" className={lClasses.join(' ')}>
			<Box className="flexColumns">
				{smallScreen &&
					<IconButton edge="start" color="inherit" aria-label="menu" onClick={menuToggle}>
						<i className="fa-solid fa-bars" />
					</IconButton>
				}
				<Box><Typography className="title">
					{smallScreen ? 'Chris Nasr' : 'Chris Nasr - Curriculum Vitae'}
				</Typography></Box>
				<Box className="center flexDynamic">
					{loading > 0 &&
						<img src="/images/loading.gif" alt="loader animation" />
					}
				</Box>
			</Box>
			<Drawer
				anchor="left"
				id="menu"
				open={menu}
				onClose={menuOff}
				variant={smallScreen ? 'temporary' : 'permanent'}
			>
				<Box className="flexRows">
					<List className="flexDynamic">
						<Link to="/intro" onClick={menuOff}>
							<ListItemButton selected={location.pathname === '/intro'}>
								<ListItemText primary="Intro" />
							</ListItemButton>
						</Link>

						<Link to="/this" onClick={menuOff}>
							<ListItemButton selected={location.pathname === '/this'}>
								<ListItemText primary="This Site" />
							</ListItemButton>
						</Link>

						<Link to="/references" onClick={menuOff}>
							<ListItemButton selected={location.pathname === '/references'}>
								<ListItemText primary="References & Quotes" />
							</ListItemButton>
						</Link>

						<ListItemButton onClick={ev => subMenuToggle('businesses')}>
							<ListItemText primary="Businesses" />
							{subs.types ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}
						</ListItemButton>
						<Collapse in={subs.businesses || false} timeout="auto" unmountOnExit>
							<Link to="/ouroboros" onClick={menuOff}>
								<ListItemButton selected={location.pathname === '/ouroboros'}>
									<ListItemText primary="Ouroboros Coding" />
								</ListItemButton>
							</Link>
							<Link to="/servicesvp" onClick={menuOff}>
								<ListItemButton selected={location.pathname === '/servicesvp'}>
									<ListItemText primary="Service SVP" />
								</ListItemButton>
							</Link>
							<Link to="/devmedika" onClick={menuOff}>
								<ListItemButton selected={location.pathname === '/devmedika'}>
									<ListItemText primary="DevMedika" />
								</ListItemButton>
							</Link>
						</Collapse>

						<ListItemButton onClick={ev => subMenuToggle('ostools')}>
							<ListItemText primary="Open Source Tools" />
							{subs.types ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}
						</ListItemButton>
						<Collapse in={subs.ostools || false} timeout="auto" unmountOnExit>
							<Link to="/pylivedev" onClick={menuOff}>
								<ListItemButton selected={location.pathname === '/pylivedev'}>
									<ListItemText primary="PyLiveDev" />
								</ListItemButton>
							</Link>
							<Link to="/mds3" onClick={menuOff}>
								<ListItemButton selected={location.pathname === '/mds3'}>
									<ListItemText primary="mds3" />
								</ListItemButton>
							</Link>
						</Collapse>

						<ListItemButton onClick={ev => subMenuToggle('oslibs')}>
							<ListItemText primary="Open Source Libraries" />
							{subs.types ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}
						</ListItemButton>
						<Collapse in={subs.oslibs || false} timeout="auto" unmountOnExit>
							<Link to="/define" onClick={menuOff}>
								<ListItemButton selected={location.pathname === '/define'}>
									<ListItemText primary="Define" />
								</ListItemButton>
							</Link>
							<Link to="/define" onClick={menuOff}>
								<ListItemButton selected={location.pathname === '/define'}>
									<ListItemText primary="Body" />
								</ListItemButton>
							</Link>
							<Link to="/fulllist" onClick={menuOff}>
								<ListItemButton selected={location.pathname === '/fulllist'}>
									<ListItemText primary="Full List" />
								</ListItemButton>
							</Link>
						</Collapse>

						<Link to="/experience" onClick={menuOff}>
							<ListItemButton selected={location.pathname === '/experience'}>
								<ListItemText primary="Experience" />
							</ListItemButton>
						</Link>

						<Link to="/skills" onClick={menuOff}>
							<ListItemButton selected={location.pathname === '/skills'}>
								<ListItemText primary="Skills" />
							</ListItemButton>
						</Link>
					</List>
					<Box className="flexStatic footer">
						Version {process.env.REACT_APP_VERSION}
					</Box>
				</Box>
			</Drawer>
		</Box>
	);
}

// Valid props
Header.propTypes = { }