To add an experiment to this workspace, run a Python script on the computer running the backend provider.

Here is an example script that generates an experiment

```python
import math
import numpy as np
import experitime

# Define a timeseries
timestamps = np.array(np.arange(20000))
n = len(timestamps)
values = np.zeros((n, 2))
values[:, 0] = np.cos(timestamps / 100 * (2 * math.pi)) + np.random.normal(0, 1, timestamps.shape) * 0.2
values[:, 1] = np.sin(timestamps / 100 * (2 * math.pi)) + np.random.normal(0, 1, timestamps.shape) * 0.2
channel_names = ['x', 'y']
timeseries = experitime.Timeseries.from_numpy(channel_names=channel_names, timestamps=timestamps, values=values, type='continuous')

# Define a new experiment and add the timeseries
E = experitime.Experiment('experiment1')
E.add_timeseries('example_timeseries', timeseries)

# Load the workspace and add the experiment
W = experitime.load_workspace('{workspaceUri}')
W.add_experiment(E)
```
