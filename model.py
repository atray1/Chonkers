from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Shelter(db.Model):
    """Animal Shelters for Favorited cats"""

    __tablename__ = "shelters"

    shelter_id = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    address = db.Column(db.String(150), nullable=False)
    city = db.Column(db.String(25), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zipcode = db.Column(db.String(15), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(25), nullable=True)
    url = db.Column(db.String(1500), nullable=True)


class Cat(db.Model):
    """Cat data that a user favorited"""

    __tablename__ = "cats"

    cat_id = db.Column(db.Integer, primary_key=True,)
    name = db.Column(db.String(25), nullable=False,)
    gender = db.Column(db.String(6), nullable=False,)
    breed = db.Column(db.String(20), nullable=True,)
    photo_url = db.Column(db.String(1500), nullable=False,)
    shelter_id = db.Column(db.String, 
                           db.ForeignKey('shelters.shelter_id'),
                           nullable=False,)

    shelter = db.relationship('Shelter')

    # if a user favs a cat then the cat info should be saved in this table

class Favorite(db.Model)
    """User favorites list"""

    __tablename__ = "favorites"

    fav_id = db.Column(db.Integer, autoincrement=True, primary_key=True,)
    cat_id = db.Column(db.Integer,
                       db.ForeignKey('cats.cat_id'),
                       nullable=False,)
    user_id = db.Column(db.Integer,
                        db.ForeignKey('users.user_id'),
                        nullable=False,)

    cat = db.relationship('Cat')
    user = db.relationship('User')


class User(db.Model)
    """User of Chonkers"""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True,)
    username = db.Column(db.String(25), unique=True, nullable=False,)
    password = db.Column(db.String(50), nullable=False,)


def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our PstgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///Chonkers'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    from server import app
    connect_to_db(app)
    print("Connected to DB.")
