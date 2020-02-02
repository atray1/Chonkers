from jinja2 import StrictUndefined
from flask import Flask, render_template, redirect, request, flash, session
import petfinder
from model import connect_to_db, db


app = Flask(__name__)
#app.secret_key = "ABC"
app.jinja_env.undefined = StrictUndefined

@app.route('/')
def index():
    """Homepage, search bar"""

    #add a login in button - redirect to /login-form
    #add sign-up button - redirect to /sign-up-form
    
    return render_template("homepage.html")


@app.route('/search-results')
def cat_results():
    """Based on user search, display cats - get animals endpoint"""

    cats = petfinder.search_petfinder()
    return cats
    #React thoughts/notes
    # your going to return cats as a json and react will hit this endpoint
    # to get the returned cats response data
    # react component - divs for each cat
    # react props - unique information for each cat

    #NOTES
    #API response cat data format
    # for cat in cats['animals']:
    #     cat_id = cat['id']
    #     breed = cat['breeds']['primary']
    #     name = cat['name']
    #     gender = cat['gender']
    #     organization_id = cat['organization_id'] -> use to get shelter info
                                                    # using get organization endpoint

#AB
# {1: {'name': 'fatty', shelter: 7389} 2: {}}

# parse this information from the API 

# in your template loop over this info 

# <div data-shelter-number={cat.shelter}>
#     Name: {cat.name}
#     <a href='/more-details/{cat.id}'
# </div>



@app.route('/more-details/<int:cat_id>/')
def cat_details(cat_id): 
    #ask about this since it't not saved to the db
    #do I have to make a requests to both the get animal and get organization endpoints
    #I'm not clear on how i am to grab the cat_id and shelter_id for the API requests

    """Display full cat and shelter details when a cat is selected
       Use get animal and get organization endpoints"""

    #info will come from the API directly
    #if user selects <3 to favorite a cat then redirct to the login page
    
    #AB
    #render_template

@app.route('/sign-up-form')
def sign_up_form():
    """Chonker sign-up form"""


@app.route('/sign-up-verification')
def successful_sign_up():
    """Chonkers sign up verification"""

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
