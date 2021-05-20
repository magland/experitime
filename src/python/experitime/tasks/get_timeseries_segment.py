import numpy as np
import hither2 as hi
import experitime
from ..backend import taskfunction
from experitime.config import job_cache, job_handler
from experitime.workspace_list import WorkspaceList

@hi.function('get_timeseries_segment', '0.2.6')
def get_timeseries_segment(timeseries_uri: str, channel_name: str, ds_factor: int, segment_num: int, segment_duration_sec: float):
    t1 = segment_num * segment_duration_sec
    t2 = (segment_num + 1) * segment_duration_sec
    x = experitime.Timeseries(timeseries_uri)
    timestamps, values = x.get_data(start=t1, end=t2, channels=[channel_name])
    values = values.ravel()
    if ds_factor > 1:
        N = len(timestamps)
        N2 = int(N / ds_factor)
        timestamps = timestamps[:N2 * ds_factor]
        values = values[:N2 * ds_factor]
        timestamps_reshaped = timestamps.reshape((N2, ds_factor))
        values_reshaped = values.reshape((N2, ds_factor))
        values_min = np.min(values_reshaped, axis=1)
        values_max = np.max(values_reshaped, axis=1)        
        values = np.zeros((N2 * 2,))
        values[0::2] = values_min
        values[1::2] = values_max
        timestamps = timestamps_reshaped[:, 0].ravel()
    return {
        'timestamps': timestamps.astype(np.float32),
        'values': values.astype(np.float32)
    }
    

@taskfunction('get_timeseries_segment.6')
def task_get_timeseries_segment(timeseries_uri, channel_name: str, ds_factor: int, segment_num: int, segment_duration_sec: float):
    with hi.Config(job_handler=job_handler.misc, job_cache=job_cache):
        return hi.Job(get_timeseries_segment, {'timeseries_uri': timeseries_uri, 'channel_name': channel_name, 'ds_factor': ds_factor, 'segment_num': segment_num, 'segment_duration_sec': segment_duration_sec})