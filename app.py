from flask import Flask, request, json, abort, jsonify, render_template
from leaderboard import Leaderboard
from collections import defaultdict
from datetime import datetime
import requests as rq
import json

app = Flask(__name__)
app.config["DEBUG"] = True

# user_repos = json.load(open("user_repos.json"))
user_repos = json.load(open("dumps/user_repos_1.json"))
repos = json.load(open("dumps/repos.json"))
data = json.load(open("dumps/data.json"))

@app.route("/")
def heatmap():
    updated_at__gte = request.args.get("updated_at__gte")
    updated_at__lte = request.args.get("updated_at__lte")
    created_at__gte = request.args.get("created_at__gte")
    created_at__lte = request.args.get("created_at__lte")

    filtered_items = user_repos

    if updated_at__lte:
        val = datetime.strptime(updated_at__lte, '%Y-%m-%d')
        filtered_items = {key: [item for item in values if item.get('updated_at') is not None and val > datetime.strptime(item.get('updated_at'), "%Y-%m-%dT%H:%M:%SZ")] for key, values in filtered_items.items() }
        filtered_items = {key: values for key, values in filtered_items.items() if len(values) > 0 }
    
    if updated_at__gte:
        val = datetime.strptime(updated_at__gte, '%Y-%m-%d')
        filtered_items = {key: [item for item in values if item.get('updated_at') is not None and val < datetime.strptime(item.get('updated_at'), "%Y-%m-%dT%H:%M:%SZ")] for key, values in filtered_items.items() }
        filtered_items = {key: values for key, values in filtered_items.items() if len(values) > 0 }

    if created_at__lte:
        val = datetime.strptime(created_at__lte, '%Y-%m-%d')
        filtered_items = {key: [item for item in values if item.get('created_at') is not None and val > datetime.strptime(item.get('created_at'), "%Y-%m-%dT%H:%M:%SZ")] for key, values in filtered_items.items() }
        filtered_items = {key: values for key, values in filtered_items.items() if len(values) > 0 }
    
    if created_at__gte:
        val = datetime.strptime(created_at__gte, '%Y-%m-%d')
        filtered_items = {key: [item for item in values if item.get('created_at') is not None and val < datetime.strptime(item.get('created_at'), "%Y-%m-%dT%H:%M:%SZ")] for key, values in filtered_items.items() }
        filtered_items = {key: values for key, values in filtered_items.items() if len(values) > 0 }

    return render_template(
        "heatmap.html",
        user_repos=filtered_items,
        created_at__gte=created_at__gte if created_at__gte else "",
        created_at__lte=created_at__lte if created_at__lte else "",
        updated_at__gte=updated_at__gte if updated_at__gte else "",
        updated_at__lte=updated_at__lte if updated_at__lte else "",
    )

@app.route("/semester/<string:semester>")
def heatmap_semester(semester):
    semester_data = {'22W': ["1990Flori", "AKHILB007"], '22S': ["Aleksar05", "Alexandra18636"]} # Make this importable from a file
    users = semester_data[semester]

    return render_template(
        "heatmap_semester.html",
        user_repos = {user:user_repos[user] for user in users},
        semester = semester
    )




@app.route("/updates")
def updates():

    updated_at__gte = request.args.get("updated_at__gte")
    updated_at__lte = request.args.get("updated_at__lte")
    created_at__gte = request.args.get("created_at__gte")
    created_at__lte = request.args.get("created_at__lte")

    filtered_items = repos

    if updated_at__lte:
        val = datetime.strptime(updated_at__lte, '%Y-%m-%d')
        filtered_items = [item for item in filtered_items if item.get('updated_at') is not None and val > datetime.strptime(item.get('updated_at'), "%Y-%m-%dT%H:%M:%SZ")]
    
    if updated_at__gte:
        val = datetime.strptime(updated_at__gte, '%Y-%m-%d')
        filtered_items = [item for item in filtered_items if item.get('updated_at') is not None and val < datetime.strptime(item.get('updated_at'), "%Y-%m-%dT%H:%M:%SZ")]

    if created_at__lte:
        val = datetime.strptime(created_at__lte, '%Y-%m-%d')
        filtered_items = [item for item in filtered_items if item.get('created_at') is not None and val > datetime.strptime(item.get('created_at'), "%Y-%m-%dT%H:%M:%SZ")]
    
    if created_at__gte:
        val = datetime.strptime(created_at__gte, '%Y-%m-%d')
        filtered_items = [item for item in filtered_items if item.get('created_at') is not None and val < datetime.strptime(item.get('created_at'), "%Y-%m-%dT%H:%M:%SZ")]


    return render_template(
        "list.html",
        repos=filtered_items,
        created_at__gte=created_at__gte if created_at__gte else "",
        created_at__lte=created_at__lte if created_at__lte else "",
        updated_at__gte=updated_at__gte if updated_at__gte else "",
        updated_at__lte=updated_at__lte if updated_at__lte else "",
    )



@app.route("/api/v1/data")
def api_data():
    request = jsonify(data)
    request.headers.add("Access-Control-Allow-Origin", "*")
    return request


@app.route("/api/v1/repos")
def api_repos():
    request = jsonify(repos)
    request.headers.add("Access-Control-Allow-Origin", "*")
    return request


@app.route("/api/v1/user_repos")
def api_users():
    request = jsonify(user_repos)
    request.headers.add("Access-Control-Allow-Origin", "*")
    return request


@app.route("/api/v1/user_repos/<string:semester>")
def api_users_semester(semester):
    semester_data = {'22W': ["1990Flori", "AKHILB007"], '22S': ["Aleksar05", "Alexandra18636"]} # Make this importable from a file

    if semester in semester_data.keys():
        users = semester_data[semester]
    else:
        abort(404)

    request = jsonify({user:user_repos[user] for user in users})
    request.headers.add("Access-Control-Allow-Origin", "*")
    return request


@app.route("/api/v1/users/<string:user_name>")
def api_user(user_name):
    users = leaderboard.users
    user = [users[user] for user in users.keys() if user == user_name]
    if len(user) == 0:
        abort(404)
    request = jsonify(user[0])
    request.headers.add("Access-Control-Allow-Origin", "*")
    return request

@app.route('/github_push', methods=['POST'])
def github_push():
    data = request.json
    header = request.headers.get("X-GitHub-Event")
    if header == 'push':
        pass
    if header == 'commit_comment':
        pass
    if header == _:
        pass

    print(f'Issue {data}')
    return data

if __name__ == "__main__":
    app.run()
