To add an experiment to this workspace, run a Python script on the computer running the backend provider.

## Using numpy arrays

Here is an example script that generates an experiment with a multi-channel continuous timeseries

```python
import math
import numpy as np
import experitime

workspace_uri = '{workspaceUri}'
experiment_name = 'example-experiment'

# Define a timeseries
sampling_frequency_hz = 30000
duration_sec = 10
num_channels = 8
num_samples = math.floor(duration_sec * sampling_frequency_hz)
timestamps = np.array(np.arange(num_samples)) / sampling_frequency_hz
values = np.zeros((num_samples, num_channels), dtype=np.float32)
for c in range(1, num_channels + 1):
    cos_freq_hz = c
    values[:, c - 1] = np.cos(timestamps * cos_freq_hz * (2 * math.pi)) + np.random.normal(0, 1, timestamps.shape) * 0.2
channel_names = [str(c) for c in range(1, num_channels + 1)]
timeseries = experitime.Timeseries.from_numpy(channel_names=channel_names, timestamps=timestamps, values=values, type='continuous')

# Define a new experiment and add the timeseries
E = experitime.Experiment(experiment_name)
E.add_timeseries('example_timeseries', timeseries)

# Load the workspace and add the experiment
W = experitime.load_workspace(workspace_uri)
W.add_experiment(E)
```

## Using SpikeInterface

To import a timeseries from a SpikeInterface recording

```python
import experitime
import spikeextractors as se

workspace_uri = '{workspaceUri}'
experiment_name = 'spikeinterface-example-experiment'

# generate a spikeinterface recording
recording, sorting_true = se.example_datasets.toy_example(duration=60, num_channels=12)

# create a timeseries
timeseries = experitime.Timeseries.from_spikeinterface_recording(recording)

# Define a new experiment and add the recording
E = experitime.Experiment(experiment_name)
E.add_timeseries('spikeinterface-recording', timeseries)

# Load the workspace and add the experiment
W = experitime.load_workspace(workspace_uri)
W.add_experiment(E)
```

## Spike trains

To import discrete spike trains from a SpikeInterface recording/sorting pair

```python
import numpy as np
import experitime
import spikeextractors as se

workspace_uri = '{workspaceUri}'
experiment_name = 'spike-trains-example-experiment'

# generate a spikeinterface recording
recording, sorting_true = se.example_datasets.toy_example(duration=60, num_channels=12)

# create a timeseries
timeseries = experitime.Timeseries.from_spikeinterface_recording(recording)

# Define a new experiment and add the recording
E = experitime.Experiment(experiment_name)
E.add_timeseries('ephys-recording', timeseries)

# Add the spike trains to the experiment
for uid in sorting_true.get_unit_ids():
    spike_train = sorting_true.get_unit_spike_train(unit_id=uid)
    timestamps = spike_train.astype(np.float32) / recording.get_sampling_frequency()
    spike_train_timeseries = experitime.Timeseries.from_numpy(
        channel_names=['spiketrain'],
        timestamps=timestamps,
        values=np.ones((len(timestamps), 1),
        dtype=np.int16),
        type='discrete'
    )
    E.add_timeseries(f'unit-{uid}', spike_train_timeseries)

# Load the workspace and add the experiment
W = experitime.load_workspace(workspace_uri)
W.add_experiment(E)
```

## Using NWB

To import a timeseries from an NWB file (not working quite yet)

```python
# Note: this does not work quite yet
import experitime
import spikeextractors as se

workspace_uri = '{workspaceUri}'
experiment_name = 'nwb-example-experiment'

# create a timeseries using nwb file
timeseries = experitime.Timeseries.from_nwb('sha1://.../file.nwb')

# Define a new experiment and add the recording
E = experitime.Experiment(experiment_name)
E.add_timeseries('nwb-recording', timeseries)

# Load the workspace and add the experiment
W = experitime.load_workspace(workspace_uri)
W.add_experiment(E)
```