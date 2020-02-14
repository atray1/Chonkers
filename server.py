from jinja2 import StrictUndefined
from flask import Flask, render_template, redirect, request, flash, session, jsonify
import petfinder
from model import connect_to_db, db


app = Flask(__name__)
#app.secret_key = "ABC"
app.jinja_env.undefined = StrictUndefined

@app.route('/')
def index():
    """Homepage, search bar"""

    #add a login button - redirect to /login-form
    #add sign-up button - redirect to /sign-up-form
    
    return render_template("homepage.html")


@app.route('/search-results')
def cat_results():
    """Based on user search, display cats - get animals endpoint"""

    cats = petfinder.search_data_map()
    cats = list(cats.values())

    return render_template('search_results.html',
                            cats=cats)


    #React thoughts/notes
    # your going to return cats as a json and react will hit this endpoint
    # to get the returned cats response data
    # react component - divs for each cat
    # react props - unique information for each cat


@app.route('/more-details/<cat_id>/<shelter_id>')
def cat_details(cat_id, shelter_id): 
    """Display full cat and shelter details when a cat is selected
       Use get animal and get organization endpoints"""

    shelter = petfinder.shelter_data_map(shelter_id)
    shelter = list(shelter.values())
    cat = petfinder.cat_data_map(cat_id)
    cat = list(cat.values())

    return render_template('more_details.html',
                            shelter=shelter,
                            cat=cat)

    #if user selects <3 to favorite a cat then redirct to the login page


@app.route('/sign-up-form')
def sign_up_form():
    """Chonker sign-up form"""


@app.route('/sign-up-verification')
def sign_up():
    """Chonkers sign up verification"""
    #POST - the info coming from the sign-up-form

    #get username and password that was filled in sign-up form
    #if username exits - flash "username taken" and redirct to /sign-up-form

    #else save the new user to the database - user table, flash success message
    #and redirect back to /more-details/cat_id


@app.route('/login-form')
def login_form():
    """Chonkers login page"""

    #have sign up button which should redirect to sign-up-form


@app.route('/login-verification')
def login():
    """Chonkers login verification"""

    #check if user exists and if the username and password match
    #if the username does not exists then flash username does not exist 
        #redirect to sign up page
        #or maybe redirect to login in form that has a sign up button
    #if password and username don't match then flash word password


@app.route('/save-cat')
def save_cat():
    """Save cat to database - favorites table"""

    #if cat is already there then flash cat already saved to favs
    #else commit c


@app.route('/favorite-cats')
def display_fav_cats():
    """Display cats on users favorites list"""

    #display cat general info from db
    #have a delete button/option
        #commit changes to the db
    #if the user clicks the cat for more details, redirect to /more-details/<int:cat_id>



if __name__ == "__main__":
    app.debug = True
    app.jinja_env.auto_reload = app.debug
    connect_to_db(app)
    app.run(port=5000, host='0.0.0.0')
