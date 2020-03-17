from jinja2 import StrictUndefined
from flask import Flask, render_template, redirect, request, flash, session, jsonify
import petfinder
from model import connect_to_db, db


app = Flask(__name__)
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def react():

    return render_template('search_react.html')


@app.route('/results.json', methods=['POST'])
def cat_results_react():
    """Based on user search, display cats - get animals endpoint"""

    location_search = request.form.get('search')
    if location_search == 'San Francisco, CA':
        cats = petfinder.fake_cat_data_map()
        if cats:
            cats = list(cats.values())
        else:
            cats = cats  
    
    else:
        cats = petfinder.search_data_map()
        cats = list(cats.values())

    return jsonify(cats)


@app.route('/breeds.json')
def get_cat_breeds():
    """returns possible cat breed parameters"""
    
    breeds = petfinder.get_breeds()
    return jsonify(breeds)


@app.route('/colors.json')
def get_coat_colors():
    """returns possible cat coat colors"""

    colors = petfinder.get_colors()
    return jsonify(colors)


@app.route('/shelter.json', methods=['POST'])
def tubbo_location():
    """Returns shelter information for selected cat from results"""
    shelter_id = request.form.get('shelter_id')
    shelter = petfinder.shelter_data_map(shelter_id)
    shelter = list(shelter.values())

    return jsonify(shelter)



# @app.route('/')
# def index():
#     """Homepage, search bar"""

#     #add a login button - redirect to /login-form
#     #add sign-up button - redirect to /sign-up-form
    
#     return render_template("homepage.html")


# @app.route('/search-results', methods=['POST'])
# def cat_results():
#     """Based on user search, display cats - get animals endpoint"""

#     cats = petfinder.search_data_map()
#     cats = list(cats.values())

#     return render_template('search_results.html',
#                             cats=cats)


# @app.route('/more-details/<cat_id>/<shelter_id>')
# def cat_details(cat_id, shelter_id): 
#     """Display full cat and shelter details when a cat is selected
#        Use get animal and get organization endpoints"""

#     shelter = petfinder.shelter_data_map(shelter_id)
#     shelter = list(shelter.values())
#     cat = petfinder.cat_data_map(cat_id)
#     cat = list(cat.values())

#     return render_template('more_details.html',
#                             shelter=shelter,
#                             cat=cat)




if __name__ == "__main__":
    app.debug = True
    app.jinja_env.auto_reload = app.debug
    connect_to_db(app)
    app.run(port=5000, host='0.0.0.0')
