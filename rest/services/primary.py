# coding=utf8
""" Primary Service

Handles all primary requests
"""

__author__		= "Chris Nasr"
__copyright__	= "Ouroboros Coding Inc."
__email__		= "chris@ouroboroscoding.com"
__created__		= "2024-01-23"

# Ouroboros imports
from body import Error, errors, Response, Service
from jobject import jobject
from record.exceptions import RecordDuplicate
from tools import evaluate, without

# Python imports
from operator import itemgetter

# Import records
from records import experience, skill, skill_category

REPLACE_ME = '00000000-0000-0000-0000-000000000000'

class Primary(Service):
	"""Primary Service class

	Service for authorization, sign in, sign up, permissions etc.

	Extends:
		body.Service
	"""

	def __init__(self):
		"""Primary

		Constructs the object

		Returns:
			Primary
		"""
		pass

	def reset(self):
		"""Reset

		Resets the config

		Returns:
			Primary
		"""
		return self

	def experience_create(self, req: jobject) -> Response:
		"""Experience (create)

		Creates a new experience in the system

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# If we are missing the record
		if 'record' not in req.data:
			return Error(errors.DATA_FIELDS, [ [ 'record', 'missing' ] ])

		# If the record is not a dict
		if not isinstance(req.data.record, dict):
			return Error(errors.DATA_FIELDS, [ [ 'record', 'invalid' ] ])

		# Create and validate the record
		try:
			sID = experience.Experience.add(
				req.data.record,
				revision_info = { 'user': REPLACE_ME }
			)
		except ValueError as e:
			return Error(errors.DATA_FIELDS, e.args)
		except RecordDuplicate as e:
			return Error(errors.DB_DUPLICATE, e.args)

		# Return the result
		return Response(sID)

	def experience_delete(self, req: jobject) -> Response:
		"""Experience (delete)

		Deletes an existing experience from the system

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Check the ID
		if '_id' not in req.data:
			return Error(errors.DATA_FIELDS, [ [ '_id', 'missing' ] ])

		# If the experience doesn't exist
		if not experience.Experience.exists(req.data._id):
			return Error(errors.DB_NO_RECORD, [ req.data._id, 'experience' ])

		# Delete the record
		dRes = experience.Experience.remove(
			req.data._id,
			revision_info = { 'user': REPLACE_ME }
		)

		# If nothing was deleted
		if dRes == None:
			return Error(
				errors.DB_DELETE_FAILED,
				[ req.data._id, 'experience' ]
			)

		# Return OK
		return Response(dRes)

	def experience_read(self, req: jobject) -> Response:
		"""Experience (read)

		Fetches and returns an existing experience

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Check for ID
		if '_id' not in req.data:
			return Error(errors.DATA_FIELDS, [ [ '_id', 'missing' ] ])

		# Fetch the record
		dExperience = experience.Experience.get(req.data._id, raw = True)
		if not dExperience:
			return Error(
				errors.DB_NO_RECORD,
				[ req.data._id, 'experience' ]
			)

		# Return the record
		return Response(dExperience)

	def experience_update(self, req: jobject) -> Response:
		"""Experience (update)

		Updates an existing experience

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Check minimum fields
		try: evaluate(req.data, [ '_id', 'record' ])
		except ValueError as e:
			return Error(
				errors.DATA_FIELDS, [ [ k, 'missing' ] for k in e.args ])

		# If the record is not a dict
		if not isinstance(req.data.record, dict):
			return Error(errors.DATA_FIELDS, [ [ 'record', 'invalid' ] ])

		# Find the experience category
		oExperience = experience.Experience.get(req.data._id)
		if not oExperience:
			return Error(
				errors.DB_NO_RECORD,
				[ req.data._id, 'experience' ]
			)

		# Remove any fields found that can't be altered by the user
		without(
			req.data.record,
			[ '_id', '_created', '_updated' ],
			True
		)

		# Update it using the record data sent
		try:
			dChanges = oExperience.update(req.data.record)
		except RecordDuplicate as e:
			return Error(errors.DB_DUPLICATE, e.args)

		# Test if the updates are valid
		if not oExperience.valid():
			return Error(errors.DATA_FIELDS, o.errors)

		# Save the record and store the result
		bRes = oExperience.save(revision_info = { 'user' : REPLACE_ME })

		# Return the changes or False
		return Response(bRes and dChanges or False)

	def experiences_read(self, req: jobject) -> Response:
		"""Experiences (read)

		Fetches and returns all existing experiences

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Request the records
		lSkills = skill.SkillCategory.get(raw = True)

		# Sort them by name
		lSkills.sort(key = itemgetter('name'))

		# Find and return the experiences
		return Response(lSkills)

	def skill_create(self, req: jobject) -> Response:
		"""Skill (create)

		Creates a new skill category in the system

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# If we are missing the record
		if 'record' not in req.data:
			return Error(errors.DATA_FIELDS, [ [ 'record', 'missing' ] ])

		# If the record is not a dict
		if not isinstance(req.data.record, dict):
			return Error(errors.DATA_FIELDS, [ [ 'record', 'invalid' ] ])

		# Create and validate the record
		try:
			sID = skill.Skill.add(
				req.data.record,
				revision_info = { 'user': REPLACE_ME }
			)
		except ValueError as e:
			return Error(errors.DATA_FIELDS, e.args)
		except RecordDuplicate as e:
			return Error(errors.DB_DUPLICATE, e.args)

		# Return the result
		return Response(sID)

	def skill_delete(self, req: jobject) -> Response:
		"""Skill (delete)

		Deletes an existing skill from the system

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Check the ID
		if '_id' not in req.data:
			return Error(errors.DATA_FIELDS, [ [ '_id', 'missing' ] ])

		# If the skill doesn't exist
		if not skill.Skill.exists(req.data._id):
			return Error(errors.DB_NO_RECORD, [ req.data._id, 'skill' ])

		# Delete the record
		dRes = skill.Skill.remove(
			req.data._id,
			revision_info = { 'user': REPLACE_ME }
		)

		# If nothing was deleted
		if dRes == None:
			return Error(
				errors.DB_DELETE_FAILED,
				[ req.data._id, 'skill' ]
			)

		# Return OK
		return Response(dRes)

	def skill_read(self, req: jobject) -> Response:
		"""Skill (read)

		Fetches and returns an existing skill

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Check for ID
		if '_id' not in req.data:
			return Error(errors.DATA_FIELDS, [ [ '_id', 'missing' ] ])

		# Fetch the record
		dSkill = skill.Skill.get(req.data._id, raw = True)
		if not dSkill:
			return Error(
				errors.DB_NO_RECORD,
				[ req.data._id, 'skill' ]
			)

		# Return the record
		return Response(dSkill)

	def skill_update(self, req: jobject) -> Response:
		"""Skill (update)

		Updates an existing skill

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Check minimum fields
		try: evaluate(req.data, [ '_id', 'record' ])
		except ValueError as e:
			return Error(
				errors.DATA_FIELDS, [ [ k, 'missing' ] for k in e.args ])

		# If the record is not a dict
		if not isinstance(req.data.record, dict):
			return Error(errors.DATA_FIELDS, [ [ 'record', 'invalid' ] ])

		# Find the skill category
		oSkill = skill.Skill.get(req.data._id)
		if not oSkill:
			return Error(
				errors.DB_NO_RECORD,
				[ req.data._id, 'skill' ]
			)

		# Remove any fields found that can't be altered by the user
		without(
			req.data.record,
			[ '_id', '_created', '_updated' ],
			True
		)

		# Update it using the record data sent
		try:
			dChanges = oSkill.update(req.data.record)
		except RecordDuplicate as e:
			return Error(errors.DB_DUPLICATE, e.args)

		# Test if the updates are valid
		if not oSkill.valid():
			return Error(errors.DATA_FIELDS, o.errors)

		# Save the record and store the result
		bRes = oSkill.save(revision_info = { 'user' : REPLACE_ME })

		# Return the changes or False
		return Response(bRes and dChanges or False)

	def skills_read(self, req: jobject) -> Response:
		"""Skills (read)

		Fetches and returns all existing skills

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Request the records
		lSkills = skill.SkillCategory.get(raw = True)

		# Sort them by name
		lSkills.sort(key = itemgetter('name'))

		# Find and return the skills
		return Response(lSkills)

	def skill_categories_read(self, req: jobject) -> Response:
		"""Skill Categories (read)

		Fetches and returns all existing skill categories

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Request the records
		lCategories = skill_category.SkillCategory.get(raw = True)

		# Sort them by name
		lCategories.sort(key = itemgetter('name'))

		# Find and return the categories
		return Response(lCategories)

	def skill_category_create(self, req: jobject) -> Response:
		"""Skill Category (create)

		Creates a new skill category in the system

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# If we are missing the record
		if 'record' not in req.data:
			return Error(errors.DATA_FIELDS, [ [ 'record', 'missing' ] ])

		# If the record is not a dict
		if not isinstance(req.data.record, dict):
			return Error(errors.DATA_FIELDS, [ [ 'record', 'invalid' ] ])

		# Create and validate the record
		try:
			sID = skill_category.SkillCategory.add(
				req.data.record,
				revision_info = { 'user': REPLACE_ME }
			)
		except ValueError as e:
			return Error(errors.DATA_FIELDS, e.args)
		except RecordDuplicate as e:
			return Error(errors.DB_DUPLICATE, e.args)

		# Return the result
		return Response(sID)

	def skill_category_delete(self, req: jobject) -> Response:
		"""Skill Category (delete)

		Deletes an existing skill category from the system

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Check the ID
		if '_id' not in req.data:
			return Error(errors.DATA_FIELDS, [ [ '_id', 'missing' ] ])

		# If the skill category doesn't exist
		if not skill_category.SkillCategory.exists(req.data._id):
			return Error(errors.DB_NO_RECORD, [ req.data._id, 'skill_category' ])

		# If there are existing skills with the skill category
		lSkills = skill.Skill.filter({
			'category': req.data._id
		}, raw = [ '_id' ] )
		if lSkills:
			return Error(
				errors.DB_REFERENCES,
				[ req.data.skill_category, 'skill_category', 'skill' ]
			)

		# Delete the record
		dRes = skill_category.SkillCategory.remove(
			req.data._id,
			revision_info = { 'user': REPLACE_ME }
		)

		# If nothing was deleted
		if dRes == None:
			return Error(
				errors.DB_DELETE_FAILED,
				[ req.data._id, 'sill_category' ]
			)

		# Return OK
		return Response(dRes)

	def skill_category_read(self, req: jobject) -> Response:
		"""Skill Category (read)

		Fetches and returns an existing skill category

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Check for ID
		if '_id' not in req.data:
			return Error(errors.DATA_FIELDS, [ [ '_id', 'missing' ] ])

		# Fetch the record
		dCategory = skill_category.SkillCategory.get(req.data._id, raw = True)
		if not dCategory:
			return Error(
				errors.DB_NO_RECORD,
				[ req.data._id, 'skill_category' ]
			)

		# Return the record
		return Response(dCategory)

	def skill_category_update(self, req: jobject) -> Response:
		"""Skill Category (update)

		Updates an existing skill category

		Arguments:
			req (jobject): Contains data and session if available

		Returns:
			Services.Response
		"""

		# Check minimum fields
		try: evaluate(req.data, [ '_id', 'record' ])
		except ValueError as e:
			return Error(
				errors.DATA_FIELDS, [ [ k, 'missing' ] for k in e.args ])

		# If the record is not a dict
		if not isinstance(req.data.record, dict):
			return Error(errors.DATA_FIELDS, [ [ 'record', 'invalid' ] ])

		# Find the skill category
		oCategory = skill_category.SkillCategory.get(req.data._id)
		if not oCategory:
			return Error(
				errors.DB_NO_RECORD,
				[ req.data._id, 'skill_category' ]
			)

		# Remove any fields found that can't be altered by the user
		without(
			req.data.record,
			[ '_id', '_created', '_updated' ],
			True
		)

		# Update it using the record data sent
		try:
			dChanges = oCategory.update(req.data.record)
		except RecordDuplicate as e:
			return Error(errors.DB_DUPLICATE, e.args)

		# Test if the updates are valid
		if not oCategory.valid():
			return Error(errors.DATA_FIELDS, oCategory.errors)

		# Save the record and store the result
		bRes = oCategory.save(revision_info = { 'user' : REPLACE_ME })

		# Return the changes or False
		return Response(bRes and dChanges or False)