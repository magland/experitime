from typing import Dict, List
from ..timeseries import Timeseries


class Experiment:
    def __init__(self, label: str):
        self._timeseries: Dict[str, Timeseries] = {}
        self._label = label
    def add_timeseries(self, name: str, x: Timeseries):
        self._timeseries[name] = x
    def serialize(self):
        ret = {'timeseries': {}}
        for k, v in self._timeseries.items():
            ret['timeseries'][k] = self._timeseries[k].serialize()
        return ret
    @property
    def label(self):
        return self._label
    @property
    def timeseries_names(self):
        return sorted(list(self._timeseries.keys()))
    def get_timeseries(self, name: str):
        return self._timeseries[name]
    @staticmethod
    def deserialize(x: dict, *, label: str):
        E = Experiment(label=label)
        for k, v in x.get('timeseries', {}).items():
            E.add_timeseries(k, Timeseries(v))
        return E