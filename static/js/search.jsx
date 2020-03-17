class Search extends React.Component {    
  constructor() {
    super();
    this.state = {search: undefined,
                  miles: 100, 
                  thickness: 'large,xlarge',
                  color: 'Color',
                  breed: 'Breed',
                  coat: 'Coat Length',
                  gender: 'Gender',
                  catResults: undefined,
                  currentlySelectedCat: undefined,
                  selectedCatShelter: undefined,
                  colArr: [],
                  catBreeds: []};
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.noResults = this.noResults.bind(this);
  }

  componentDidMount() {
    $.get('/breeds.json', (response) => {this.setState({catBreeds: response.breeds})});
    $.get('/colors.json', (response) => {this.setState({colArr: response.colors})});
  }

  handleInput(e) {
    if (this.state.catResults) {
      if (e.target.name === 'search' && this.state.search !== undefined
          && e.target.value !== this.state.search) {
          let newSearch = e.target.value
          this.setState({color: 'Color', breed: 'Breed', gender: 'Gender', 
                        coat: 'Coat Length', search: newSearch}, (e) => {this.handleSubmit(e)});
      }
      else {
       this.setState({[e.target.name]: e.target.value}, (e) => {
         this.handleSubmit(e)});
      }
    }
    else {
      this.setState({[e.target.name]: e.target.value});
    }
  }

  inputNew(e) {
    if (e.target.name === 'search' && e.target.value !== this.state.search) {
        let newSearch = e.target.value
        this.setState({color: 'Color', breed: 'Breed', gender: 'Gender', 
                      coat: 'Coat Length', search: newSearch}, (e) => {this.handleSubmit(e)});
      }
      else {
       this.setState({[e.target.name]: e.target.value}, (e) => {
         this.handleSubmit(e)});
      }
    }

  handleSubmit(e) {
    if (this.state.catResults === undefined) {
      e.preventDefault();
    }
    let search = this.state.search;
    let miles = this.state.miles;
    let thickness = this.state.thickness;
    let color = this.state.color;
    let breed = this.state.breed;
    let coat = this.state.coat;
    let gender = this.state.gender;
    let search_data = {search: search,
                       miles: miles,
                       thickness: thickness,
                       color: color,
                       breed: breed,
                       coat: coat,
                       gender: gender};
    $.post('/results.json', search_data, (response) => {this.noResults(response)});
  }  

  noResults(response) {
    if (response === null || response.length === 0) {
      alert('Sorry, no results fit your search criteria.')
    }
    else {
      this.setState({catResults: response})
    }
  }

  updateCurrentlySelectedCat(selectedCat) {
    for (const newCat of this.state.catResults) {
      if (selectedCat === newCat['cat_id']) {
        if (newCat['shelter_id']) {
          let shelterId = newCat['shelter_id']
          let shelter = {'shelter_id': shelterId}
          $.post('/shelter.json', shelter, (response) => {
            this.setState({currentlySelectedCat: newCat, selectedCatShelter: response[0]}, () => {$('#moreDetailsModal').modal('show')});
          });     
        }
      }
    }
  }


  render() {

    if (this.state.catResults === undefined) {
      return (
        <div>
          <div>

            <nav className="navbar navbar-expand-lg navbar-light" id='main-nav'>
              <a className="navbar-brand" id='navmain'>chonkrs</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" 
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <ul className="nav-item" id='faqbtn'>
                    <button type="button" className="btn btn-primary" id='faqbtn'
                    onClick={() => {$('#faqModal').modal('show')}}>About</button> 
                  </ul>
                </ul>
              </div>
            </nav>

           <div className="modal fade bd-example-modal-lg" id="faqModal" tabIndex="-1" 
              role="dialog" aria-labelledby="faqModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" id='faqs'>
              <div className="modal-content" id='faqs'>
                <div className="modal-header" id='chonkDef'>
                  <h4 className="modal-title" id="faqModalLabel">
                  Chonk: that which is fat or large, in a way that is majestic</h4>
                </div>
                <div className="modal-body">
                  <h5 id='defs'>chonkrs Filter Definitions</h5>
                  <p id='defs'> All Chonks Need Love: displays both jumbo and colossal chonks<br/>
                    Jumbo Chonk: large in size, 30-40% body fat <br/>
                    Colossal Chonk: extra large in size, 40-50% body fat
                  </p>
                <img className='col-md-12' id='chart' src='static/img/chonkchart.png'/>
                </div>
              </div>
            </div>
          </div>
          </div>

          <div className='container' id='main'>
          <div id='mainTubs'>
            <div className='col-xs-6 col-xs-offset-3 col-lg-12' id='maintcon'>
                <div className='row' id="main">
                  <div id='logo' className='col-centered text-center'>
                    <h1 className='logo'>chonkrs</h1>
                  <form>
                    <div id='search' className='intial-search'>
                      <input className='form-control' name='search' type='text' 
                        placeholder='San Francisco, CA' required onChange={this.handleInput}>
                      </input>
                      <button id='chonk-btn' className='btn btn-success' type='submit' 
                        onClick={this.handleSubmit}>I'm Feeling Chonky
                      </button>
                    </div>        
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    }

    else {
      return (
        <div id='res'>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button className="navbar-toggler" type="button" data-toggle="collapse" 
            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
            aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
            <form className="form-inline my-2 my-lg-0">
              <div className="md-form my-0">
              <select className="form-control mr-sm-2" name='thickness' id='thickness' 
              defaultValue={this.state.thickness} onChange={this.handleInput}>
                <option value='large,xlarge'>All Chonkers Need Love</option>
                <option value='large'>Jumbo Chonk</option>
                <option value='xlarge'>Colossal Chonk</option>             
              </select>
              </div>
              <div className="md-form my-0">
              <select className="form-control mr-sm-2"  name='miles' id='milesQ' 
                defaultValue={this.state.miles} onChange={this.handleInput}>
                <option value='10'>10 Miles</option>
                <option value='25'>25 Miles</option>
                <option value='50'>50 Miles</option>
                <option value='100'>100 Miles</option>
              </select>           
              </div>
               <div className="md-form my-0">
                <input className="form-control mr-sm-2" name='search' id='search' 
                  defaultValue={this.state.search} type='text' 
                  onChange={this.handleInput}></input>
               </div>
              </form>
            </ul>
           </div>
         </nav>
          <div id="response-all-cats">
            <TubboContainer
              cats={this.state.catResults}
              arr={this.state.colArr}
              breedArr={this.state.catBreeds}
              updateSelectedCat={this.updateCurrentlySelectedCat.bind(this)}
              newFilter={this.inputNew.bind(this)}
              col={this.state.color}
              bre={this.state.breed}
              cot={this.state.coat}
              gen={this.state.gender}
            /> 
          </div> 
            <div id="cat-more-details">
            {this.state.currentlySelectedCat ?
            <MoreDetails 
              chosenCat={this.state.currentlySelectedCat}
              shelter={this.state.selectedCatShelter}
            /> :
            null
           }
           </div>
        </div>        
      );
    }
  }
}


class TubboContainer extends React.Component {
  constructor(props) {
    super(props);
    this.makeCats = this.makeCats.bind(this);
  }

  makeCats() {
    const cats = [];
    for (const cat of this.props.cats) {
      cats.push(<Cat 
                  key={cat.cat_id}
                  catId={cat.cat_id}
                  name={cat.name}
                  photo={cat.photo_url.medium}
                  gender={cat.gender}
                  breed={cat.breed}
                  coatLen={cat.coat_len}
                  color={cat.color}
                  extraLove={cat.extra_love}
                  kids={cat.environment.kids}
                  dogs={cat.environment.dogs}
                  cats={cat.environment.cats}
                  shelterId={cat.shelter_id}
                  updateSelectedCat={this.props.updateSelectedCat}
                />
               );
    }
    return cats
  }



  render() {
    
    if (this.props.cats) {
      return (
        <div className='container' id='allfilters'>
          <div className='row' id='rep-img'>
          <div className='col-xs-10 col-md-9 order-md-9' id='div-cats'>
            <div id='prop-all-cats'>
              {this.makeCats()}       
            </div>
          </div>
          <div className='col-xs-2 col-md-3 order-md-3' id='div-fil'>
           <form  id='filterResults'>
            <div>
              <div id='colorFilter'>
                <select className="form-control" name='color' 
                defaultValue={this.props.col} onChange={this.props.newFilter}>
                  <option>{this.props.col}</option>
                  <option>Black & Brown</option>
                  {this.props.arr.map((x,y) => <option key={y}>{x}</option>)}
                </select>
              </div>
              <div id='breedFilter'>
                <select className="form-control" defaultValue={this.props.bre}
                   name='breed' onChange={this.props.newFilter}>
                   <option>{this.props.bre}</option>
                   <option>Ragdoll</option>
                   {this.props.breedArr.map((x,y) => <option key={y}>{x}</option>)}        
                </select>
              </div>
              <div id='coatFilter'>
                <select className="form-control" name='coat' 
                  defaultValue={this.props.cot} onChange={this.props.newFilter}>
                  <option>{this.props.cot}</option>
                  <option value='Long'>Long</option>
                  <option value='Medium'>Medium</option>
                  <option value='Short'>Short</option>
                  <option value='Hairless'>Hairless</option>
                </select>
              </div>
                <div id='genderFiler'>
                  <select className="form-control" name='gender' 
                  defaultValue={this.props.gen} onChange={this.props.newFilter}>
                    <option>{this.props.gen}</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </select>        
                 </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      );
    } 

    else {
      return (
       <div></div>
      );
    }
  }
}


class Cat extends React.Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(e) {
    let selectedCat = this.props.catId;
    this.props.updateSelectedCat(selectedCat);
  }

  render() {

    return (
      <div id="individ-cat">
        <a href="#moreDetailsModal">
         <button onClick={this.onButtonClick} id="cat-btn">
            <img className="img-top" src={this.props.photo}/>
            <p id='cat-name'>{this.props.name}</p>
          </button>
        </a>             
      </div>
    );
  }
}


class MoreDetails extends React.Component {
  constructor(props) {
    super(props)
    this.googleMapRef = React.createRef()
  }

  componentDidMount() {
    const googleMapScript = document.createElement("script")
    googleMapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDC-y1dMTTh5g5dhr5KmpnOg7FEt5FB3Es&libraries=places'
    window.document.body.appendChild(googleMapScript)
    googleMapScript.addEventListener('load', () => {
      this.shelter = this.geo() 
     });
  }


  geo = () => {
    let shel = this.props.shelter['location'];
    let address = shel['address'] + ',' + shel['city'] + ',' + shel['state'] + ',' + 'United States';
    let geocoder = new google.maps.Geocoder();
    let map;
    let mapOptions;
    geocoder.geocode({'address': address}, (results) => {
      mapOptions = {zoom: 14,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()}
      map = new window.google.maps.Map(this.googleMapRef.current, mapOptions);
      map.setCenter(results[0].geometry.location);
      let marker = new window.google.maps.Marker({map: map, 
                                                  position: results[0].geometry.location,
                                                  icon: { 
                                                    url:'static/img/cat19-512.png',
                                                    scaledSize: {width: 50,
                                                                 height: 50}
                                                 }});
      return marker
    });
  }


  render() {

    return (
      
      <div id='fatty-modal'>
        <div className="modal right fade" id="moreDetailsModal" tabIndex="-1" 
              role="dialog" aria-labelledby="moreDetailsModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="moreDetailsModalLabel">{this.props.chosenCat.name}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                </button>
                  <span aria-hidden="true">&times;</span>
              </div>
              <div className="modal-body">
                <div id='catSummary'>
                  <img className="img-top" id='modal-pic' src={this.props.chosenCat.photo_url.medium}/>
                </div>
                <div id='about'>
                  <br></br>
                  <h5 id='aboutCat'>About</h5>
                  <p>
                    Breed:&nbsp;{this.props.chosenCat.breed}
                      <br></br>
                    Gender:&nbsp;{this.props.chosenCat.gender}
                      <br></br>                                            
                    Coat Length:&nbsp;{this.props.chosenCat.coat_len}
                      <br></br>
                    Coat Color:&nbsp;{this.props.chosenCat.color}
                      <br></br>
                  </p>
                </div>
                {
                <div id='shelterSummary'>
                  <h5 id='shelTitle'>{this.props.shelter['name']}</h5>
                  <div id='map' ref={this.googleMapRef} style={{width: 350, height: 250}}></div>
                  <p>
                  <br></br>
                    <b>Address:</b> 
                      <br></br>
                      {this.props.shelter['location']['address']}
                      <br></br>
                      {this.props.shelter['location']['city']},&nbsp;
                      {this.props.shelter['location']['state']}&nbsp;
                      {this.props.shelter['location']['zipcode']}
                      <br></br>
                      {this.props.shelter['email']}
                      <br></br>
                      {this.props.shelter['phone']}
                  </p>
                </div>
              }
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" id='favs-btn'>Save to Favs</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

      

ReactDOM.render(
  <Search />,
  document.getElementById('app')
);