import requests
import os
from pprint import pformat
from flask import request
import json
import fake_chonks


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


def get_breeds():
    """returns possible cat breed parameters"""
    
    token = get_token()
    atype = 'cat'
    url = 'https://api.petfinder.com/v2/types/'+ atype +'/breeds'
    headers = {'Authorization': token}
    payload = {'type': atype}
    response = requests.get(url, headers=headers, params=payload)
    data = response.json()
    breeds = {}
    breeds['breeds'] = []
    for breed in data['breeds']:
        breeds['breeds'].append(breed['name'])

    return breeds


def get_colors():
    """returns possible coat colors"""

    token = get_token()
    url = 'https://api.petfinder.com/v2/types'
    headers = {'Authorization': token}
    response = requests.get(url, headers=headers)
    data = response.json()
    colors = {}
    for color in data['types']:
        if color['name'] == 'Cat':
            colors['colors'] = color['colors']

    return colors


def search_petfinder():
    """Return API response based on user search input, get animals endpoint"""
    
    token = get_token()
    url = 'https://api.petfinder.com/v2/animals'
    headers = {'Authorization': token}
    location_search = request.form.get('search')
    miles = int(request.form.get('miles', '100'))
    size = request.form.get('thickness', '')
    color = request.form.get('color', '')
    breed = request.form.get('breed', '')
    coat = request.form.get('coat', '')
    gender = request.form.get('gender', '')
   
    payload = {'type': 'Cat',
                   'limit': 25, 
                   'location': location_search,
                   'color': color,
                   'distance': miles,
                   'breed': breed,
                   'coat': coat,
                   'gender': gender,
                   'size': size}
    
    response = requests.get(url, headers=headers, params=payload)
    data = response.json() 
    
    return data


def search_data_map():
    """Mapping function to extract relevant information from search_petfinder"""
    
    fatty_dict = {}
    cats = search_petfinder()
    location_search = request.form.get('search')

    if location_search == 'San Francisco, CA':
        for cat in open('test.txt'):
            cat = cat.rstrip()
            cat = cat.split('|')
            fatty_dict[cat[0]] = {'cat_id': cat[0],
                            'name': cat[1],
                            'gender': cat[2],
                            'breed': cat[3],
                            'shelter_id': cat[4],
                            'photo_url': {'medium': cat[5],
                                          'large': ''},
                            'coat_len': cat[6],
                            'color': cat[7],
                            'extra_love': cat[8],
                            'environment': {'kids': cat[9],
                                            'dogs': cat[10],
                                            'cats': cat[11]}}

    else:
        for cat in cats['animals']:
            if cat['photos'] != []:
                fatty_dict[cat['id']] = {
                                'cat_id': cat['id'],
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


def shelter_info(shelter_id):
    """Return API response for shelter information using the organization ID 
    associated to the cat from search_petfinder, get organization endpoint"""
    
    token = get_token()
    url = 'https://api.petfinder.com/v2/organizations/' + shelter_id
    headers = {'Authorization': token}
    payload = {'id': shelter_id}
    response = requests.get(url, headers=headers, params=payload)
    data = response.json()
    
    return data


def shelter_data_map(shelter_id):
    """Mapping function to extract relevant information from shelter_info"""

    shelter_details = {}
    shelter = shelter_info(shelter_id)
    org = shelter['organization']
    
    shelter_details[org['id']] = {
                            'shelter_id': org['id'],
                            'name': org['name'],
                            'phone': org['phone'],
                            'email': org['email'],
                            'url': org['url'],
                            'location': {'address': org['address']['address1'],
                                         'city': org['address']['city'],
                                         'state': org['address']['state'],
                                         'zipcode': org['address']['postcode'],
                                         'country': org['address']['country']}
                            }

    return shelter_details





