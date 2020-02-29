def fake_fatties():

    fatty_dict = {}

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
        
        
    return fatty_dict