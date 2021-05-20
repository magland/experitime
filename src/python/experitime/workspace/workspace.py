from typing import Any, Dict, List, Union
import uuid
import kachery_p2p as kp
from ..experiment import Experiment
from kachery_p2p import main

def parse_workspace_uri(workspace_uri: str):
    if not workspace_uri.startswith('workspace://'):
        raise Exception(f'Invalid workspace uri: {workspace_uri}')
    if '?' not in workspace_uri:
        workspace_uri = workspace_uri + '?'
    params = {}
    ind = workspace_uri.index('?')
    feed_id = workspace_uri[:ind].split('/')[2]
    query_string = workspace_uri[ind+1:]
    return feed_id, query_string

class Workspace:
    def __init__(self, *, workspace_uri: str) -> None:
        feed_id, query_string = parse_workspace_uri(workspace_uri)
        self._query_string = query_string
        self._feed = kp.load_feed(f'feed://{feed_id}')
        self._experiments: Dict[str, Experiment] = {}
        self._load_experiments()
    @property
    def uri(self):
        q = f'?{self._query_string}' if self._query_string else ''
        return f'workspace://{self._feed.get_feed_id()}{q}'
    @property
    def feed_uri(self):
        return self._feed.get_uri()
    @property
    def feed_id(self):
        return self._feed.get_feed_id()
    @property
    def feed(self):
        return self._feed
    @property
    def label(self):
        p = _query_string_to_dict(self._query_string)
        return p.get('label', '')
    def set_label(self, label: str):
        p = _query_string_to_dict(self._query_string)
        if label:
            p['label'] = label
        else:
            if 'label' in p:
                del p['label']
        self._query_string = _dict_to_query_string(p)
    def add_experiment(self, experiment: Experiment):
        experiment_id = 'E-' + _random_id()
        if experiment_id in self._experiments:
            raise Exception(f'Duplicate experiment ID: {experiment_id}')
        experiment_uri = kp.store_json(experiment.serialize())
        main_subfeed = self._feed.get_subfeed('main')
        main_subfeed.append_message({
            'action': {
                'type': 'addExperiment',
                'experimentId': experiment_id,
                'label': experiment.label,
                'uri': experiment_uri
            }
        })
        self._experiments[experiment_id] = experiment
        return experiment_id
    def _load_experiments(self):
        main_subfeed = self._feed.get_subfeed('main')
        main_subfeed.get_next_messages() # load them all
        main_subfeed.set_position(0)
        while True:
            msg = main_subfeed.get_next_message(wait_msec=0)
            if msg is None: break
            if 'action' in msg:
                a = msg['action']
                if a.get('type') == 'addExperiment':
                    uri = a['uri']
                    eid = a['experimentId']
                    elabel = a['label']
                    if uri and eid:
                        try:
                            obj = kp.load_json(uri)
                            if obj is not None:
                                self._experiments[eid] = Experiment.deserialize(obj, label=elabel)
                            else:
                                raise Exception(f'Unable to load: {uri}')
                        except Exception as e:
                            print(f'WARNING: problem loading experiment: {str(e)}')

def create_workspace(*, label: Union[str, None]=None):
    feed = kp.create_feed()
    feed_id = feed.get_feed_id()
    workspace_uri = f'workspace://{feed_id}'
    W = load_workspace(workspace_uri)
    if label:
        W.set_label(label)
    return W

def load_workspace(workspace_uri: Union[str, Any]):
    if not isinstance(workspace_uri, str):
        raise Exception('Invalid workspace URI')
    return Workspace(workspace_uri=workspace_uri)

def _query_string_to_dict(q: str):
    ret: Dict[str, str] = {}
    for pstr in q.split('&'):
        vals = pstr.split('=')
        if len(vals) == 2:
            ret[vals[0]] = vals[1]
    return ret

def _dict_to_query_string(x: Dict[str, str]):
    ret = ''
    for k, v in x.items():
        if ret != '':
            ret = ret + '&'
        ret = ret + f'{k}={v}'
    return ret

def _random_id():
    return str(uuid.uuid4())[-12:]

# jinjaroot synctool exclude