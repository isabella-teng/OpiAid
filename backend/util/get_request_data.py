import json
from flask import request
from werkzeug.exceptions import BadRequest


def get_request_data():
    from util import print_loc

    # handle both application/x-www-form-urlencoded and application/json
    # https://stackoverflow.com/questions/29753002/getting-post-parameters-on-both-form-and-json-format
    if request.is_json:
        try:
            return request.get_json()
        except (TypeError, BadRequest, KeyError):
            print_loc("invalid JSON")
    # This flattens the request.form multidict, meaning keys with multiple values will just return the first
    multi_dict = request.args if request.method == 'GET' else request.form
    data = multi_dict.to_dict()
    return json.loads(data.get('multiform_data')) if data.get('multiform_data') else data
