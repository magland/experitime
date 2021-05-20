from typing import List, Literal, Union, cast
import numpy as np
import kachery_p2p as kp
from numpy.core.numeric import Infinity
from .TimeseriesModelNpyV1 import TimeseriesModelNpyV1

class Timeseries:
    def __init__(self, arg: Union[dict, str]):
        if isinstance(arg, str):
            x = kp.load_json(arg)
            if not x:
                raise Exception(f'Unable to load: {arg}')
            arg = cast(dict, x)
        self._model = _load_model(arg)
        self._arg = arg
    @property
    def channel_names(self):
        return self._model.channel_names
    @property
    def num_samples(self):
        return self._model.num_samples
    @property
    def num_channels(self):
        return len(self._model.channel_names)
    @property
    def start_time(self):
        return self._model.start_time
    @property
    def end_time(self):
        return self._model.end_time
    @property
    def type(self) -> Union[Literal['continuous'], Literal['discrete']]:
        return self._model.type
    def serialize(self):
        return self._arg
    def get_data(self, start: Union[None, float]=None, end: Union[None, float]=None, channels: Union[None, List[str]]=None):
        if start is None:
            start = -Infinity
        if end is None:
            end = Infinity
        if channels is None:
            channel_inds = range(self.num_channels)
        else:
            channel_inds = [self.channel_names.index(ch) for ch in channels]
        return self._model.get_data(start=start, end=end, channel_inds=channel_inds)
    @property
    def sampling_frequency(self):
        return self._model.sampling_frequency
    @staticmethod
    def from_numpy(*, channel_names: List[str], timestamps: np.ndarray, values: np.ndarray, type: Union[Literal['continuous'], Literal['discrete']]):
        return Timeseries({
            'timeseries_format': 'npy_v1',
            'data': {
                'channel_names': channel_names,
                'timestamps_uri': kp.store_npy(timestamps),
                'values_uri': kp.store_npy(values),
                'type': type
            }
        })

def _load_model(arg: dict):
    format = arg.get('timeseries_format')
    data = arg.get('data', {})
    if format == 'npy_v1':
        return TimeseriesModelNpyV1(**data)
    else:
        raise Exception(f'Unexpected timeseries format: {format}')
