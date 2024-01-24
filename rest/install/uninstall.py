# coding=utf8
""" Records

Installs the database and tables required by the record instances
"""

__author__		= "Chris Nasr"
__version__		= "1.0.0"
__maintainer__	= "Chris Nasr"
__email__		= "chris@ouroboroscoding.com"
__created__		= "2024-01-23"

# Ouroboros imports
from config import config
import record_mysql
import record_redis

# Records
from records import experience, skill, skill_category

# Only run if called directly
if __name__ == '__main__':

	# Add the "_" host
	record_mysql.add_host(config.mysql.primary({
		'charset': 'utf8',
		'host': 'localhost',
		'passwd': '',
		'port': 3306,
		'user': 'mysql'
	}))

	# Delete the User table
	experience.Experience.uninstall()
	skill.Skill.uninstall()
	skill_category.SkillCategory.uninstall()

	# Add the DB
	record_mysql.db_drop(
		config.mysql.db('chrisnasr')
	)