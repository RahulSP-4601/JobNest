# -*- coding: utf-8 -*- #
# Copyright 2023 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Utilities for constructing CloudQuotas API messages."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

import re

from googlecloudsdk.calliope import exceptions


def _ValidateContainer(container_type, flag_value):
  if not re.match('^[a-z0-9-:]+$', flag_value):
    raise exceptions.InvalidArgumentException(container_type, flag_value)


def CreateConsumer(project, folder, organization):
  if project:
    _ValidateContainer('project', project)
    return 'projects/' + project
  if folder:
    _ValidateContainer('folder', folder)
    return 'folders/' + folder
  if organization:
    _ValidateContainer('organization', organization)
    return 'organizations/' + organization
  return None


def CreateProjectConsumer(project):
  _ValidateContainer('project', project)
  return 'projects/' + project
