def limit_length(text, length):
    if text is None:
        return None
    text = text.__str__()
    if len(text) <= length:
        return text
    # doesn't handle length < 3, should it?
    return "%s..." % text[0:length-3]


def safe_strip(s):
    return s.strip() if s and isinstance(s, str) else s
