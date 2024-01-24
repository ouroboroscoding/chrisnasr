# coding=utf8
""" Skill Record

Handles the skill record structure
"""

__author__		= "Chris Nasr"
__version__		= "1.0.0"
__maintainer__	= "Chris Nasr"
__email__		= "chris@ouroboroscoding.com"
__created__		= "2024-01-23"

# Ouroboros imports
from config import config
import jsonb
from record_mysql import Storage
import record_redis # to enable redis cache

# Python imports
from pathlib import Path

# Create the Storage instance
Skill = Storage(

	# The primary definition
	jsonb.load(
		'%s/definitions/skill.json' % \
			Path(__file__).parent.parent.resolve()
	),

	# The extensions necessary to store the data and revisions in MySQL
	{
		# Cache related
		'__cache__': {
			'implementation': 'redis',
			'redis': config.records.cache({
				'name': 'records',
				'ttl': 0
			})
		},

		# Table related
		'__mysql__': {
			'charset': 'utf8mb4',
			'collate': 'utf8mb4_unicode_ci',
			'create': [
				'_created', '_updated', 'category', '_order', 'name', 'level',
				'years'
			],
			'db': config.mysql.db('chrisnasr'),
			'indexes': {
				'ui_name': {
					'fields': 'name',
					'type': 'unique'
				}
			},
			'name': 'skill',
			'revisions': [ 'user' ]
		},

		# Field related
		'_created': { '__mysql__': {
			'opts': 'not null default CURRENT_TIMESTAMP'
		} },
		'_updated': { '__mysql__': {
			'opts': 'not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'
		} },
		'_order': { '__mysql__': {
			"type": "tinyint unsigned"
		} },
		'level': { '__mysql__': {
			'type': 'tinyint(1) unsigned'
		} },
		'years': { '__mysql__': {
			'type': 'tinyint unsigned'
		} }
	}
)