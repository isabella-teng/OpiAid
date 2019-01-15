def _status_dict(status=None, message=None, data=None):
    return {'status': status, 'message': message, 'data': data}


def fail_dict(msg=None, data=None):
    return _status_dict(status='fail', message=msg, data=data)


def success_dict(msg=None, data=None):
    return _status_dict(status='success', message=msg, data=data)
