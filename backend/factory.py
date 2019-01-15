import os
from imp import load_source
from flask import Flask, session, jsonify, request, g, render_template


# todo: add headers.append('Accept', 'application/json'); to things so this works
def request_wants_json():
    best = request.accept_mimetypes \
        .best_match(['application/json', 'text/html'])
    return best == 'application/json' and \
        request.accept_mimetypes[best] > \
        request.accept_mimetypes['text/html']


def create_app(name='app', config='Config', settings=None, default_celery=False):
    from models import db
    from plugins.cache import cache

    settings = settings or {}
    flask_app = Flask(name)
    conf = load_source('conf', 'flask.cfg')
    flask_app.config.from_object(getattr(conf, config))
    flask_app.config.update(**settings)
    db.init_app(flask_app)
    cache.init_app(flask_app, config={'CACHE_KEY_PREFIX': flask_app.config.get('FLASK_CACHE_KEY_PREFIX')})

    ##########################################
    #                 PER REQ                #
    ##########################################

    @flask_app.route("/")
    @flask_app.route("/index")
    def index():
        return render_template("index.html")

    @flask_app.route("/hello")
    def hello():
        from helpers.user import signed_in
        from util import success_dict
        return jsonify(success_dict('Hello world, you are %slogged in' % ('' if signed_in() else 'not ')))

    @flask_app.before_first_request
    def before_first_req():
        from models import db
        db.session.execute("SELECT 1")

    @flask_app.errorhandler(500)
    def server_error(err):
        return render_template('500.html', err=err), 500

    @flask_app.route('/robots.txt')
    def robots():
        return ""

    return flask_app


def register_blueprints(flask_app):
    from api.user import login_blueprint

    blueprints = [login_blueprint]

    for blueprint in blueprints:
        flask_app.register_blueprint(blueprint)
