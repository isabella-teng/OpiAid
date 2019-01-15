from inspect import currentframe, getframeinfo
import sys


# prints location (line of code + file) where this was called from
def print_loc(*msgs, msg=None, flush=False, origin_f=None):
    frameinfo = getframeinfo((origin_f or currentframe()).f_back)
    msg = ' '.join(str(x) for x in msgs) + (' %s' % msg if msg else '')
    message = "LOG %s: %s" % (frameinfo.filename, frameinfo.lineno)
    message += " | %s" % msg if msg else ''
    try:
        print(message, file=sys.stderr)
        if flush:
            sys.stderr.flush()
    except BlockingIOError as e:
        return
