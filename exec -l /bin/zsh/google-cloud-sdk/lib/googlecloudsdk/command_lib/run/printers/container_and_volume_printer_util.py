# -*- coding: utf-8 -*- #
# Copyright 2021 Google LLC. All Rights Reserved.
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

"""Contains shared methods for container and volume printing."""

import collections
import json
from typing import Mapping, Sequence

from googlecloudsdk.api_lib.run import container_resource
from googlecloudsdk.api_lib.run import k8s_object
from googlecloudsdk.api_lib.run import revision
from googlecloudsdk.command_lib.run.printers import k8s_object_printer_util as k8s_util
from googlecloudsdk.core.resource import custom_printer_base as cp


def _FormatSecretKeyRef(v):
  return '{}:{}'.format(v.secretKeyRef.name, v.secretKeyRef.key)


def _FormatSecretVolumeSource(v):
  if v.items:
    return '{}:{}'.format(v.secretName, v.items[0].key)
  else:
    return v.secretName


def _FormatConfigMapKeyRef(v):
  return '{}:{}'.format(v.configMapKeyRef.name, v.configMapKeyRef.key)


def _FormatConfigMapVolumeSource(v):
  if v.items:
    return '{}:{}'.format(v.name, v.items[0].key)
  else:
    return v.name


def GetContainer(
    container_name: str,
    container: container_resource.Container,
    gpu_type: str,
    labels: Mapping[str, str],
    dependencies: Sequence[str],
    annotations: Mapping[str, str],
    is_primary: bool,
) -> cp.Table:
  limits = GetLimits(container)
  return cp.Labeled([
      ('Image', container.image),
      ('Base Image', GetBaseImage(annotations, container_name)),
      ('Command', ' '.join(container.command)),
      ('Args', ' '.join(container.args)),
      (
          'Port',
          ' '.join(str(p.containerPort) for p in container.ports),
      ),
      ('Memory', limits['memory']),
      ('CPU', limits['cpu']),
      ('GPU', limits['nvidia.com/gpu']),
      ('GPU Type', gpu_type if limits['nvidia.com/gpu'] else None),
      (
          'Env vars',
          GetUserEnvironmentVariables(container),
      ),
      ('Volume Mounts', GetVolumeMounts(container)),
      ('Secrets', GetSecrets(container)),
      ('Config Maps', GetConfigMaps(container)),
      (
          'Startup Probe',
          k8s_util.GetStartupProbe(container, labels, is_primary),
      ),
      ('Liveness Probe', k8s_util.GetLivenessProbe(container)),
      ('Readiness Probe', k8s_util.GetReadinessProbe(container)),
      ('Container Dependencies', ', '.join(dependencies)),
  ])


def GetContainers(record: container_resource.ContainerResource) -> cp.Table:
  """Returns a formatted table of a resource's containers."""

  dependencies = collections.defaultdict(list, record.dependencies)
  gpu_type = None
  if k8s_object.GPU_TYPE_NODE_SELECTOR in record.node_selector:
    gpu_type = record.node_selector[k8s_object.GPU_TYPE_NODE_SELECTOR]

  def Containers():
    for name, container in k8s_util.OrderByKey(record.containers):
      key = 'Container {name}'.format(name=container.name)
      value = GetContainer(
          name,
          container,
          gpu_type,
          record.labels,
          dependencies[name],
          record.annotations,
          len(record.containers) == 1 or container.ports,
      )
      yield (key, value)

  return cp.Mapped(Containers())


def GetBaseImage(annotations: Mapping[str, str], container_name: str) -> str:
  if revision.BASE_IMAGES_ANNOTATION not in annotations:
    return ''
  container_name = container_name if container_name else ''
  base_images = json.loads(annotations.get(revision.BASE_IMAGES_ANNOTATION))
  return base_images.get(container_name, '')


def GetLimits(record):
  return collections.defaultdict(str, record.resource_limits)


def GetUserEnvironmentVariables(record):
  return cp.Mapped(k8s_util.OrderByKey(record.env_vars.literals))


def GetSecrets(container: container_resource.Container) -> cp.Table:
  """Returns a print mapping for env var and volume-mounted secrets."""
  secrets = {}
  secrets.update(
      {k: _FormatSecretKeyRef(v) for k, v in container.env_vars.secrets.items()}
  )
  secrets.update({
      k: _FormatSecretVolumeSource(v)
      for k, v in container.MountedVolumeJoin('secrets').items()
  })
  return cp.Mapped(k8s_util.OrderByKey(secrets))


def GetVolumeMounts(container: container_resource.Container) -> cp.Table:
  """Returns a print mapping for volumes."""
  volumes = {
      k: _FormatVolumeMount(*v)
      for k, v in container.NamedMountedVolumeJoin().items()
  }
  volumes = {k: v for k, v in volumes.items() if v}
  return cp.Mapped(k8s_util.OrderByKey(volumes))


def _FormatVolumeMount(name, volume):
  """Format details about a volume mount."""
  if not volume:
    return 'volume not found'
  if volume.emptyDir:
    return cp.Labeled([
        ('name', name),
        ('type', 'in-memory'),
    ])
  elif volume.nfs:
    return cp.Labeled([
        ('name', name),
        ('type', 'nfs'),
        ('location', '{}:{}'.format(volume.nfs.server, volume.nfs.path)),
    ])
  elif volume.csi:
    if volume.csi.driver == 'gcsfuse.run.googleapis.com':
      bucket = None
      for prop in volume.csi.volumeAttributes.additionalProperties:
        if prop.key == 'bucketName':
          bucket = prop.value
      return cp.Labeled(
          [('name', name), ('type', 'cloud-storage'), ('bucket', bucket)]
      )


def GetVolumes(record):
  """Returns a print mapping for volumes."""
  volumes = {v.name: _FormatVolume(v) for v in record.spec.volumes}
  volumes = {k: v for k, v in volumes.items() if v}
  return cp.Mapped(k8s_util.OrderByKey(volumes))


def _FormatVolume(volume):
  """Format a volume for the volumes list."""
  if volume.emptyDir:
    return cp.Labeled([
        ('type', 'in-memory'),
        ('size-limit', volume.emptyDir.sizeLimit),
    ])
  elif volume.nfs:
    return cp.Labeled([
        ('type', 'nfs'),
        ('location', '{}:{}'.format(volume.nfs.server, volume.nfs.path)),
        ('read-only', volume.nfs.readOnly),
    ])
  elif volume.csi:
    if volume.csi.driver == 'gcsfuse.run.googleapis.com':
      bucket = None
      mount_options = None
      for prop in volume.csi.volumeAttributes.additionalProperties:
        if prop.key == 'bucketName':
          bucket = prop.value
        if prop.key == 'mountOptions':
          mount_options_list = prop.value.split(',')
          mount_options = cp.Table(
              [tuple(opt.split('=', 1)) for opt in mount_options_list]
          )
      return cp.Labeled([
          ('type', 'cloud-storage'),
          ('bucket', bucket),
          ('read-only', volume.csi.readOnly),
          ('mount-options', mount_options),
      ])
    elif volume.csi.driver == 'cloudsql.run.googleapis.com':
      instances = None
      for prop in volume.csi.volumeAttributes.additionalProperties:
        if prop.key == 'instances':
          instances = prop.value
      return cp.Labeled([
          ('type', 'cloudsql'),
          ('instances', instances),
      ])


def GetConfigMaps(container: container_resource.Container) -> cp.Table:
  """Returns a print mapping for env var and volume-mounted config maps."""
  config_maps = {}
  config_maps.update({
      k: _FormatConfigMapKeyRef(v)
      for k, v in container.env_vars.config_maps.items()
  })
  config_maps.update({
      k: _FormatConfigMapVolumeSource(v)
      for k, v in container.MountedVolumeJoin('config_maps').items()
  })
  return cp.Mapped(k8s_util.OrderByKey(config_maps))
