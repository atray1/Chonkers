import requests
import os
from pprint import pformat
from flask import request
import json

#note: . secrets.sh everytime you open the terminal

API_KEY = os.environ['PETFINDER_KEY']
SECRET_KEY = os.environ['PETFINDER_SECRET']

def get_token():
    """Returns authorization token from petfinder"""
    
    url = "https://api.petfinder.com/v2/oauth2/token"
    data = {'grant_type': 'client_credentials',
            'client_id': API_KEY,
            'client_secret': SECRET_KEY}
    response = requests.post(url, data=data)
    res = response.json()
    token = res['token_type'] + ' ' + res['access_token']

    return token


def search_petfinder():
    """Return API response based on user search input, get animals endpoint"""

    token = get_token()
    url = 'https://api.petfinder.com/v2/animals'
    headers = {'Authorization': token}
    location_search = request.args.get('search', '')
    miles = int(request.args.get('miles', ''))
    size = request.args.get('thickness', '')
    
    if size == 'large':
        payload = {'type': 'Cat',
                   'limit': 5, 
                   'location': location_search,
                   'distance': miles,
                   'size': 'large'}
        response = requests.get(url, headers=headers, params=payload)
        data = response.json() #python dictionary
    else:
        payload = {'type': 'Cat',
                   'limit': 5, 
                   'location': location_search,
                   'distance': miles,
                   'size': 'xlarge'}
        response = requests.get(url, headers=headers, params=payload)
        data = response.json()

    return data


def search_data_map():
    """Mapping function to extract relevant information from search_petfinder"""
    
    fatty_dict = {}
    cats = search_petfinder() 

    for cat in cats['animals']:
        fatty_dict[cat['id']] = {
                        'name': cat['name'], 
                        'gender': cat['gender'],
                        'breed': cat['breeds']['primary'],
                        'shelter_id': cat['organization_id'], 
                        'photo_url': {'medium': cat['photos'][0]['medium'], 
                                      'large': cat['photos'][0]['large']},
                        'coat_len': cat['coat'],
                        'color': cat['colors']['primary'],
                        'extra_love': cat['attributes']['special_needs'],
                        'environment': {'kids': cat['environment']['children'],
                                        'dogs': cat['environment']['dogs'],
                                        'cats': cat['environment']['cats']}
                        }
                        
    return fatty_dict


def shelter_info():
    shelter_id = 'CA560'
    """Return API response for shelter information using the organization ID 
    associated to the cat from search_petfinder, get organization endpoint"""
    token = get_token()
    url = 'https://api.petfinder.com/v2/organizations/' + shelter_id
    headers = {'Authorization': token}
    payload = {'id': shelter_id}
    response = requests.get(url, headers=headers, params=payload)
    data = response.json()
    
    return data


def shelter_data_map():
    """Mapping function to extract relevant information from shelter_info"""

    shelter_details = {}
    shelter = shelter_info()
    org = shelter['organization']
    
    shelter_details[org['id']] = {
                            'name': org['name'],
                            'phone': org['phone'],
                            'email': org['email'],
                            'url': org['url'],
                            'loaction': {'address': org['address']['address1'],
                                         'city': org['address']['city'],
                                         'state': org['address']['state'],
                                         'zipcode': org['address']['postcode'],
                                         'country': org['address']['country']}
                            }

    return shelter_details

# demo show SF, if SF location is chosen then get images from the database and not the API
##select random images but keep track of what's being pulled

#use animal id (in the API) to store cats to favorites. 
##this will be the foregin key in the favorites tables which is the primary key of the cats table

#you can use sessions to check if someone is logged in (example)


#data - dict
#data[animals] - type is list - list of all the animals in the response
#data[animals][0] - type is dict - dict of all the details of the animal at index 0

