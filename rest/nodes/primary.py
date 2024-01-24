# coding=utf8
""" Primary REST

Handles starting the REST server using the Primary service
"""

__author__		= "Chris Nasr"
__version__		= "1.0.0"
__copyright__	= "Ouroboros Coding Inc."
__email__		= "chris@ouroboroscoding.com"
__created__		= "2022-08-25"

# Ouroboros imports
from body import register_services, REST
from config import config
import record_mysql

# Project imports
from . import errors
from services.primary import Primary

def main():
	"""Main

	Starts the http REST server
	"""

	# Add the primary host
	record_mysql.add_host(config.mysql.primary({
		'charset': 'utf8',
		'host': 'localhost',
		'passwd': '',
		'port': 3306,
		'user': 'mysql'
	}))

	# Get the config
	dConf = config.primary({
		'verbose': False
	})

	# Init the service
	oPrimary = Primary()

	# Register the services
	oRest = register_services({ 'primary': oPrimary })

	# Get the primary conf
	dPrimary = oRest['primary']

	# Run the REST server with the Client instance
	REST(
		name = 'primary',
		instance = oPrimary,
		cors = config.body.rest.allowed(),
		lists = True,
		on_errors = errors,
		verbose = dConf['verbose']
	).run(
		host = dPrimary['host'],
		port = dPrimary['port'],
		workers = dPrimary['workers'],
		timeout = 'timeout' in dPrimary and \
			dPrimary['timeout'] or 30
	)

# Only run if called directly
if __name__ == '__main__':
	main()