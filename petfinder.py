import requests
import os
from flask import request
import json


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


def fake_cat_data_map():
    """Fake cat data with dynamic filtering"""

    location_search = request.form.get('search')
    miles = int(request.form.get('miles', '100'))
    size = request.form.get('thickness', 'large,xlarge')
    color = request.form.get('color', 'Color')
    breed = request.form.get('breed', 'Breed')
    coat = request.form.get('coat', 'Coat Length')
    gender = request.form.get('gender', 'Gender')

    fatty_dict = {}
    fatty_filter = {}
    chonk_filter = {}
    for cat in open('fakeChonksForFun.txt'):
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
                                        'cats': cat[11]},
                        'size': cat[12]}

    if breed == 'Breed' and color == 'Color' and coat == 'Coat Length' and gender == 'Gender' and size == 'large,xlarge':
        return fatty_dict

    else:
        b = breed == 'Breed'
        cl = color == 'Color'
        g = gender == 'Gender'
        ct = coat == 'Coat Length'
        s = size == 'large,xlarge'
        for c_id, info in fatty_dict.items():
            col = info['color'] == color
            bre = info['breed'] == breed
            cot = info['coat_len'] == coat
            gen = info['gender'] == gender
            si = info['size'] == size
            if ((col and bre and cot and gen and si) or
                (b and col and cot and gen and si) or (cl and bre and cot and gen and si) or 
                (ct and col and bre and gen and si) or (g and col and cot and bre and si) or
                (s and col and cot and bre and gen) or (b and cl and cot and g and s) or 
                (b and col and ct and g and s) or (bre and cl and ct and g and s) or
                (b and cl and ct and g and si) or (b and cl and ct and gen and s) or
                (b and cl and cot and gen and si) or (b and col and ct and gen and si) or
                (b and col and cot and g and si) or (cl and b and cot and gen and si) or
                (cl and bre and ct and gen and si) or (cl and bre and cot and g and si) or 
                (ct and b and col and gen and si) or (ct and bre and cl and gen and si) or
                (ct and bre and col and g and si) or (g and b and col and cot and si) or
                (g and bre and cl and cot and si) or (g and bre and col and ct and si) or                
                (s and b and col and cot and si and gen) or (s and bre and cl and cot and si and gen) or
                (s and bre and col and ct and si and gen) or (b and cl and ct and gen and si) or
                (b and cl and cot and g and si) or (b and col and ct and g and si) or
                (b and col and cot and g and s) or (cl and b and ct and gen and si) or
                (cl and b and cot and g and si) or (cl and bre and ct and g and si) or
                (cl and bre and cot and g and s) or (ct and b and cl and gen and si) or
                (ct and b and col and g and si) or (ct and bre and cl and g and si) or
                (ct and bre and col and g and s) or (g and b and cl and cot and si) or
                (g and b and col and ct and si) or (g and bre and cl and ct and si) or
                (g and bre and col and ct and s) or (s and b and cl and cot and gen) or
                (s and b and col and ct and gen) or (s and bre and cl and ct and gen) or
                (s and bre and col and ct and g)): 
                fatty_filter[c_id] = info
        if fatty_filter:
            return fatty_filter


def search_data_map():
    """Mapping function to extract relevant information from search_petfinder"""
    
    fatty_dict = {}
    cats = search_petfinder()
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


