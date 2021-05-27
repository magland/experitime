import hither2 as hi
import kachery_p2p as kp
import experitime
from ..backend import taskfunction
from experitime.config import job_cache, job_handler
from experitime.workspace_list import WorkspaceList

@hi.function('get_experiment_info', '0.1.13')
def get_experiment_info(experiment_uri: str):
    experiment_object = kp.load_json(experiment_uri)
    if not experiment_object:
        raise Exception(f'Unable to load object: {experiment_object}')
    E = experitime.Experiment.deserialize(experiment_object, label='')
    ret = {
        'timeseries': {}
    }
    for name in E.timeseries_names:
        t = E.get_timeseries(name)
        object = t.serialize()
        ret['timeseries'][name] = {
            'uri': kp.store_json(object),
            'object': object,
            'channelProperties': t.channel_properties,
            'channelNames': t.channel_names,
            'numSamples': t.num_samples,
            'startTime': t.start_time,
            'samplingFrequency': t.sampling_frequency,
            'endTime': t.end_time,
            'type': t.type
        }
    return ret

@taskfunction('get_experiment_info.13')
def task_get_experiment_info(experiment_uri: str):
    with hi.Config(job_handler=job_handler.misc, job_cache=job_cache):
        return hi.Job(get_experiment_info, {'experiment_uri': experiment_uri})